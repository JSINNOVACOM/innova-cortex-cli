import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../src/core/parse.js';
import { registry } from '../src/core/dispatch.js';
import { ErrorCode } from '../src/util/errors.js';

test('parse identifica comando, flags string e positional', () => {
  const inv = parse(['init', './destino', '--name', 'Foo', '--objective', 'Bar'], registry);
  assert.equal(inv.command, 'init');
  assert.equal(inv.error, null);
  assert.equal(inv.flags.name, 'Foo');
  assert.equal(inv.flags.objective, 'Bar');
  assert.deepEqual(inv.positionals, ['./destino']);
});

test('parse reconhece --version sem comando', () => {
  const inv = parse(['--version'], registry);
  assert.equal(inv.command, null);
  assert.equal(inv.wantsVersion, true);
});

test('parse reconhece --help sem comando', () => {
  const inv = parse(['--help'], registry);
  assert.equal(inv.command, null);
  assert.equal(inv.wantsHelp, true);
});

test('parse aceita -h e -v curtos', () => {
  assert.equal(parse(['-h'], registry).wantsHelp, true);
  assert.equal(parse(['-v'], registry).wantsVersion, true);
});

test('parse de comando desconhecido vira CortexError UNKNOWN_COMMAND', () => {
  const inv = parse(['bogus'], registry);
  assert.equal(inv.command, 'bogus');
  assert.ok(inv.error);
  assert.equal(inv.error.code, ErrorCode.UNKNOWN_COMMAND);
});

test('parse de flag inválida no comando vira CortexError BAD_USAGE', () => {
  const inv = parse(['init', '--inexistente'], registry);
  assert.ok(inv.error);
  assert.equal(inv.error.code, ErrorCode.BAD_USAGE);
});

test('parse aceita flag boolean --dry-run no update', () => {
  const inv = parse(['update', '--dry-run'], registry);
  assert.equal(inv.command, 'update');
  assert.equal(inv.error, null);
  assert.equal(inv.flags['dry-run'], true);
});

test('parse captura --help específico de comando', () => {
  const inv = parse(['init', '--help'], registry);
  assert.equal(inv.command, 'init');
  assert.equal(inv.wantsHelp, true);
});

test('parse sem argumentos não tem comando nem erro', () => {
  const inv = parse([], registry);
  assert.equal(inv.command, null);
  assert.equal(inv.error, null);
  assert.equal(inv.wantsHelp, false);
});
