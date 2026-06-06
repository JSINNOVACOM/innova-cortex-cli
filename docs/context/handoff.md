# Handoff — innova-cortex-cli

Passagem de contexto para retomada da sessão: onde parou, o que está pronto e próximos passos imediatos.

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** handoff
- **Estado:** em desenvolvimento
- **Última atualização:** 2026-06-06 (TASK-12)
- **Responsável:** Jonathan

---

## 1. Onde o trabalho parou

Init Project em andamento; **TASK-01..12 entregues e validadas**. TASK-12 entregou `README.md` (install-manifest gerado de `source-layout.js`), `scripts/generate-docs.js` e bump para `0.2.0`. `node --test` verde (66/66). **Publicação pendente:** aguardando CI Windows verde → `npm publish --access public`. Próximo: TASK-13 (`doctor`). Último commit: TASK-12.

---

## 2. Última frente analisada

TASK-12 via Create Feature (documentação gerada + v0.2.0):
- `README.md` — README do npm: usage do `init`, tabela de opções, seção "O que é instalado" com marcadores `<!-- GENERATED -->`.
- `scripts/generate-docs.js` — lê `INCLUDE_DIRS`, `INCLUDE_FILES_AT_ROOT`, `EXCLUDE_PATTERNS` de `source-layout.js` e injeta no README (CRIT-21, REGRA-01). Script: `npm run docs`.
- `package.json` — bumped de `0.1.0` → `0.2.0`; script `"docs"` adicionado.

TASK-11 via Create Feature (CI multiplataforma + smoke test e2e):
- `.github/workflows/ci.yml` — matrix `ubuntu-latest` + `windows-latest` × Node 20/22; `npm test` em todos. `fail-fast: false`.
- `test/e2e.test.js` — smoke test com fixture git local real (sem rede): CRIT-01..12.

TASK-10 via Create Feature (saída acionável do `init`):
- `src/core/init-flow.js` — `guardWrite(fn, dir)`: converte EACCES/EPERM → `CortexError WRITE_PERMISSION` (E-01d). Aplicado a `mkdir(destDir)`, `withTempClone` block e `rename`. `source` adicionada à linha VERSION do `CommandResult`.
- `test/init-flow.test.js` — 2 testes: E-01d (chmod parent read-only) + E-01e (destino não vazio, "preservado" nas actions).

TASK-09 via Create Feature (staging atômico + composição do `init.js`):
- `src/core/init-flow.js` — `runInit(opts, deps)`: guard CORTEX_EXISTS → `mkdir(destDir)` → `withTempClone` → `copyGovernanceCore` + `revParseHead` + `writeVersion` em staging → `rename` atômico (mesmo FS, `destDir/.cortex_staging → destDir/.cortex`) → `materializeClamdMd` (da governança instalada) → `createMinimalStructure`. Cleanup via `finally` (REGRA-08).
- `src/commands/init.js` — stub removido; chama `runInit({dest, from, ref, name, objective})`.
- `test/init-flow.test.js` — 7 testes (CORTEX_EXISTS, GIT_MISSING, staging cleanup, VERSION, CLAUDE.md, preserve, destDir creation).
- `test/cli.test.js` — teste "run init (stub)" atualizado para refletir comportamento real (CORTEX_EXISTS no CWD do projeto).

TASK-08: `version.js` + `revParseHead` — CRIT-04/05, REGRA-02.

TASK-07: `project-structure.js` estrutura mínima (CRIT-03/11, REGRA-05/09).
TASK-06: `claude-md.js` materialização do `CLAUDE.md` (CRIT-02/REGRA-04 + CRIT-11/REGRA-09).
TASK-05: `copyTree` + `source-layout.js` (CRIT-12 + CRIT-01/REGRA-01).
TASK-04: `withTempClone` com cleanup garantido (`clone.js`); `assertGitAvailable`/`cloneShallow` (`git.js`, E-01a/b).

---

## 3. O que já está pronto

