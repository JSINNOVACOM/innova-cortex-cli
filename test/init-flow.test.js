import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, writeFile, readFile, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { makeTempDir, removeDir } from '../src/util/fs.js';
import { runInit } from '../src/core/init-flow.js';
import { CortexError, ErrorCode } from '../src/util/errors.js';

// Cria estrutura mínima de governança no diretório de clone (layout pós-v0.2.2).
// Inclui 04-templates/ para que materializeClamdMd funcione após o rename.
async function createMockGovernance(cloneDir) {
  const cortex = join(cloneDir, 'cortex');
  await mkdir(join(cortex, '04-templates'), { recursive: true });
  await writeFile(join(cortex, 'Claude.md'), '# Claude\n', 'utf8');
  await writeFile(
    join(cortex, '04-templates', 'template-claude-md-local.md'),
    '# CLAUDE.md — {{PROJECT_NAME}} <!-- TODO: substituir pelo nome do projeto -->\n\nObjetivo: {{PROJECT_OBJECTIVE}} <!-- TODO: descrever o objetivo -->\n',
    'utf8',
  );
}

// Mock de git sem rede: cloneShallow popula o dir com governança mock.
function makeMockGit() {
  return {
    assertGitAvailable: async () => {},
    cloneShallow: async (_url, _ref, dir) => { await createMockGovernance(dir); },
    revParseHead: async () => 'abc1234',
  };
}

// --- guard REGRA-07 ---

test('aborta com CORTEX_EXISTS se .cortex/ já existe (E-01c, REGRA-07)', async () => {
  const base = await makeTempDir();
  try {
    const destDir = join(base, 'proj');
    await mkdir(join(destDir, '.cortex'), { recursive: true });

    await assert.rejects(
      () => runInit({ dest: destDir }, { git: makeMockGit(), cliVersion: '0.1.0' }),
      (err) => err instanceof CortexError && err.code === ErrorCode.CORTEX_EXISTS,
    );
  } finally {
    await removeDir(base);
  }
});

// --- propagação de erros de git ---

test('propaga GIT_MISSING se git está ausente, sem criar staging (E-01a)', async () => {
  const base = await makeTempDir();
  try {
    const destDir = join(base, 'proj');
    await mkdir(destDir, { recursive: true });

    const git = {
      assertGitAvailable: async () => {
        throw new CortexError(ErrorCode.GIT_MISSING, 'git não encontrado', 'Instale o git.');
      },
      cloneShallow: async () => {},
      revParseHead: async () => 'abc1234',
    };

    await assert.rejects(
      () => runInit({ dest: destDir }, { git, cliVersion: '0.1.0' }),
      (err) => err instanceof CortexError && err.code === ErrorCode.GIT_MISSING,
    );

    // staging nunca deve aparecer
    assert.equal(existsSync(join(destDir, '.cortex_staging')), false);
  } finally {
    await removeDir(base);
  }
});

// --- staging atômico / cleanup (REGRA-08) ---

test('nenhum staging nem .cortex/ restante após falha de clone (REGRA-08)', async () => {
  const base = await makeTempDir();
  try {
    const destDir = join(base, 'proj');
    await mkdir(destDir, { recursive: true });

    const git = {
      assertGitAvailable: async () => {},
      cloneShallow: async () => {
        throw new CortexError(ErrorCode.SOURCE_UNREACHABLE, 'inacessível', 'tente depois');
      },
      revParseHead: async () => 'abc1234',
    };

    await assert.rejects(
      () => runInit({ dest: destDir }, { git, cliVersion: '0.1.0' }),
      (err) => err.code === ErrorCode.SOURCE_UNREACHABLE,
    );

    assert.equal(existsSync(join(destDir, '.cortex')), false, '.cortex/ não deveria existir');
    assert.equal(existsSync(join(destDir, '.cortex_staging')), false, 'staging não deveria existir');
  } finally {
    await removeDir(base);
  }
});

// --- install bem-sucedido ---

test('.cortex/VERSION gravado com campos corretos após install (CRIT-04, REGRA-02)', async () => {
  const base = await makeTempDir();
  try {
    const destDir = join(base, 'proj');
    await mkdir(destDir, { recursive: true });

    await runInit(
      { dest: destDir, from: 'https://exemplo.com/repo.git', ref: 'v1.0.0' },
      { git: makeMockGit(), cliVersion: '0.1.0' },
    );

    const content = await readFile(join(destDir, '.cortex', 'VERSION'), 'utf8');
    assert.ok(content.includes('source: https://exemplo.com/repo.git'));
    assert.ok(content.includes('ref: v1.0.0'));
    assert.ok(content.includes('commit: abc1234'));
    assert.ok(content.includes('cli_version: 0.1.0'));
    assert.ok(content.includes('installed_at:'));
    assert.ok(!existsSync(join(destDir, '.cortex_staging')), 'staging deve ter sido removido');
  } finally {
    await removeDir(base);
  }
});

