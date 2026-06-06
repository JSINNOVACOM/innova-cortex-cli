import { existsSync } from 'node:fs';
import { mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { copyTree } from '../util/fs.js';

/**
 * Layout da governança no clone e cópia do **núcleo** (REGRA-01, CRIT-01/12).
 *
 * As três listas abaixo são a **fonte da verdade** do que o `init` instala — a
 * documentação do CLI é gerada a partir delas (REGRA-01). O `init` copia apenas
 * a governança operacional, nunca o material institucional do repo OSS.
 */

/** Diretórios do núcleo copiados integralmente. */
export const INCLUDE_DIRS = [
  '01-regras', '02-agentes', '03-skills', '04-templates',
  '08-orquestracao', '10-padroes-tecnicos',
];

/** Arquivos avulsos da raiz da governança copiados. */
export const INCLUDE_FILES_AT_ROOT = ['Claude.md'];

/**
 * Padrões nunca copiados. Atuam como allowlist no topo (só os INCLUDE entram) e,
 * defensivamente, são filtrados dentro das árvores copiadas — assim um eventual
 * `README.md`/`LICENSE`/`.git/` aninhado num INCLUDE_DIR não vaza. Diretórios
 * terminam em `/`; o resto casa nome de arquivo.
 */
export const EXCLUDE_PATTERNS = ['examples/', 'LICENSE', 'README.md', '.gitignore', '.git/'];

/**
 * Decide se uma entrada (basename) deve ser barrada por {@link EXCLUDE_PATTERNS}.
 * @param {string} name
 * @param {boolean} isDir
 * @returns {boolean}
 */
function isExcluded(name, isDir) {
  return EXCLUDE_PATTERNS.some((pattern) =>
    pattern.endsWith('/') ? isDir && name === pattern.slice(0, -1) : !isDir && name === pattern,
  );
}

/**
 * Detecta a raiz da governança dentro do clone (CRIT-12, REGRA-01).
 *
 * Desde o OSS v0.2.2 a governança é publicada sob `<clone>/cortex/` (separada de
 * `examples/`, `README.md`, `LICENSE` na raiz). Logo: se existir
 * `<clone>/cortex/Claude.md`, a raiz é `cortex/`; senão (layout legado), é a
 * própria raiz do repo. Resolve `F-3.1` por construção.
 *
 * @param {string} cloneDir raiz do clone temporário
 * @returns {string} caminho absoluto da raiz da governança
 */
export function resolveGovernanceRoot(cloneDir) {
  const cortexSub = join(cloneDir, 'cortex');
  if (existsSync(join(cortexSub, 'Claude.md'))) return cortexSub;
  return cloneDir;
}

/**
 * Copia o núcleo da governança de `governanceRoot` para `destDir`, aplicando a
 * allowlist (INCLUDE_DIRS + INCLUDE_FILES_AT_ROOT) e o filtro EXCLUDE_PATTERNS
 * (CRIT-01, REGRA-01). Só copia o que existe na origem — entradas ausentes são
 * puladas sem erro (esta camada não valida a origem; a UX de erro é do `init`).
 *
 * @param {string} governanceRoot raiz da governança (ver {@link resolveGovernanceRoot})
 * @param {string} destDir destino do núcleo (tipicamente `<staging>/.cortex`)
 * @returns {Promise<string[]>} lista das entradas efetivamente copiadas
 */
export async function copyGovernanceCore(governanceRoot, destDir) {
  await mkdir(destDir, { recursive: true });
  const copied = [];

  for (const dir of INCLUDE_DIRS) {
    const src = join(governanceRoot, dir);
    if (existsSync(src)) {
      await copyTree(src, join(destDir, dir), (name, isDir) => !isExcluded(name, isDir));
      copied.push(dir);
    }
  }

  for (const file of INCLUDE_FILES_AT_ROOT) {
    const src = join(governanceRoot, file);
    if (existsSync(src)) {
      await copyFile(src, join(destDir, file));
      copied.push(file);
    }
  }

  return copied;
}
