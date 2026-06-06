import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Utilitários de filesystem portáveis (REGRA-10): paths via `node:path`, sem
 * shell embutido, sem `chmod`. Nesta fase (TASK-04) só o ciclo de vida de um
 * diretório temporário; cópia de árvore e leitura/escrita chegam na TASK-05+.
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
