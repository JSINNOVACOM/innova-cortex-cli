import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { makeTempDir, removeDir, copyTree } from '../src/util/fs.js';
import {
  INCLUDE_DIRS,
  INCLUDE_FILES_AT_ROOT,
  EXCLUDE_PATTERNS,
  resolveGovernanceRoot,
  copyGovernanceCore,
} from '../src/core/source-layout.js';

/**
 * Monta um clone falso da governança sob `root`, opcionalmente dentro de um
 * subdiretório `cortex/` (layout pós-v0.2.2). Cria os INCLUDE_DIRS com um
 * arquivo dentro, o Claude.md da raiz e o material institucional a ser barrado.
 */
async function buildFakeGovernance(root, { underCortex }) {
  const gov = underCortex ? join(root, 'cortex') : root;
  for (const dir of INCLUDE_DIRS) {
    await mkdir(join(gov, dir), { recursive: true });
    await writeFile(join(gov, dir, 'arquivo.md'), `conteúdo de ${dir}\n`);
  }
  await mkdir(gov, { recursive: true });
  await writeFile(join(gov, 'Claude.md'), '# Claude\n');
  // material institucional — deve ficar de fora (CRIT-01)
  await mkdir(join(gov, 'examples'), { recursive: true });
  await writeFile(join(gov, 'examples', 'demo.md'), 'x\n');
  await writeFile(join(gov, 'LICENSE'), 'MIT\n');
  await writeFile(join(gov, 'README.md'), '# repo\n');
  await writeFile(join(gov, '.gitignore'), 'node_modules\n');
  return gov;
}

// --- copyTree (util/fs) ---

test('copyTree copia recursivamente e respeita o predicado keep', async () => {
  const base = await makeTempDir();
  try {
    const src = join(base, 'src');
    await mkdir(join(src, 'sub'), { recursive: true });
    await writeFile(join(src, 'a.txt'), 'A\n');
    await writeFile(join(src, 'sub', 'b.txt'), 'B\n');
    await writeFile(join(src, 'pular.txt'), 'NAO\n');

    const dest = join(base, 'dest');
    await copyTree(src, dest, (name) => name !== 'pular.txt');

    assert.equal(existsSync(join(dest, 'a.txt')), true);
    assert.equal(existsSync(join(dest, 'sub', 'b.txt')), true);
    assert.equal(existsSync(join(dest, 'pular.txt')), false);
  } finally {
    await removeDir(base);
  }
});

test('copyTree preserva o conteúdo byte-a-byte (EOL incluso — REGRA-10)', async () => {
  const base = await makeTempDir();
  try {
    const src = join(base, 'src');
    await mkdir(src, { recursive: true });
    const crlf = 'linha1\r\nlinha2\n'; // mistura CRLF/LF
    await writeFile(join(src, 'eol.md'), crlf);

    const dest = join(base, 'dest');
    await copyTree(src, dest);

    const out = await readFile(join(dest, 'eol.md'), 'utf8');
    assert.equal(out, crlf);
  } finally {
    await removeDir(base);
  }
});

// --- resolveGovernanceRoot (CRIT-12) ---

test('resolveGovernanceRoot detecta o subdiretório cortex/ (pós-v0.2.2)', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, { underCortex: true });
    assert.equal(resolveGovernanceRoot(base), gov);
  } finally {
    await removeDir(base);
  }
});

test('resolveGovernanceRoot cai na raiz do repo no layout legado', async () => {
  const base = await makeTempDir();
  try {
    await buildFakeGovernance(base, { underCortex: false });
    assert.equal(resolveGovernanceRoot(base), base);
  } finally {
    await removeDir(base);
  }
});

// --- copyGovernanceCore (CRIT-01, REGRA-01) ---

test('copyGovernanceCore copia só o núcleo, barrando material institucional', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, { underCortex: true });
    const dest = join(base, 'out');
    const copied = await copyGovernanceCore(gov, dest);

    // presentes: todos os INCLUDE_DIRS + Claude.md
    for (const dir of INCLUDE_DIRS) {
      assert.equal(existsSync(join(dest, dir, 'arquivo.md')), true, `${dir} ausente`);
    }
    assert.equal(existsSync(join(dest, 'Claude.md')), true);
    assert.deepEqual(copied.sort(), [...INCLUDE_DIRS, ...INCLUDE_FILES_AT_ROOT].sort());

    // ausentes: examples/, LICENSE, README.md, .gitignore (CRIT-01)
    assert.equal(existsSync(join(dest, 'examples')), false);
    assert.equal(existsSync(join(dest, 'LICENSE')), false);
    assert.equal(existsSync(join(dest, 'README.md')), false);
    assert.equal(existsSync(join(dest, '.gitignore')), false);
  } finally {
    await removeDir(base);
  }
});

test('copyGovernanceCore filtra material institucional aninhado num INCLUDE_DIR', async () => {
  const base = await makeTempDir();
  try {
    const gov = await buildFakeGovernance(base, { underCortex: false });
    // injeta lixo dentro de um dir do núcleo — não pode vazar (EXCLUDE defensivo)
    await writeFile(join(gov, '01-regras', 'README.md'), 'nested\n');
    await mkdir(join(gov, '02-agentes', '.git'), { recursive: true });
    await writeFile(join(gov, '02-agentes', '.git', 'config'), 'x\n');

    const dest = join(base, 'out');
    await copyGovernanceCore(gov, dest);

    assert.equal(existsSync(join(dest, '01-regras', 'arquivo.md')), true);
    assert.equal(existsSync(join(dest, '01-regras', 'README.md')), false);
    assert.equal(existsSync(join(dest, '02-agentes', '.git')), false);
  } finally {
    await removeDir(base);
  }
});

test('copyGovernanceCore pula entradas ausentes na origem sem falhar', async () => {
  const base = await makeTempDir();
  try {
    const gov = join(base, 'gov');
    await mkdir(join(gov, '01-regras'), { recursive: true });
    await writeFile(join(gov, '01-regras', 'arquivo.md'), 'x\n');
    // sem os demais INCLUDE_DIRS nem Claude.md

    const dest = join(base, 'out');
    const copied = await copyGovernanceCore(gov, dest);

    assert.deepEqual(copied, ['01-regras']);
    assert.equal(existsSync(join(dest, '01-regras', 'arquivo.md')), true);
    assert.equal(existsSync(join(dest, 'Claude.md')), false);
  } finally {
    await removeDir(base);
  }
});

test('EXCLUDE_PATTERNS distingue diretório (sufixo /) de arquivo', () => {
  assert.equal(EXCLUDE_PATTERNS.includes('examples/'), true);
  assert.equal(EXCLUDE_PATTERNS.includes('.git/'), true);
  assert.equal(EXCLUDE_PATTERNS.includes('README.md'), true);
});
