import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { makeTempDir, removeDir } from '../src/util/fs.js';
import { materializeClamdMd } from '../src/core/claude-md.js';

/** Monta um governanceRoot mínimo com o template necessário. */
async function buildFakeGovernance(base, templateContent) {
  const govRoot = join(base, 'gov');
  await mkdir(join(govRoot, '04-templates'), { recursive: true });
  await writeFile(
    join(govRoot, '04-templates', 'template-claude-md-local.md'),
    templateContent,
    'utf8',
  );
  return govRoot;
}

const TEMPLATE = `# CLAUDE.md — {{PROJECT_NAME}} <!-- TODO: substituir pelo nome do projeto -->

## Projeto

Nome: {{PROJECT_NAME}} <!-- TODO: substituir pelo nome do projeto -->

Objetivo: {{PROJECT_OBJECTIVE}} <!-- TODO: descrever em 1-2 linhas o objetivo do projeto -->
`;

// --- substituições ---

test('substitui {{PROJECT_NAME}} e {{PROJECT_OBJECTIVE}} quando ambos são fornecidos', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, TEMPLATE);
    const dest = join(base, 'dest');
    await mkdir(dest, { recursive: true });

    const result = await materializeClamdMd(gov, dest, { name: 'meu-projeto', objective: 'CLI de instalação' });
    assert.equal(result.skipped, false);

    const content = await readFile(join(dest, 'CLAUDE.md'), 'utf8');
    assert.ok(content.includes('meu-projeto'), 'nome ausente');
    assert.ok(content.includes('CLI de instalação'), 'objetivo ausente');
    assert.ok(!content.includes('{{PROJECT_NAME}}'), 'placeholder PROJECT_NAME ainda presente');
    assert.ok(!content.includes('{{PROJECT_OBJECTIVE}}'), 'placeholder PROJECT_OBJECTIVE ainda presente');
  } finally {
    await removeDir(base);
  }
});

test('remove o <!-- TODO: ... --> adjacente quando o valor é fornecido', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, TEMPLATE);
    const dest = join(base, 'dest');
    await mkdir(dest, { recursive: true });

    await materializeClamdMd(gov, dest, { name: 'proj', objective: 'obj' });
    const content = await readFile(join(dest, 'CLAUDE.md'), 'utf8');
    assert.ok(!content.includes('<!-- TODO:'), 'comentário TODO ainda presente');
  } finally {
    await removeDir(base);
  }
});

test('mantém placeholder e <!-- TODO --> visíveis quando nenhuma flag é fornecida', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, TEMPLATE);
    const dest = join(base, 'dest');
    await mkdir(dest, { recursive: true });

    await materializeClamdMd(gov, dest, {});
    const content = await readFile(join(dest, 'CLAUDE.md'), 'utf8');
    assert.ok(content.includes('{{PROJECT_NAME}}'), 'placeholder PROJECT_NAME ausente');
    assert.ok(content.includes('{{PROJECT_OBJECTIVE}}'), 'placeholder PROJECT_OBJECTIVE ausente');
    assert.ok(content.includes('<!-- TODO:'), 'comentário TODO ausente');
  } finally {
    await removeDir(base);
  }
});

test('substitui só {{PROJECT_NAME}} quando apenas --name é fornecido', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, TEMPLATE);
    const dest = join(base, 'dest');
    await mkdir(dest, { recursive: true });

    await materializeClamdMd(gov, dest, { name: 'apenas-nome' });
    const content = await readFile(join(dest, 'CLAUDE.md'), 'utf8');
    assert.ok(content.includes('apenas-nome'));
    assert.ok(!content.includes('{{PROJECT_NAME}}'));
    assert.ok(content.includes('{{PROJECT_OBJECTIVE}}'), 'PROJECT_OBJECTIVE deveria permanecer');
  } finally {
    await removeDir(base);
  }
});

// --- preservação de existente (CRIT-11 / REGRA-09) ---

test('preserva CLAUDE.md existente e retorna skipped: true (CRIT-11, REGRA-09)', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, TEMPLATE);
    const dest = join(base, 'dest');
    await mkdir(dest, { recursive: true });
    const existing = 'conteúdo preexistente do adotador\n';
    await writeFile(join(dest, 'CLAUDE.md'), existing, 'utf8');

    const result = await materializeClamdMd(gov, dest, { name: 'novo' });
    assert.equal(result.skipped, true);

    const content = await readFile(join(dest, 'CLAUDE.md'), 'utf8');
    assert.equal(content, existing, 'conteúdo preexistente foi sobrescrito');
  } finally {
    await removeDir(base);
  }
});

// --- saída ---

test('CLAUDE.md criado existe no destino e tem newline final', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, TEMPLATE);
    const dest = join(base, 'dest');
    await mkdir(dest, { recursive: true });

    await materializeClamdMd(gov, dest, {});
    assert.equal(existsSync(join(dest, 'CLAUDE.md')), true);

    const content = await readFile(join(dest, 'CLAUDE.md'), 'utf8');
    assert.equal(content.at(-1), '\n', 'sem newline final');
  } finally {
    await removeDir(base);
  }
});
