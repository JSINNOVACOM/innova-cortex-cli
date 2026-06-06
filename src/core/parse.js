import { parseArgs } from 'node:util';
import { CortexError, ErrorCode } from '../util/errors.js';

/** Flags globais válidas em qualquer invocação. */
const GLOBAL_OPTIONS = {
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'v' },
};

/**
 * @typedef {object} ParsedInvocation
 * @property {string|null} command       comando identificado (ou null)
 * @property {Record<string, unknown>} flags  flags do comando (values do parseArgs)
 * @property {string[]} positionals       positionals após o comando
 * @property {boolean} wantsHelp
 * @property {boolean} wantsVersion
 * @property {CortexError|null} error      uso inválido / comando desconhecido
 */

/**
 * Faz parse de `argv` em duas passagens (decisão de modelagem M-1):
 *  1. passagem tolerante (`strict:false`) só para descobrir o subcomando
 *     (1º positional) e as flags globais (`--help`/`--version`);
 *  2. passagem estrita com as `options` do {@link CommandSpec} encontrado, para
 *     validar e tipar as flags específicas do comando.
 *
 * Assume o comando como primeiro argumento posicional (convenção de subcomando).
 *
 * @param {string[]} argv argumentos após `node bin/cli.js`
 * @param {Map<string, import('./dispatch.js').CommandSpec>} registry
 * @returns {ParsedInvocation}
 */
export function parse(argv, registry) {
  const first = parseArgs({
    args: argv,
    options: GLOBAL_OPTIONS,
    allowPositionals: true,
    strict: false,
    tokens: true,
  });

  const commandToken = first.tokens.find((token) => token.kind === 'positional');
  const command = commandToken ? commandToken.value : null;
  const wantsHelp = Boolean(first.values.help);
  const wantsVersion = Boolean(first.values.version);

  const base = { command, flags: {}, positionals: [], wantsHelp, wantsVersion, error: null };

  // Sem comando: só faz sentido help/version/uso inválido — resolvido pelo cli.js.
  if (command === null) return base;

  const spec = registry.get(command);
  if (!spec) {
    return {
      ...base,
      error: new CortexError(
        ErrorCode.UNKNOWN_COMMAND,
        `Comando desconhecido: "${command}".`,
        'Rode `innova-cortex --help` para ver os comandos disponíveis.',
      ),
    };
  }

  // Passagem 2: remove o token do comando e re-parseia com as options do comando.
  const rest = argv.filter((_, index) => index !== commandToken.index);
  let parsed;
  try {
    parsed = parseArgs({
      args: rest,
      options: { ...GLOBAL_OPTIONS, ...spec.options },
      allowPositionals: true,
      strict: true,
    });
  } catch (err) {
    return {
      ...base,
      error: new CortexError(
        ErrorCode.BAD_USAGE,
        err?.message ?? `Uso inválido de "${command}".`,
        `Rode \`innova-cortex ${command} --help\` para ver as opções.`,
      ),
    };
  }

  return {
    command,
    flags: parsed.values,
    positionals: parsed.positionals,
    wantsHelp: Boolean(parsed.values.help),
    wantsVersion: Boolean(parsed.values.version),
    error: null,
  };
}
