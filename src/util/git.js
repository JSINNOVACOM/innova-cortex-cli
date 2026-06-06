import { spawn } from 'node:child_process';
import { CortexError, ErrorCode } from './errors.js';

/**
 * Wrapper de `git` como subprocesso portável (REGRA-10): nunca via shell, sem
 * depender de `cp`/`rm`/`bash`. Concentra aqui todo o acesso ao git para que o
 * resto do CLI fale só em termos de operações de alto nível.
 */

/**
 * Executa `git <args>` capturando saída. Não usa shell (sem interpolação).
 * @param {string[]} args
 * @param {{cwd?: string}} [options]
 * @returns {Promise<{code: number|null, stdout: string, stderr: string, spawnError: Error|null}>}
 */
function runGit(args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn('git', args, { stdio: ['ignore', 'pipe', 'pipe'], ...options });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // 'error' dispara quando o binário não existe (ENOENT) — git ausente (E-01a).
    child.on('error', (spawnError) => resolve({ code: null, stdout, stderr, spawnError }));
    child.on('close', (code) => resolve({ code, stdout, stderr, spawnError: null }));
  });
}

/**
 * Garante que o `git` está disponível no PATH. Ausência → {@link CortexError}
 * com código `GIT_MISSING` (fluxo de erro E-01a).
 * @returns {Promise<void>}
 */
export async function assertGitAvailable() {
  const { code, spawnError } = await runGit(['--version']);
  if (spawnError || code !== 0) {
    throw new CortexError(
      ErrorCode.GIT_MISSING,
      'git não foi encontrado no PATH.',
      'Instale o git (https://git-scm.com/downloads) e tente novamente.',
    );
  }
}

/**
 * Clona a origem para `destDir` de forma rasa (`--depth 1`). Quando `ref` é
 * fornecida, fixa em tag/branch via `--branch`. Falha (URL inválida, sem rede,
 * ref inexistente) → {@link CortexError} `SOURCE_UNREACHABLE` (fluxo E-01b).
 *
 * Nota: `--branch` cobre tags e branches. Fixar num commit-SHA arbitrário exige
 * fetch+checkout (não suportado por `--depth` direto) — refinamento posterior.
 *
 * @param {string} url    origem git
 * @param {string|null|undefined} ref  tag/branch (ausente = branch default)
 * @param {string} destDir diretório de destino do clone (já deve existir)
 * @returns {Promise<void>}
 */
export async function cloneShallow(url, ref, destDir) {
  const args = ['clone', '--depth', '1'];
  if (ref) args.push('--branch', ref);
  args.push('--', url, destDir);

  const { code, stderr, spawnError } = await runGit(args);
  if (spawnError || code !== 0) {
    const detail = spawnError
      ? spawnError.message
      : (stderr.trim().split('\n').pop() || `git saiu com código ${code}`);
    throw new CortexError(
      ErrorCode.SOURCE_UNREACHABLE,
      `Não foi possível clonar a origem (${url}${ref ? ` @ ${ref}` : ''}).`,
      `Verifique a URL, a conexão e se a ref existe. Detalhe do git: ${detail}`,
    );
  }
}
