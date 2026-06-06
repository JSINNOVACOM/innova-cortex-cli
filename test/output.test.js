import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderResult, renderError } from '../src/util/output.js';
import { CortexError } from '../src/util/errors.js';

test('renderResult de sucesso lista ações, local e próximo passo', () => {
  const out = renderResult({
    ok: true,
    actions: ['copiou o núcleo'],
    location: '/proj/.cortex',
    nextStep: 'abrir o projeto',
    warnings: [],
  });
  assert.match(out, /✓ copiou o núcleo/);
  assert.match(out, /em: \/proj\/\.cortex/);
  assert.match(out, /→ abrir o projeto/);
});

test('renderResult inclui avisos', () => {
  const out = renderResult({ ok: true, actions: ['ok'], warnings: ['arquivo X preservado'] });
  assert.match(out, /⚠ arquivo X preservado/);
});

test('renderError de CortexError mostra causa e ação', () => {
  const out = renderError(new CortexError('GIT_MISSING', 'git não encontrado', 'instale o git'));
  assert.match(out, /✗ git não encontrado/);
  assert.match(out, /→ instale o git/);
});

test('renderError de Error genérico degrada para a mensagem, sem ação', () => {
  const out = renderError(new Error('falha qualquer'));
  assert.match(out, /✗ falha qualquer/);
  assert.doesNotMatch(out, /→/);
});
