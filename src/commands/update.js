/**
 * Comando `update` — atualiza o `.cortex/` preservando customização (CASO-03, v0.3).
 * Stub nesta fase (TASK-02); lógica real na TASK-14/15.
 *
 * @type {import('../core/dispatch.js').CommandSpec}
 */
export const updateCommand = {
  name: 'update',
  summary: 'Atualiza o .cortex/ preservando customização local.',
  options: {
    'dry-run': { type: 'boolean' }, // V-03a — não escreve nada
    strategy: { type: 'string' }, // conservador (default) | agressivo (REGRA-06)
  },
  positionals: [],
  async run() {
    return {
      ok: true,
      actions: ['`update` ainda não implementado — esqueleto de parse/dispatch (TASK-02).'],
      nextStep: 'A lógica real do update chega na TASK-14/15 (v0.3).',
      warnings: [],
    };
  },
};
