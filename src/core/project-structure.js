import { mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Diretórios mínimos criados pelo `init` (REGRA-05).
 * Se já existirem, não são tocados (CRIT-11, REGRA-09).
 */
export const MINIMAL_DIRS = ['docs/context', 'docs/analysis', 'memory'];

/**
 * Cria a estrutura mínima do projeto de destino (CRIT-03, REGRA-05, REGRA-09).
 *
 * Usa `mkdir({ recursive: true })` — idempotente por design: não falha se o
 * diretório já existe e não altera nem apaga conteúdo preexistente (CRIT-11).
 * O `init` só cria o que falta; trabalho preexistente do projeto é preservado.
 *
 * @param {string} destDir raiz do projeto de destino
 * @returns {Promise<{ created: string[], existing: string[] }>}
 */
export async function createMinimalStructure(destDir) {
  const created = [];
  const existing = [];

  for (const rel of MINIMAL_DIRS) {
    const full = join(destDir, rel);
    const alreadyExists = await access(full).then(() => true, () => false);
    await mkdir(full, { recursive: true });
    (alreadyExists ? existing : created).push(rel);
  }

  return { created, existing };
}
