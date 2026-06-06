/**
 * Geração da ajuda do CLI a partir do registry de comandos (M-3 / CRIT-21):
 * a ajuda nunca diverge do comportamento real porque é derivada da mesma
 * fonte que o dispatch usa.
 */

/**
 * Ajuda global: uso, lista de comandos (de `summary`) e flags globais.
 * @param {Map<string, import('./dispatch.js').CommandSpec>} registry
 * @returns {string}
 */
export function renderHelp(registry) {
  const width = Math.max(...[...registry.keys()].map((name) => name.length), 0);
  const lines = [
    'innova-cortex — instala e versiona o .cortex/ em projetos adopters.',
    '',
    'Uso: innova-cortex <comando> [opções] [path]',
    '',
    'Comandos:',
  ];
  for (const spec of registry.values()) {
    lines.push(`  ${spec.name.padEnd(width)}  ${spec.summary}`);
  }
  lines.push('', 'Flags globais:', '  -h, --help     Mostra esta ajuda', '  -v, --version  Mostra a versão');
  return lines.join('\n');
}

/**
 * Ajuda específica de um comando: uso, positionals e suas options.
 * @param {import('./dispatch.js').CommandSpec} spec
 * @returns {string}
 */
export function renderCommandHelp(spec) {
  const positionals = spec.positionals
    .map((p) => (p.required ? `<${p.name}>` : `[${p.name}]`))
    .join(' ');
  const lines = [
    spec.summary,
    '',
    `Uso: innova-cortex ${spec.name} [opções]${positionals ? ' ' + positionals : ''}`,
  ];

  const optionNames = Object.keys(spec.options);
  if (optionNames.length > 0) {
    const width = Math.max(...optionNames.map((name) => name.length));
    lines.push('', 'Opções:');
    for (const [name, def] of Object.entries(spec.options)) {
      const value = def.type === 'string' ? ' <valor>' : '';
      lines.push(`  --${name.padEnd(width)}${value}`);
    }
  }
  return lines.join('\n');
}