test('CLAUDE.md criado quando não preexiste (CRIT-02, REGRA-04)', async () => {
  const base = await makeTempDir();
  try {
    const destDir = join(base, 'proj');
    await mkdir(destDir, { recursive: true });

    const result = await runInit(
      { dest: destDir },
      { git: makeMockGit(), cliVersion: '0.1.0' },
    );

    assert.equal(existsSync(join(destDir, 'CLAUDE.md')), true);
    assert.equal(result.ok, true);
    assert.ok(result.actions.some((a) => a.includes('CLAUDE.md: criado')));
  } finally {
    await removeDir(base);
  }
});

test('CLAUDE.md preexistente é preservado (CRIT-11, REGRA-09)', async () => {
  const base = await makeTempDir();
  try {
    const destDir = join(base, 'proj');
    await mkdir(destDir, { recursive: true });
    await writeFile(join(destDir, 'CLAUDE.md'), 'conteúdo do adotador\n', 'utf8');

    await runInit(
      { dest: destDir },
      { git: makeMockGit(), cliVersion: '0.1.0' },
    );

    const content = await readFile(join(destDir, 'CLAUDE.md'), 'utf8');
    assert.equal(content, 'conteúdo do adotador\n', 'CLAUDE.md foi sobrescrito indevidamente');
  } finally {
    await removeDir(base);
  }
});

test('cria destDir e estrutura mínima quando destDir não existe (CRIT-03, REGRA-05)', async () => {
  const base = await makeTempDir();
  try {
    const destDir = join(base, 'novo-projeto'); // não existe

    await runInit(
      { dest: destDir },
      { git: makeMockGit(), cliVersion: '0.1.0' },
    );

    assert.equal(existsSync(join(destDir, '.cortex')), true);
    assert.equal(existsSync(join(destDir, 'docs', 'context')), true);
    assert.equal(existsSync(join(destDir, 'docs', 'analysis')), true);
    assert.equal(existsSync(join(destDir, 'memory')), true);
  } finally {
    await removeDir(base);
  }
});

// --- E-01d: permissão de escrita ---

test('E-01d: CortexError WRITE_PERMISSION quando dir pai é read-only (CRIT-08, REGRA-08)',
  { skip: process.platform === 'win32' || process.getuid?.() === 0 },
  async () => {
    const base = await makeTempDir();
    try {
      await chmod(base, 0o444); // read-only — não permite criar subdiretórios
      const destDir = join(base, 'novo-proj'); // não existe; mkdir falhará com EACCES

      await assert.rejects(
        () => runInit({ dest: destDir }, { git: makeMockGit(), cliVersion: '0.1.0' }),
        (err) => err instanceof CortexError && err.code === ErrorCode.WRITE_PERMISSION,
      );
    } finally {
      await chmod(base, 0o755); // restaura para o cleanup
      await removeDir(base);
    }
  },
);

// --- E-01e: destino não vazio sem .cortex/ ---

test('E-01e: output sinaliza o que foi preservado quando destino não está vazio (CRIT-11)', async () => {
  const base = await makeTempDir();
  try {
    const destDir = join(base, 'proj');
    await mkdir(join(destDir, 'memory'), { recursive: true });
    await writeFile(join(destDir, 'CLAUDE.md'), 'custom\n', 'utf8');
    await writeFile(join(destDir, 'memory', 'notes.md'), 'notas\n', 'utf8');

    const result = await runInit(
      { dest: destDir },
      { git: makeMockGit(), cliVersion: '0.1.0' },
    );

    assert.equal(result.ok, true);
    // CLAUDE.md preservado deve aparecer nas actions
    assert.ok(result.actions.some((a) => a.includes('preservado')), 'esperado "preservado" nas actions');
    // Arquivo preexistente em memory/ não deve ter sido destruído
    const notes = await readFile(join(destDir, 'memory', 'notes.md'), 'utf8');
    assert.equal(notes, 'notas\n');
  } finally {
    await removeDir(base);
  }
});
