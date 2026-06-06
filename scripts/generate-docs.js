#!/usr/bin/env node
/**
 * Gera a seção de install-manifest do README.md a partir das listas canônicas
 * em source-layout.js (CRIT-21, REGRA-01): docs nunca divergem do comportamento real.
 *
 * Uso: node scripts/generate-docs.js
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INCLUDE_DIRS,
  INCLUDE_FILES_AT_ROOT,
  EXCLUDE_PATTERNS,
} from '../src/core/source-layout.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const README = join(ROOT, 'README.md');

const START = '<!-- GENERATED-START: install-manifest -->';
const END   = '<!-- GENERATED-END: install-manifest -->';

function buildSection() {
  const dirs  = INCLUDE_DIRS.map((d) => `  - \`${d}/\``).join('\n');
  const files = INCLUDE_FILES_AT_ROOT.map((f) => `  - \`${f}\``).join('\n');
  const excl  = EXCLUDE_PATTERNS.map((p) => `  - \`${p}\``).join('\n');

  return `\
**Diretórios copiados:**
${dirs}

**Arquivos avulsos da raiz:**
${files}

**Nunca copiados:**
${excl}`;
}

const readme = await readFile(README, 'utf8');
const si = readme.indexOf(START);
const ei = readme.indexOf(END);

if (si === -1 || ei === -1) {
  console.error('Marcadores GENERATED não encontrados no README.md');
  process.exit(1);
}

const updated =
  readme.slice(0, si + START.length) +
  '\n' +
  buildSection() +
  '\n' +
  readme.slice(ei);

await writeFile(README, updated, 'utf8');
console.log('README.md atualizado com install-manifest gerado de source-layout.js');
