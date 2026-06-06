import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/cli.js';

/** Roda `run` silenciando stdout/stderr e devolve { code, out, err }. */
async function runQuiet(argv) {
  const log = console.log;
  const error = console.error;
  const out = [];
  const err = [];
  console.log = (...a) => out.push(a.join(' '));
  console.error = (...a) => err.push(a.join(' '));
  try {
    const code = await run(argv);
    return { code, out: out.join('\n'), err: err.join('\n') };
  } finally {
    console.log = log;
    console.error = error;
  }
}

test('run --version imprime versão e sai 0', async () => {
  const { code, out } = await runQuiet(['--version']);
  assert.equal(code, 0);
  assert.match(out, /^innova-cortex v\d+\.\d+\.\d+/);
});

test('run --help mostra ajuda global e sai 0', async () => {
  const { code, out } = await runQuiet(['--help']);
  assert.equal(code, 0);
  assert.match(out, /Comandos:/);
  assert.match(out, /init/);
});

test('run sem comando mostra ajuda mas sai 2 (uso inválido)', async () => {
  const { code, out } = await runQuiet([]);
  assert.equal(code, 2);
  assert.match(out, /Uso: innova-cortex/);
});

test('run com comando desconhecido sai 1 com causa e ação', async () => {
  const { code, err } = await runQuiet(['bogus']);
  assert.equal(code, 1);
  assert.match(err, /Comando desconhecido/);
  assert.match(err, /--help/);
});

test('run init no cwd com .cortex/ existente sai 1 com CORTEX_EXISTS', async () => {
  // cwd do projeto já tem .cortex/ — init deve abortar com CORTEX_EXISTS (REGRA-07)
  const { code, err } = await runQuiet(['init']);
  assert.equal(code, 1);
  assert.match(err, /update/);
});

test('run init --help mostra ajuda do comando e sai 0', async () => {
  const { code, out } = await runQuiet(['init', '--help']);
  assert.equal(code, 0);
  assert.match(out, /Uso: innova-cortex init/);
  assert.match(out, /--name/);
});

test('run update --strategy sem valor sai 1 (BAD_USAGE)', async () => {
  const { code, err } = await runQuiet(['update', '--strategy']);
  assert.equal(code, 1);
  assert.match(err, /init --help|update --help|--help/);
});
