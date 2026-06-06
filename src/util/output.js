/**
 * Renderização da saída do CLI (REGRA-11 / CRIT-20). Funções puras: recebem
 * dados e devolvem string. Quem imprime é o `cli.js`, o que mantém o render
 * testável sem capturar `console`.
 */

/**
 * @typedef {object} CommandResult
 * @property {boolean} ok            comando concluiu com sucesso?
 * @property {string[]} actions      o que foi feito
 * @property {string} [location]     onde (caminho afetado)
 * @property {string} [nextStep]     próximo passo recomendado
 * @property {string[]} warnings     avisos não-fatais
 */

/**
 * Formata um {@link CommandResult} como resumo acionável (CRIT-20).
 * @param {CommandResult} result
 * @returns {string}
 */
export function renderResult(result) {
  const lines = [];
  for (const action of result.actions) {
    lines.push(`${result.ok ? '✓' : '•'} ${action}`);
  }
  if (result.location) lines.push(`  em: ${result.location}`);
  for (const warning of result.warnings ?? []) {
    lines.push(`⚠ ${warning}`);
  }
  if (result.nextStep) lines.push(`→ ${result.nextStep}`);
  return lines.join('\n');
}

/**
 * Formata um erro como causa + ação (REGRA-11). Aceita {@link CortexError} ou
 * Error genérico (degrada para a mensagem, sem ação sugerida).
 * @param {import('./errors.js').CortexError | Error} err
 * @returns {string}
 */
export function renderError(err) {
  const cause = err?.cause ?? err?.message ?? String(err);
  const lines = [`✗ ${cause}`];
  if (err?.action) lines.push(`→ ${err.action}`);
  return lines.join('\n');
}
