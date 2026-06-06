# Handoff — innova-cortex-cli

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** handoff
- **Estado:** em desenvolvimento
- **Última atualização:** 2026-06-05
- **Responsável:** Jonathan

---

## 1. Onde o trabalho parou

Init Project concluído; **TASK-01, TASK-02 e a base da TASK-03 entregues e validadas**. CLI roda o pipeline completo de parse/dispatch/saída; `node --test` verde (22/22). Pronto para a TASK-04 (início da lógica real do `init`).

---

## 2. Última frente analisada

TASK-02 + base da TASK-03 via Create Feature (modelagem em `docs/features/cli-parse-dispatch.md`):
- `src/core/parse.js` — argv → `ParsedInvocation` (`util.parseArgs` em 2 passagens; comando-primeiro).
- `src/core/dispatch.js` — registry de `CommandSpec` (fonte única p/ dispatch e help).
- `src/core/help.js` — ajuda global e por-comando gerada do registry (CRIT-21).
- `src/commands/{init,doctor,update}.js` — `CommandSpec` + `run` stub.
- `src/util/errors.js` (`CortexError`+`ErrorCode`) e `src/util/output.js` (render acionável, REGRA-11).
- `src/cli.js` religado ao pipeline; `bin/cli.js` propaga exit code.

---

## 3. O que já está pronto

- Base documental + `CLAUDE.md` materializado + `.gitignore` (P11.1). DEC-09 registrada.
- TASK-01: bootstrap Node executável e testado.
- TASK-02: parse + dispatch + `--help`/`--version` (CRIT-20, CRIT-21) — validado por testes e execução manual.
- TASK-03 (base): `errors.js` + `output.js`. Restam `fs.js`/`git.js` (contratos modelados, impl. adiada).
- `git init` feito (branch `master`); nenhum commit ainda.

---

## 4. O que ainda precisa acontecer

- TASK-03 (restante): `util/fs.js`, `util/git.js` quando o `init` precisar (TASK-04+).
- TASK-04..12 (`init` real) → TASK-13..16 (`doctor`/`update`).
- CI multiplataforma (Linux + Windows nativo) — estabelecer cedo.

---

## 5. Próximos passos imediatos

1. Acionar Create Feature → **TASK-04** consultando `.cortex/08-orquestracao/tipos-de-trabalho/create-feature.md`.
2. Implementar `util/git.js` (contrato em `docs/features/cli-parse-dispatch.md` §7) + clone temporário shallow com cleanup garantido (CRIT-06, E-01b).
3. Validar com `node --test` e execução manual.

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