- Base documental + `CLAUDE.md` + `.gitignore` (P11.1). DEC-09 registrada. Commit inicial `9f16d52`.
- TASK-01: bootstrap Node executável e testado.
- TASK-02: parse + dispatch + `--help`/`--version` (CRIT-20, CRIT-21).
- TASK-03 (base): `errors.js`, `output.js`, `fs.js` (temp+copyTree), `git.js` (assert+clone).
- TASK-04: `withTempClone` com cleanup garantido (CRIT-06, E-01a/b) — validado por testes e execução real.
- TASK-05: `copyTree` + `source-layout.js` (detecção CRIT-12 + cópia do núcleo CRIT-01/REGRA-01) — validado (38/38).
- TASK-06: `claude-md.js` materialização do `CLAUDE.md` (CRIT-02/REGRA-04 + CRIT-11/REGRA-09) — validado (44/44).
- TASK-07: `project-structure.js` estrutura mínima `docs/context/`, `docs/analysis/`, `memory/` (CRIT-03/11, REGRA-05/09) — validado (49/49).
- TASK-08: `version.js` + `revParseHead` — `buildVersionRecord`, `formatVersionYaml`, `writeVersion` (CRIT-04/05, REGRA-02) — validado (56/56).
- TASK-09: `init-flow.js` + `init.js` real — staging atômico, guards REGRA-07/08 (CRIT-07/08/09) — validado (63/63).
- TASK-10: `guardWrite()` + saída acionável E-01a..e — CRIT-20, REGRA-11 — validado (65/65).
- TASK-11: `.github/workflows/ci.yml` + `test/e2e.test.js` — CI multiplataforma + smoke test e2e (CRIT-01..12, sem rede) — validado (66/66).
- TASK-12: `README.md` + `scripts/generate-docs.js` + bump `0.2.0` — CRIT-21, REGRA-01 — validado (66/66). Publicação pendente.

---

## 4. O que ainda precisa acontecer

- TASK-06..12 (`init` real: CLAUDE.md → estrutura → VERSION → escrita atômica → composição no `init.js` → testes → publicação).
- TASK-13..16 (`doctor`/`update`); `lsRemote` em `git.js` entra com o `doctor`.
- CI multiplataforma (Linux + Windows nativo) — estabelecer cedo.

---

## 5. Próximos passos imediatos

1. Push → aguardar CI verde em `windows-latest` (CRIT-10 — gate de release).
2. CI verde → `npm publish --access public` (requer `npm login` com conta autorizada).
3. Após publicação: acionar Create Feature → **TASK-13** (`doctor`).

---

## 6. Alertas importantes

- **Nomenclatura:** usar "CLI — `init`" / "CLI — `doctor`/`update`", nunca "v0.2/v0.3" (DEC-08).
- **Não editar** a spec em `docs/spec/` (canônica no vault — DEC-10) nem a governança `.cortex/`.
- Desenvolver no WSL nativo (DEC-01); validar no Windows nativo (gate — DEC-02).
- `docs/` e `memory/` estão fora do Git por default (P11.1); a spec não é versionada neste repo.

---

## 7. Pontos que ainda exigem validação

- Comportamento multiplataforma real (paths, EOL, sem `chmod`).
- `util.parseArgs` cobre todo o parse sem lib externa.
- Estratégia de merge do `update` (fase posterior).

---

## 8. Materiais que devem ser consultados primeiro

- `docs/spec/visao.md`, `docs/spec/tasks.md`, `docs/spec/decisoes.md`, `docs/spec/criterios.md`, `docs/spec/regras-negocio.md`
- `docs/context/current-status.md`
- `memory/project-context.md`
- `.cortex/08-orquestracao/tipos-de-trabalho/create-feature.md`

---

## 9. Observações finais para continuidade

A spec é o blueprint sem ambiguidade; cada task referencia `CRIT`/`REGRA`. Seguir o mapa de dependências da `tasks.md` evita retrabalho. `init` (TASK-04..12) entrega valor sozinho — `doctor`/`update` só começam depois de `init` validado em uso real.
