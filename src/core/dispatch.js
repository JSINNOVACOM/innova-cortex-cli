import { initCommand } from '../commands/init.js';
import { doctorCommand } from '../commands/doctor.js';
import { updateCommand } from '../commands/update.js';

/**
 * @typedef {object} CommandSpec
 * @property {string} name                       nome do comando
 * @property {string} summary                    descrição de 1 linha (alimenta o help)
 * @property {Record<string, object>} options    options no formato do node:util parseArgs
 * @property {{name: string, required: boolean}[]} positionals
 * @property {(ctx: {flags: Record<string, unknown>, positionals: string[]}) =>
 *   Promise<import('../util/output.js').CommandResult>} run
 */

/**
 * Registro dos comandos disponíveis — fonte única para dispatch e para a ajuda
 * gerada (M-3/CRIT-21). Ordem de inserção = ordem de exibição no help.
 * @type {Map<string, CommandSpec>}
 */
export const registry = new Map([
  [initCommand.name, initCommand],
  [doctorCommand.name, doctorCommand],
  [updateCommand.name, updateCommand],
]);

/**
 * Despacha uma invocação já parseada para o handler do comando.
 * @param {import('./parse.js').ParsedInvocation} invocation
 * @returns {Promise<import('../util/output.js').CommandResult>}
 */
export function dispatch(invocation) {
  const spec = registry.get(invocation.command);
  return spec.run({ flags: invocation.flags, positionals: invocation.positionals });
}
