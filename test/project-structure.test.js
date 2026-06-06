import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { makeTempDir, removeDir } from '../src/util/fs.js';
import { MINIMAL_DIRS, createMinimalStructure } from '../src/core/project-structure.js';

test('cria os três diretórios mínimos quando nenhum existe (CRIT-03, REGRA-05)', async () => {
  const base = await makeTempDir();
  try {
    const dest = join(base, 'proj');
    await mkdir(dest, { recursive: true });

    const result = await createMinimalStructure(dest);

    assert.deepEqual(result.created.sort(), [...MINIMAL_DIRS].sort());
    assert.deepEqual(result.existing, []);
    for (const rel of MINIMAL_DIRS) {
      assert.equal(existsSync(join(dest, rel)), true, `${rel} não foi criado`);
    }
  } finally {
    await removeDir(base);
  }
});

test('é idempotente — segunda chamada não falha e reporta como existentes (CRIT-11, REGRA-09)', async () => {
  const base = await makeTempDir();
  try {
    const dest = join(base, 'proj');
    await mkdir(dest, { recursive: true });

    await createMinimalStructure(dest);
    const result = await createMinimalStructure(dest);

    assert.deepEqual(result.created, []);
    assert.deepEqual(result.existing.sort(), [...MINIMAL_DIRS].sort());
  } finally {
    await removeDir(base);
  }
});

test('preserva conteúdo preexistente nos diretórios — não apaga arquivos (CRIT-11, REGRA-09)', async () => {
  const base = await makeTempDir();
  try {
    const dest = join(base, 'proj');
    await mkdir(join(dest, 'memory'), { recursive: true });
    await writeFile(join(dest, 'memory', 'project-context.md'), 'conteúdo do adotador\n', 'utf8');

    await createMinimalStructure(dest);

    const content = await (await import('node:fs/promises')).readFile(
      join(dest, 'memory', 'project-context.md'), 'utf8',
    );
    assert.equal(content, 'conteúdo do adotador\n', 'arquivo preexistente foi destruído');
  } finally {
    await removeDir(base);
  }
});

test('cria subpastas aninhadas (docs/context, docs/analysis) sem exigir docs/ prévio', async () => {
  const base = await makeTempDir();
  try {
    const dest = join(base, 'proj');
    await mkdir(dest, { recursive: true });

    await createMinimalStructure(dest);

    assert.equal(existsSync(join(dest, 'docs', 'context')), true);
    assert.equal(existsSync(join(dest, 'docs', 'analysis')), true);
  } finally {
    await removeDir(base);
  }
});

test('MINIMAL_DIRS contém exatamente os três diretórios da spec (REGRA-05)', () => {
  assert.deepEqual([...MINIMAL_DIRS].sort(), ['docs/analysis', 'docs/context', 'memory']);
});
