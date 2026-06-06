import { makeTempDir, removeDir } from '../util/fs.js';
import * as defaultGit from '../util/git.js';

/**
 * Executa `run(cloneDir)` sobre um clone temporário shallow da origem e
 * **garante a remoção do diretório temporário ao final — em sucesso OU falha**
 * (CRIT-06, REGRA-08): o `finally` cobre erro de clone e erro do próprio `run`.
 *
 * Ordem: assert git → cria temp → clona → run → (sempre) remove temp.
 * Se o git estiver ausente, falha antes de criar qualquer temp (E-01a). Se o
 * clone falhar, o temp (eventualmente parcial) é removido (E-01b).
 *
 * O parâmetro `git` é injetável para teste (sem rede); em produção usa o
 * wrapper real de `../util/git.js`.
 *
 * @template T
 * @param {{from: string, ref?: string|null}} source
 * @param {(cloneDir: string) => Promise<T>} run
 * @param {{git?: typeof defaultGit}} [deps]
 * @returns {Promise<T>}
 */
export async function withTempClone({ from, ref }, run, { git = defaultGit } = {}) {
  await git.assertGitAvailable();

  const tempDir = await makeTempDir();
  try {
    await git.cloneShallow(from, ref, tempDir);
    return await run(tempDir);
  } finally {
    await removeDir(tempDir);
  }
}
