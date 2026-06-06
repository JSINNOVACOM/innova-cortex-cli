# Handoff — innova-cortex-cli

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** handoff
- **Estado:** em desenvolvimento
- **Última atualização:** 2026-06-06
- **Responsável:** Jonathan

---

## 1. Onde o trabalho parou

Init Project concluído; **TASK-01, TASK-02, base da TASK-03, TASK-04 e TASK-05 entregues e validadas**. CLI roda o pipeline de parse/dispatch/saída + clone temporário com cleanup garantido + detecção de layout e cópia do núcleo; `node --test` verde (38/38). Pronto para a TASK-06 (materialização do `CLAUDE.md`). Primeiro commit feito (`9f16d52`, branch `master`); TASK-04 em `70b6d46`.

---

## 2. Última frente analisada

TASK-05 via Create Feature (detecção de layout + cópia do núcleo):
- `src/util/fs.js` — `copyTree(srcDir, destDir, keep)`: cópia recursiva portável (REGRA-10) via `copyFile` byte-a-byte (EOL preservado), sem shell; predicado `keep(name,isDir)` por entrada.
- `src/core/source-layout.js` — `INCLUDE_DIRS`/`INCLUDE_FILES_AT_ROOT`/`EXCLUDE_PATTERNS` (fonte da verdade — REGRA-01); `resolveGovernanceRoot` (CRIT-12: `cortex/` se `cortex/Claude.md` existe, senão raiz legada); `copyGovernanceCore` (allowlist no topo + EXCLUDE defensivo aninhado → CRIT-01).
- `test/source-layout.test.js` — copyTree (keep + EOL), detecção dos 2 layouts, cópia só do núcleo, filtro de institucional aninhado, origem incompleta sem erro.

Decisão de escopo: `init.js` **permanece stub** — a composição (clone→detect→copy→staging→destino) com guardas REGRA-07/08 é da TASK-09. TASK-05 entrega só os building blocks.

Building block anterior (TASK-04): `withTempClone` com cleanup garantido (`src/core/clone.js`); `assertGitAvailable`/`cloneShallow` em `src/util/git.js` (E-01a/b).

---

## 3. O que já está pronto

- Base documental + `CLAUDE.md` + `.gitignore` (P11.1). DEC-09 registrada. Commit inicial `9f16d52`.
- TASK-01: bootstrap Node executável e testado.
- TASK-02: parse + dispatch + `--help`/`--version` (CRIT-20, CRIT-21).
- TASK-03 (base): `errors.js`, `output.js`, `fs.js` (temp+copyTree), `git.js` (assert+clone).
- TASK-04: `withTempClone` com cleanup garantido (CRIT-06, E-01a/b) — validado por testes e execução real.
- TASK-05: `copyTree` + `source-layout.js` (detecção CRIT-12 + cópia do núcleo CRIT-01/REGRA-01) — validado por testes (38/38).

---

## 4. O que ainda precisa acontecer

- TASK-06..12 (`init` real: CLAUDE.md → estrutura → VERSION → escrita atômica → composição no `init.js` → testes → publicação).
- TASK-13..16 (`doctor`/`update`); `lsRemote` em `git.js` entra com o `doctor`.
- CI multiplataforma (Linux + Windows nativo) — estabelecer cedo.

---

## 5. Próximos passos imediatos

1. Acionar Create Feature → **TASK-06** consultando `.cortex/08-orquestracao/tipos-de-trabalho/create-feature.md`.
2. Materializar o `CLAUDE.md` da raiz a partir de `04-templates/template-claude-md-local.md`, substituindo `{{PROJECT_NAME}}`/`{{PROJECT_OBJECTIVE}}` quando `--name`/`--objective`; sem flags, manter placeholder visível com `<!-- TODO -->` (CRIT-02, REGRA-04). Provável módulo `src/core/claude-md.js` + `readFile`/`writeFile` em `util/fs.js`.
3. Seguir para TASK-07 (estrutura mínima) e TASK-08 (VERSION); a composição final no `init.js` (staging atômico + guardas) é a TASK-09.
4. Validar com `node --test` e execução manual.

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
