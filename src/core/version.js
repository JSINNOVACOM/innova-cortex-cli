import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Monta o registro de rastreabilidade para o `.cortex/VERSION` (CRIT-04/05, REGRA-02).
 * @param {{source: string, ref: string, commit: string, installedAt: string, cliVersion: string}} fields
 * @returns {{source: string, ref: string, commit: string, installedAt: string, cliVersion: string}}
 */
export function buildVersionRecord({ source, ref, commit, installedAt, cliVersion }) {
  return { source, ref, commit, installedAt, cliVersion };
}

/**
 * Serializa o registro para YAML flat (REGRA-02). Escrito à mão, sem lib (DEC-09).
 * @param {{source: string, ref: string, commit: string, installedAt: string, cliVersion: string}} record
 * @returns {string}
 */
export function formatVersionYaml({ source, ref, commit, installedAt, cliVersion }) {
  return [
    '# .cortex/VERSION',
    `source: ${source}`,
    `ref: ${ref}`,
    `commit: ${commit}`,
    `installed_at: ${installedAt}`,
    `cli_version: ${cliVersion}`,
    '',
  ].join('\n');
}

/**
 * Grava o `.cortex/VERSION` no diretório de staging da governança (CRIT-04, REGRA-02).
 * @param {string} stagingCortexDir diretório `.cortex/` no staging
 * @param {{source: string, ref: string, commit: string, installedAt: string, cliVersion: string}} record
 * @returns {Promise<void>}
 */
export async function writeVersion(stagingCortexDir, record) {
  await writeFile(join(stagingCortexDir, 'VERSION'), formatVersionYaml(record), 'utf8');
}
