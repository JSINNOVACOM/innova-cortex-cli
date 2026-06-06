# Handoff — innova-cortex-cli

Passagem de contexto para retomada da sessão: onde parou, o que está pronto e próximos passos imediatos.

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** handoff
- **Estado:** em desenvolvimento
- **Última atualização:** 2026-06-06
- **Responsável:** Jonathan

---

## 1. Onde o trabalho parou

Init Project concluído; **TASK-01, TASK-02, base da TASK-03, TASK-04, TASK-05 e TASK-06 entregues e validadas**. CLI roda o pipeline de parse/dispatch/saída + clone temporário + detecção de layout + cópia do núcleo + materialização do `CLAUDE.md`; `node --test` verde (44/44). Pronto para a TASK-07 (estrutura mínima). Commits: `9f16d52` (init), `70b6d46` (TASK-04), `612ff79` (TASK-05).

---

## 2. Última frente analisada

TASK-06 via Create Feature (materialização do `CLAUDE.md`):
- `src/core/claude-md.js` — `materializeClamdMd(governanceRoot, destDir, {name, objective})`: lê `04-templates/template-claude-md-local.md`; substitui `{{PROJECT_NAME}}`/`{{PROJECT_OBJECTIVE}}` + remove `<!-- TODO: ... -->` adjacente quando a flag é fornecida; sem flags, mantém placeholder + TODO visível (CRIT-02, REGRA-04); preserva `CLAUDE.md` existente retornando `{skipped:true}` (CRIT-11, REGRA-09).
- `test/claude-md.test.js` — ambos substituídos, só um substituído, ambos visíveis sem flags, preservação de existente, newline final.

Decisão de escopo: `init.js` **permanece stub** — composição com staging atômico + guardas é TASK-09.

TASK-05: `copyTree` portável em `util/fs.js` + `source-layout.js` (detecção CRIT-12 + cópia núcleo CRIT-01/REGRA-01).
TASK-04: `withTempClone` com cleanup garantido (`src/core/clone.js`); `assertGitAvailable`/`cloneShallow` em `util/git.js` (E-01a/b).

---

## 3. O que já está pronto

- Base documental + `CLAUDE.md` + `.gitignore` (P11.1). DEC-09 registrada. Commit inicial `9f16d52`.
- TASK-01: bootstrap Node executável e testado.
- TASK-02: parse + dispatch + `--help`/`--version` (CRIT-20, CRIT-21).
- TASK-03 (base): `errors.js`, `output.js`, `fs.js` (temp+copyTree), `git.js` (assert+clone).
- TASK-04: `withTempClone` com cleanup garantido (CRIT-06, E-01a/b) — validado por testes e execução real.
- TASK-05: `copyTree` + `source-layout.js` (detecção CRIT-12 + cópia do núcleo CRIT-01/REGRA-01) — validado (38/38).
- TASK-06: `claude-md.js` materialização do `CLAUDE.md` com substituição de placeholders (CRIT-02/REGRA-04) + preservação de existente (CRIT-11/REGRA-09) — validado (44/44).

---

## 4. O que ainda precisa acontecer

- TASK-06..12 (`init` real: CLAUDE.md → estrutura → VERSION → escrita atômica → composição no `init.js` → testes → publicação).
- TASK-13..16 (`doctor`/`update`); `lsRemote` em `git.js` entra com o `doctor`.
- CI multiplataforma (Linux + Windows nativo) — estabelecer cedo.

---

## 5. Próximos passos imediatos

1. Acionar Create Feature → **TASK-07** consultando `.cortex/08-orquestracao/tipos-de-trabalho/create-feature.md`.
2. Criar `src/core/project-structure.js` (ou similar): `createMinimalStructure(destDir)` — cria `docs/context/`, `docs/analysis/`, `memory/` via `mkdir({recursive:true})` sem tocar diretórios já existentes (CRIT-03/11, REGRA-05/09).
3. Seguir para TASK-08 (VERSION) e TASK-09 (composição do `init.js` com staging atômico + guardas REGRA-07/08).
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
