# Feature — Parse de argumentos + dispatch de comandos (TASK-02 / TASK-03)

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** modelagem de feature
- **Tasks:** TASK-02 (parse + dispatch) + TASK-03 (utilitários base)
- **Critérios:** CRIT-20, CRIT-21 · **Regras:** REGRA-10, REGRA-11
- **Estado:** modelado e em implementação
- **Última atualização:** 2026-06-05
- **Responsável:** Jonathan

---

## 1. Demanda (Etapa 1 do Create Feature)

Construir o esqueleto de execução do CLI: receber `argv`, descobrir o comando
(`init`/`doctor`/`update`), validar flags, despachar para o handler e renderizar
uma saída acionável — incluindo `--help`/`--version`. Sem ainda implementar a
lógica real dos comandos (clone, cópia, VERSION → TASK-04+).

**Comportamento esperado**
- `innova-cortex --version` → imprime a versão e sai (código 0).
- `innova-cortex --help` (ou sem comando) → imprime ajuda gerada dos comandos.
- `innova-cortex <comando> --help` → ajuda específica do comando.
- `innova-cortex <comando> [flags]` → parse das flags do comando e dispatch.
- Comando desconhecido / uso inválido → erro com causa + ação (não stack trace).

**Critério mínimo de aceitação:** CRIT-20 (toda saída acionável; erro = causa +
ação) e CRIT-21 (ajuda gerada da fonte única dos comandos, sem divergir do real).

---

## 2. Contexto e padrões (Etapas 2 e 3)

- Estado: TASK-01 (bootstrap) entregue; `src/cli.js` só imprime versão.
- Stack: Node ≥ 20, ESM, **zero deps** (DEC-09) — `node:util.parseArgs` para parse.
- **Ausência registrada:** não há stack pattern Node/JS em `10-padroes-tecnicos/`.
  Aplicados os transversais de `principios-base.md`: clareza (#1), separação de
  responsabilidades (#2), contratos explícitos (#5), erro como arquitetura (#8),
  dependências mínimas (#10).
- REGRA-10 (multiplataforma) isolada em `util/fs` e `util/git` — único lugar com
  código não-portável.

---

## 3. Modelo de dados

```text
ParsedInvocation        ← saída do parse (TASK-02)
  command:     'init' | 'doctor' | 'update' | null
  flags:       objeto com as flags do comando (values do parseArgs)
  positionals: string[]                 // ex: [path] do init
  wantsHelp:   boolean                  // --help / -h
  wantsVersion:boolean                  // --version / -v
  error:       CortexError | null       // uso inválido / comando desconhecido

CommandSpec             ← descritor de cada comando (dispatch + help gerado, CRIT-21)
  name:        string
  summary:     string                   // 1 linha → alimenta --help
  options:     parseArgs-options         // fonte ÚNICA p/ parse E p/ help
  positionals: { name, required }[]
  run:         (ctx) => Promise<CommandResult>

VersionRecord           ← REGRA-02 (gravado no init, TASK-08; modelado aqui)
  source, ref, commit, installed_at, cli_version   // YAML flat à mão (DEC-09)

SourceLayout            ← REGRA-01, FONTE DA VERDADE única (CRIT-21; impl. TASK-05)
  INCLUDE_DIRS, INCLUDE_FILES_AT_ROOT, EXCLUDE_PATTERNS

CommandResult           ← CRIT-20 / REGRA-11, saída acionável de todo comando
  ok, actions[], location?, nextStep?, warnings[]

CortexError             ← modelo de erro (REGRA-11, E-01a..e), erro como dado
  code, cause, action
```

---

## 4. Arquitetura de módulos

```text
bin/cli.js              [existe]  entrypoint fino → run() → process.exit(code)
src/cli.js              [edita]   run(argv): parse → (help/version) → dispatch → render

  TASK-02
  src/core/parse.js     [novo]    argv → ParsedInvocation (node:util parseArgs, 2 passagens)
  src/core/dispatch.js  [novo]    registry de CommandSpec; roteia
  src/core/help.js      [novo]    gera ajuda global e por-comando dos CommandSpec
  src/commands/init.js  [novo]    CommandSpec; run = stub nesta fase
  src/commands/doctor.js[novo]    CommandSpec; run = stub
  src/commands/update.js[novo]    CommandSpec; run = stub

  TASK-03
  src/util/errors.js    [novo]    CortexError + ErrorCode
  src/util/output.js    [novo]    renderResult / renderError (REGRA-11)
  src/util/fs.js        [doc]     contrato modelado; impl. quando init precisar (TASK-04+)
  src/util/git.js       [doc]     contrato modelado; impl. quando init precisar (TASK-04+)
```

**Fronteiras:** `commands/*` dependem de `util/*`, nunca o contrário. `core/*` não
conhece comandos concretos — só o registry. `util/git` e `util/fs` concentram todo o
não-portável (REGRA-10).

---

## 5. Fluxo de controle

```text
argv
 → parse(argv, registry) ──► ParsedInvocation
     ├─ wantsVersion           → imprime versão                 → exit 0
     ├─ command=null + help    → ajuda global                   → exit 0
     ├─ command=null (sem help)→ ajuda global (uso inválido)    → exit 2
     ├─ error (desconhecido/   → renderError (causa + ação)     → exit 1
     │         uso inválido)
     ├─ wantsHelp (com comando)→ ajuda do comando               → exit 0
     └─ dispatch → run(ctx)
            ├─ CommandResult ok → renderResult                  → exit 0
            ├─ CommandResult !ok→ renderResult                  → exit 1
            └─ CortexError      → renderError                   → exit 1
```

---

## 6. Decisões de modelagem (trade-offs)

| # | Decisão | Favorece | Sacrifica |
|---|---|---|---|
| M-1 | Subcomando como 1º positional; parse em 2 passagens (`strict:false` p/ achar o comando, depois `strict:true` com as `options` do `CommandSpec`) | Flags/help por comando sem lib | Assume comando-primeiro; flag antes do comando não é suportada |
| M-2 | Erro como dado (`CortexError` renderizado num ponto só) | CRIT-20/REGRA-11 garantidos e testáveis | Disciplina de não usar `console.error` solto |
| M-3 | `CommandSpec` é fonte única de flags+summary; help gerado dele | CRIT-21 por construção | — |
| M-4 | `SourceLayout` em módulo de constantes importável | CRIT-21; reuso doctor/update | — |
| M-5 | Stubs de `doctor`/`update` já registrados na TASK-02 | dispatch e help completos desde já | 3 arquivos quase vazios por ora |

---

## 7. Contratos modelados, implementação adiada (TASK-04+)

```text
util/fs.js   (REGRA-10)
  join/resolve via node:path (sem separador literal)
  ensureDir(path)            — cria sem destruir preexistente
  copyTree(src, dst, filter) — sem shell, sem chmod, EOL preservado
  exists(path), readText/writeText

util/git.js  (REGRA-10, E-01a/E-01b)
  assertGitAvailable()       — ausência → CortexError(GIT_MISSING)
  lsRemote(url, ref)         — resolve commit sem baixar tudo
  cloneShallow(url, ref, dir)— clone raso; falha → SOURCE_UNREACHABLE
```

---

## 8. Fora de escopo desta frente

Lógica real de `init`/`doctor`/`update` (clone, detecção de layout, cópia do núcleo,
gravação do `VERSION`, diff/merge) — TASK-04 em diante. Aqui só o esqueleto de
parse/dispatch/saída e os utilitários de erro/saída.
