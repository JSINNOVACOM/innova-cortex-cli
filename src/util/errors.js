/**
 * Erro de domínio do CLI. Carrega causa legível e ação sugerida para render
 * uniforme (REGRA-11): o usuário vê causa + ação, nunca um stack trace cru.
 */
export class CortexError extends Error {
  /**
   * @param {string} code   código estável (ver {@link ErrorCode})
   * @param {string} cause  causa legível do erro
   * @param {string} action ação sugerida ao usuário
   */
  constructor(code, cause, action) {
    super(cause);
    this.name = 'CortexError';
    this.code = code;
    this.cause = cause;
    this.action = action;
  }
}

/**
 * Códigos de erro conhecidos. Os de `init` mapeiam os fluxos de erro E-01a..e
 * da spec (`casos-de-uso.md`) e são consumidos quando a TASK-04+ for implementada.
 */
export const ErrorCode = {
  UNKNOWN_COMMAND: 'UNKNOWN_COMMAND',
  BAD_USAGE: 'BAD_USAGE',
  GIT_MISSING: 'GIT_MISSING', // E-01a
  SOURCE_UNREACHABLE: 'SOURCE_UNREACHABLE', // E-01b
  CORTEX_EXISTS: 'CORTEX_EXISTS', // E-01c
  WRITE_PERMISSION: 'WRITE_PERMISSION', // E-01d
};
