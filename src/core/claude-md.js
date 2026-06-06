import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Materializa o `CLAUDE.md` local a partir do template do harness (CRIT-02, REGRA-04).
 *
 * Substitui `{{PROJECT_NAME}}` e `{{PROJECT_OBJECTIVE}}` (e seus `<!-- TODO: ... -->`
 * adjacentes) quando os valores são fornecidos; sem eles, mantém o placeholder visível
 * com o `<!-- TODO -->` — nunca grava valor inventado.
 *
 * CRIT-11 / REGRA-09: se `CLAUDE.md` já existir em `destDir`, preserva e retorna
 * `{ skipped: true }` — o `init` só cria o que falta.
 *
 * @param {string} governanceRoot raiz da governança (ver resolveGovernanceRoot)
 * @param {string} destDir        raiz do projeto de destino
 * @param {{name?: string, objective?: string}} [opts]
 * @returns {Promise<{ skipped: boolean }>}
 */
export async function materializeClamdMd(governanceRoot, destDir, { name, objective } = {}) {
  const destPath = join(destDir, 'CLAUDE.md');

  const exists = await access(destPath).then(() => true, () => false);
  if (exists) return { skipped: true };

  const templatePath = join(governanceRoot, '04-templates', 'template-claude-md-local.md');
  const template = await readFile(templatePath, 'utf8');
  const content = applySubstitutions(template, { name, objective });
  await writeFile(destPath, content, 'utf8');
  return { skipped: false };
}

/**
 * Substitui placeholders no `template`.
 *
 * Quando o valor é fornecido: remove `{{PLACEHOLDER}}` e o `<!-- TODO: ... -->`
 * adjacente (espaço + comentário HTML), deixando só o valor.
 * Quando ausente: mantém o trecho original intacto — placeholder + TODO visível.
 *
 * @param {string} template
 * @param {{name?: string, objective?: string}} values
 * @returns {string}
 */
function applySubstitutions(template, { name, objective }) {
  let result = template;
  if (name != null) {
    result = result.replace(/\{\{PROJECT_NAME\}\}(?: <!-- TODO:[^>]*-->)?/g, name);
  }
  if (objective != null) {
    result = result.replace(/\{\{PROJECT_OBJECTIVE\}\}(?: <!-- TODO:[^>]*-->)?/g, objective);
  }
  return result;
}
