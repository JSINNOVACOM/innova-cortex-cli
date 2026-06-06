import { readFile } from 'node:fs/promises';
import { parse } from './core/parse.js';
import { dispatch, registry } from './core/dispatch.js';
import { renderHelp, renderCommandHelp } from './core/help.js';
import { renderResult, renderError } from './util/output.js';
import { CortexError } from './util/errors.js';

/**
 * Lê a versão declarada no package.json sem depender de import-attributes
 * (mantém compatibilidade estável em todo o range Node >= 20).
 * @returns {Promise<string>}
 */
export async function getVersion() {
  const pkgUrl = new URL('../package.json', import.meta.url);
  const pkg = JSON.parse(await readFile(pkgUrl, 'utf8'));
  return pkg.version;
}

/**
 * Entrypoint do CLI: parse → (help/version) → dispatch → render.
 * Retorna o código de saída do processo (0 ok, 1 erro, 2 uso inválido).
 * @param {string[]} argv argumentos após `node bin/cli.js`
 * @returns {Promise<number>}
 */
export async function run(argv = []) {
  const invocation = parse(argv, registry);

  if (invocation.wantsVersion) {
    console.log(`innova-cortex v${await getVersion()}`);
    return 0;
  }

  if (invocation.command === null) {
    console.log(renderHelp(registry));
    return invocation.wantsHelp ? 0 : 2;
  }

  if (invocation.error) {
    console.error(renderError(invocation.error));
    return 1;
  }

  if (invocation.wantsHelp) {
    console.log(renderCommandHelp(registry.get(invocation.command)));
    return 0;
  }

  try {
    const result = await dispatch(invocation);
    console.log(renderResult(result));
    return result.ok ? 0 : 1;
  } catch (err) {
    console.error(err instanceof CortexError ? renderError(err) : (err?.message ?? String(err)));
    return 1;
  }
}
