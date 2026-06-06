import { existsSync } from 'node:fs';
import { mkdir, rename, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { withTempClone } from './clone.js';
import { resolveGovernanceRoot, copyGovernanceCore } from './source-layout.js';
import { materializeClamdMd } from './claude-md.js';
import { createMinimalStructure } from './project-structure.js';
import { buildVersionRecord, writeVersion } from './version.js';
import { removeDir } from '../util/fs.js';
import { CortexError, ErrorCode } from '../util/errors.js';
import * as defaultGit from '../util/git.js';

/** Origem default da governança (REGRA-03). */
export const DEFAULT_SOURCE = 'https://github.com/JSINNOVACOM/innova-cortex';

async function readPackageVersion() {
  const pkgUrl = new URL('../../package.json', import.meta.url);
  return JSON.parse(await readFile(pkgUrl, 'utf8')).version;
}

/**
 * Orquestra o pipeline completo do `init` (CASO-01):
 *
 * 1. Guard REGRA-07: aborta se `.cortex/` já existe (E-01c).
 * 2. Clona a origem num temporário (via {@link withTempClone}, E-01a/b + CRIT-06).
 * 3. Monta `.cortex/` num staging atômico dentro de `destDir` (REGRA-08):
 *    copia o núcleo → grava VERSION → rename atômico (mesmo filesystem).
 * 4. Materializa `CLAUDE.md` a partir da governança instalada (REGRA-04, CRIT-11).
 * 5. Cria estrutura mínima, preservando preexistente (REGRA-05/09, CRIT-03/11).
 *
 * @param {{dest?: string, from?: string, ref?: string, name?: string, objective?: string}} opts
 * @param {{cwd?: string, git?: typeof defaultGit, cliVersion?: string|null}} [deps]
 * @returns {Promise<import('../util/output.js').CommandResult>}
 */
export async function runInit(
  { dest, from, ref, name, objective } = {},
  { cwd = process.cwd(), git = defaultGit, cliVersion = null } = {},
) {
  const destDir = dest ? resolve(dest) : cwd;
  const source = from || DEFAULT_SOURCE;
  const cortexDir = join(destDir, '.cortex');

  // REGRA-07: abortar se .cortex/ já existe (E-01c)
  if (existsSync(cortexDir)) {
    throw new CortexError(
      ErrorCode.CORTEX_EXISTS,
      `'.cortex/' já existe em ${destDir}.`,
      "Use `innova-cortex update` para atualizar a instalação existente.",
    );
  }

  await mkdir(destDir, { recursive: true });

  const version = cliVersion ?? await readPackageVersion();
  const stagingCortex = join(destDir, '.cortex_staging');

  let initResult;
  try {
    initResult = await withTempClone({ from: source, ref }, async (cloneDir) => {
      const governanceRoot = resolveGovernanceRoot(cloneDir);
      const copied = await copyGovernanceCore(governanceRoot, stagingCortex);
      const commit = await git.revParseHead(cloneDir);
      const record = buildVersionRecord({
        source,
        ref: ref || 'latest',
        commit,
        installedAt: new Date().toISOString(),
        cliVersion: version,
      });
      await writeVersion(stagingCortex, record);
      return { copied, record };
    }, { git });

    // Rename atômico: staging → .cortex/ (mesmo filesystem — REGRA-08)
    await rename(stagingCortex, cortexDir);
  } finally {
    // Cleanup idempotente: se rename ok, dir já não existe; se falhou, limpa
    await removeDir(stagingCortex);
  }

  // Template lido da governança já instalada (cortexDir está pronto)
  const claudeMd = await materializeClamdMd(cortexDir, destDir, { name, objective });
  const { created } = await createMinimalStructure(destDir);

  const { copied, record } = initResult;
  return {
    ok: true,
    actions: [
      `governança instalada: ${copied.length} entrada(s) em .cortex/`,
      claudeMd.skipped ? 'CLAUDE.md: preservado (já existia)' : 'CLAUDE.md: criado',
      created.length > 0
        ? `estrutura mínima criada: ${created.join(', ')}`
        : 'estrutura mínima: já existente',
      `VERSION: ${record.ref} @ ${record.commit}`,
    ],
    location: destDir,
    nextStep: 'Abra o projeto no seu editor e chame o agente para começar.',
    warnings: [],
  };
}
