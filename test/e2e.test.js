import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { makeTempDir, removeDir } from '../src/util/fs.js';
import { runInit } from '../src/core/init-flow.js';

function gitRun(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (c) => { stdout += c; });
    child.stderr.on('data', (c) => { stderr += c; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`git ${args[0]} exited ${code}: ${stderr.trim()}`));
    });
  });
}

async function createFixtureRepo(dir) {
  // Layout v0.2.2: governança sob cortex/ (resolveGovernanceRoot detecta cortex/Claude.md)
  const cortex = join(dir, 'cortex');
  await mkdir(join(cortex, '04-templates'), { recursive: true });
  await mkdir(join(cortex, '01-regras'), { recursive: true });
  await writeFile(join(cortex, 'Claude.md'), '# Claude\n', 'utf8');
  await writeFile(
    join(cortex, '04-templates', 'template-claude-md-local.md'),
    '# CLAUDE.md — {{PROJECT_NAME}} <!-- TODO: substituir -->\n\nObjetivo: {{PROJECT_OBJECTIVE}} <!-- TODO: descrever -->\n',
    'utf8',
  );
  await writeFile(join(cortex, '01-regras', 'readme.md'), '# Regras\n', 'utf8');

  await gitRun(['init'], dir);
  // Configura identidade local para o repo (sem depender de config global do CI)
  await gitRun(['config', 'user.email', 'ci@test.local'], dir);
  await gitRun(['config', 'user.name', 'CI Test'], dir);
  await gitRun(['add', '.'], dir);
  await gitRun(['commit', '-m', 'fixture: initial'], dir);
}

test(
  'e2e: init instala governança de fixture local sem rede (CRIT-01..12)',
  { timeout: 30_000 },
  async () => {
    const base = await makeTempDir();
    try {
      const fixtureDir = join(base, 'fixture');
      const destDir = join(base, 'project');
      await mkdir(fixtureDir, { recursive: true });
      await mkdir(destDir, { recursive: true });

      await createFixtureRepo(fixtureDir);

      const result = await runInit(
        { dest: destDir, from: fixtureDir },
        { cliVersion: '0.1.0' }, // git real, sem mock
      );

      // CRIT-01: núcleo copiado
      assert.equal(existsSync(join(destDir, '.cortex')), true, 'CRIT-01: .cortex/ deve existir');
      assert.equal(existsSync(join(destDir, '.cortex', 'Claude.md')), true, 'CRIT-01: Claude.md copiado');

      // CRIT-02: CLAUDE.md criado
      assert.equal(existsSync(join(destDir, 'CLAUDE.md')), true, 'CRIT-02: CLAUDE.md criado');

      // CRIT-03: estrutura mínima
      assert.equal(existsSync(join(destDir, 'docs', 'context')), true, 'CRIT-03: docs/context/');
      assert.equal(existsSync(join(destDir, 'docs', 'analysis')), true, 'CRIT-03: docs/analysis/');
      assert.equal(existsSync(join(destDir, 'memory')), true, 'CRIT-03: memory/');

      // CRIT-04: VERSION existe
      const versionPath = join(destDir, '.cortex', 'VERSION');
      assert.equal(existsSync(versionPath), true, 'CRIT-04: VERSION existe');

      // CRIT-05: VERSION com campos corretos
      const versionContent = await readFile(versionPath, 'utf8');
      assert.ok(versionContent.includes('source:'), 'CRIT-05: campo source');
      assert.ok(versionContent.includes('commit:'), 'CRIT-05: campo commit');
      assert.ok(versionContent.includes('cli_version:'), 'CRIT-05: campo cli_version');
      assert.ok(versionContent.includes('installed_at:'), 'CRIT-05: campo installed_at');

      // CRIT-06: staging removido após install
      assert.equal(existsSync(join(destDir, '.cortex_staging')), false, 'CRIT-06: staging removido');

      // CRIT-12: layout v0.2.2 detectado — 01-regras copiado de cortex/
      assert.equal(existsSync(join(destDir, '.cortex', '01-regras')), true, 'CRIT-12: layout v0.2.2 detectado');

      // result estruturado
      assert.equal(result.ok, true, 'result.ok deve ser true');
      assert.ok(result.actions.some((a) => a.includes('CLAUDE.md: criado')), 'action CLAUDE.md criado');
      assert.ok(result.actions.some((a) => a.includes('VERSION:')), 'action VERSION com commit');
    } finally {
      await removeDir(base);
    }
  },
);
