import { mkdtemp, rm, mkdir, readdir, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Utilitários de filesystem portáveis (REGRA-10): paths via `node:path`, sem
 * shell embutido, sem `chmod`. Ciclo de vida do diretório temporário (TASK-04)
 * e cópia recursiva de árvore (TASK-05).
 */

/**
 * Cria um diretório temporário único no tmp do SO (portável: Windows/macOS/Linux).
 * @param {string} [prefix] prefixo do nome
 * @returns {Promise<string>} caminho absoluto do diretório criado
 */
export async function makeTempDir(prefix = 'innova-cortex-') {
  return mkdtemp(join(tmpdir(), prefix));
}

/**
 * Remove um diretório recursivamente. Idempotente (`force`): não falha se o
 * caminho já não existir — adequado para uso em `finally` de cleanup.
 * @param {string} path
 * @returns {Promise<void>}
 */
export async function removeDir(path) {
  await rm(path, { recursive: true, force: true });
}

/**
 * Copia recursivamente `srcDir` para `destDir`, criando diretórios conforme
 * necessário. O predicado `keep(name, isDir)` decide, por entrada (basename),
 * o que entra na cópia — entradas recusadas (e suas subárvores) são puladas.
 *
 * Portável (REGRA-10): junção de paths via `node:path`, cópia byte-a-byte com
 * `copyFile` (preserva o conteúdo e o EOL do arquivo de origem), sem shell e
 * sem depender de bits de permissão POSIX. Symlinks e entradas que não sejam
 * arquivo/diretório são ignorados (a governança não os usa).
 *
 * @param {string} srcDir  diretório de origem (deve existir)
 * @param {string} destDir diretório de destino (criado se ausente)
 * @param {(name: string, isDir: boolean) => boolean} [keep] filtro por entrada
 * @returns {Promise<void>}
 */
export async function copyTree(srcDir, destDir, keep = () => true) {
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const isDir = entry.isDirectory();
    if (!entry.isFile() && !isDir) continue; // symlink/socket/etc.: portabilidade
    if (!keep(entry.name, isDir)) continue;

    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name);
    if (isDir) {
      await copyTree(srcPath, destPath, keep);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}
