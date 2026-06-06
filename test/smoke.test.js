import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getVersion, run } from '../src/cli.js';

test('getVersion retorna a versão semver do package.json', async () => {
  const version = await getVersion();
  assert.match(version, /^\d+\.\d+\.\d+/);
});

test('run executa sem lançar com argv vazio', async () => {
  await assert.doesNotReject(() => run([]));
});
