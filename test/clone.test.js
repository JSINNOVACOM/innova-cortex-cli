import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { withTempClone } from '../src/core/clone.js';
import { makeTempDir, removeDir } from '../src/util/fs.js';
import { assertGitAvailable, cloneShallow } from '../src/util/git.js';
import { CortexError, ErrorCode } from '../src/util/errors.js';

// --- util/fs: ciclo de vida do diretório temporário ---

test('makeTempDir cria e removeDir apaga o diretório', async () => {
  const dir = await makeTempDir('innova-cortex-test-');
  assert.equal(existsSync(dir), true);
  await removeDir(dir);
  assert.equal(existsSync(dir), false);
});

test('removeDir é idempotente (não falha se já não existe)', async () => {
  await assert.doesNotReject(() => removeDir('/caminho/que/nao/existe/abc123'));
});

// --- util/git: disponibilidade e mapeamento de erro (offline) ---

test('assertGitAvailable resolve quando o git está presente', async () => {
  await assert.doesNotReject(() => assertGitAvailable());
});

test('cloneShallow de origem inexistente vira CortexError SOURCE_UNREACHABLE', async () => {
  const base = await makeTempDir();
  try {
    await assert.rejects(
      () => cloneShallow('/origem/que/nao/existe/repo.git', null, join(base, 'clone')),
      (err) => err instanceof CortexError && err.code === ErrorCode.SOURCE_UNREACHABLE,
    );
  } finally {
    await removeDir(base);
  }
});

// --- core/clone: garantia de cleanup (git injetado, sem rede) ---

test('withTempClone remove o temp após sucesso', async () => {
  let captured;
  const git = {
    assertGitAvailable: async () => {},
    cloneShallow: async (_url, _ref, dir) => {
      captured = dir;
      await writeFile(join(dir, 'marker'), 'x');
    },
  };
  const result = await withTempClone({ from: 'fake' }, async (dir) => {
    assert.equal(existsSync(dir), true);
    return 'resultado';
  }, { git });

  assert.equal(result, 'resultado');
  assert.equal(existsSync(captured), false);
});

test('withTempClone remove o temp mesmo se o clone falhar', async () => {
  let captured;
  const git = {
    assertGitAvailable: async () => {},
    cloneShallow: async (_url, _ref, dir) => {
      captured = dir;
      throw new CortexError(ErrorCode.SOURCE_UNREACHABLE, 'falhou', 'tente de novo');
    },
  };
  await assert.rejects(
    () => withTempClone({ from: 'fake' }, async () => {}, { git }),
    (err) => err.code === ErrorCode.SOURCE_UNREACHABLE,
  );
  assert.equal(existsSync(captured), false);
});

test('withTempClone remove o temp mesmo se o callback lançar', async () => {
  let captured;
  const git = {
    assertGitAvailable: async () => {},
    cloneShallow: async (_url, _ref, dir) => { captured = dir; },
  };
  await assert.rejects(
    () => withTempClone({ from: 'fake' }, async () => { throw new Error('boom'); }, { git }),
    /boom/,
  );
  assert.equal(existsSync(captured), false);
});

test('withTempClone curto-circuita em git ausente, sem criar/clonar', async () => {
  let cloneCalled = false;
  const git = {
    assertGitAvailable: async () => {
      throw new CortexError(ErrorCode.GIT_MISSING, 'sem git', 'instale o git');
    },
    cloneShallow: async () => { cloneCalled = true; },
  };
  await assert.rejects(
    () => withTempClone({ from: 'fake' }, async () => {}, { git }),
    (err) => err.code === ErrorCode.GIT_MISSING,
  );
  assert.equal(cloneCalled, false);
});
