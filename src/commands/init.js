/**
 * Comando `init` — instala o `.cortex/` num projeto (CASO-01).
 * Nesta fase (TASK-02) só o {@link CommandSpec} e um `run` stub: a lógica real
 * (clone, detecção de layout, cópia do núcleo, VERSION) chega na TASK-04+.
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
    force: { type: 'boolean' }, // sobrescrita explícita (REGRA-07)
  },
  positionals: [{ name: 'path', required: false }],
  async run() {
    return {
      ok: true,
      actions: ['`init` ainda não implementado — esqueleto de parse/dispatch (TASK-02).'],
      nextStep: 'A lógica real do init (clone + cópia do núcleo + VERSION) chega na TASK-04+.',
      warnings: [],
    };
  },
};
