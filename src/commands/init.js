import { runInit } from '../core/init-flow.js';

/**
 * Comando `init` — instala o `.cortex/` num projeto (CASO-01).
 *
 * @type {import('../core/dispatch.js').CommandSpec}
 */
export const initCommand = {
  name: 'init',
  summary: 'Instala o .cortex/ num projeto (clona a origem e copia o núcleo).',
  options: {
    from: { type: 'string' }, // origem git (REGRA-03)
    ref: { type: 'string' }, // tag/commit (V-01b)
    name: { type: 'string' }, // CLAUDE.md (REGRA-04)
    objective: { type: 'string' }, // CLAUDE.md (REGRA-04)
    force: { type: 'boolean' }, // sobrescrita explícita (REGRA-07, futuro)
  },
  positionals: [{ name: 'path', required: false }],
  async run({ flags, positionals }) {
    return runInit({
      dest: positionals[0],
      from: flags.from,
      ref: flags.ref,
      name: flags.name,
      objective: flags.objective,
    });
  },
};
