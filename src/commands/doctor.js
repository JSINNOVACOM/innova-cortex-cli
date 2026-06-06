/**
 * Comando `doctor` — diagnostica a instalação do `.cortex/` (CASO-02, v0.3).
 * Stub nesta fase (TASK-02); lógica real na TASK-13.
 *
 * @type {import('../core/dispatch.js').CommandSpec}
 */
export const doctorCommand = {
  name: 'doctor',
  summary: 'Diagnostica a instalação (versão + arquivos modificados localmente).',
  options: {},
  positionals: [],
  async run() {
    return {
      ok: true,
      actions: ['`doctor` ainda não implementado — esqueleto de parse/dispatch (TASK-02).'],
      nextStep: 'A lógica real do doctor chega na TASK-13 (v0.3).',
      warnings: [],
    };
  },
};
