import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeTempDir, removeDir } from '../src/util/fs.js';
import { buildVersionRecord, formatVersionYaml, writeVersion } from '../src/core/version.js';
import { revParseHead } from '../src/util/git.js';
import { CortexError, ErrorCode } from '../src/util/errors.js';

const SAMPLE = {
  source: 'https://github.com/JSINNOVACOM/innova-cortex',
  ref: 'v0.3.0',
  commit: 'b9bdd90',
  installedAt: '2026-06-05T10:23:00Z',
  cliVersion: '0.2.0',
};

test('buildVersionRecord retorna objeto com os 5 campos exatos (CRIT-04, REGRA-02)', () => {
  const rec = buildVersionRecord(SAMPLE);
  assert.deepEqual(rec, SAMPLE);
});

test('formatVersionYaml inicia com cabeçalho # .cortex/VERSION', () => {
  const yaml = formatVersionYaml(SAMPLE);
  assert.ok(yaml.startsWith('# .cortex/VERSION\n'), `cabeçalho ausente — início: "${yaml.slice(0, 30)}"`);
});

test('formatVersionYaml serializa os 5 campos na ordem correta (REGRA-02)', () => {
  const lines = formatVersionYaml(SAMPLE).split('\n');
  assert.equal(lines[1], `source: ${SAMPLE.source}`);
  assert.equal(lines[2], `ref: ${SAMPLE.ref}`);
  assert.equal(lines[3], `commit: ${SAMPLE.commit}`);
  assert.equal(lines[4], `installed_at: ${SAMPLE.installedAt}`);
  assert.equal(lines[5], `cli_version: ${SAMPLE.cliVersion}`);
});

test('formatVersionYaml termina com newline final', () => {
  assert.ok(formatVersionYaml(SAMPLE).endsWith('\n'));
});

test('writeVersion grava {stagingCortexDir}/VERSION com conteúdo correto (CRIT-04)', async () => {
  const base = await makeTempDir();
  try {
    const stagingCortex = join(base, '.cortex');
    await mkdir(stagingCortex, { recursive: true });
    const record = buildVersionRecord(SAMPLE);

    await writeVersion(stagingCortex, record);

    const written = await readFile(join(stagingCortex, 'VERSION'), 'utf8');
    assert.equal(written, formatVersionYaml(record));
  } finally {
    await removeDir(base);
  }
});

test('revParseHead em diretório não-git lança CortexError GIT_MISSING', async () => {
  const base = await makeTempDir();
  try {
    await assert.rejects(
      () => revParseHead(base),
      (err) => err instanceof CortexError && err.code === ErrorCode.GIT_MISSING,
    );
  } finally {
    await removeDir(base);
  }
});

test('revParseHead no repo do CLI retorna string não-vazia (integração, sem rede)', async () => {
  const projectRoot = fileURLToPath(new URL('..', import.meta.url));
  const commit = await revParseHead(projectRoot);
  assert.ok(typeof commit === 'string' && commit.length > 0, `commit inválido: "${commit}"`);
});
