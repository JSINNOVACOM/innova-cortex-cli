# Handoff — innova-cortex-cli

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** handoff
- **Estado:** em desenvolvimento
- **Última atualização:** 2026-06-06
- **Responsável:** Jonathan

---

## 1. Onde o trabalho parou

Init Project concluído; **TASK-01, TASK-02, base da TASK-03 e TASK-04 entregues e validadas**. CLI roda o pipeline de parse/dispatch/saída + clone temporário shallow com cleanup garantido; `node --test` verde (30/30). Pronto para a TASK-05 (detecção de layout + cópia do núcleo). Primeiro commit feito (`9f16d52`, branch `master`).

---

## 2. Última frente analisada

TASK-04 via Create Feature (clone temporário + cleanup garantido):
- `src/util/fs.js` — `makeTempDir`/`removeDir` portáveis (REGRA-10), base do ciclo de vida do temp.
- `src/util/git.js` — `assertGitAvailable` (→GIT_MISSING, E-01a) e `cloneShallow` (→SOURCE_UNREACHABLE, E-01b); git como subprocesso, sem shell.
- `src/core/clone.js` — `withTempClone({from,ref}, run)`: assert→temp→clone→run, com remoção **garantida no `finally`** (CRIT-06).
- `test/clone.test.js` — cleanup em sucesso/falha de clone/erro do callback + git ausente curto-circuita + erro real do git (offline).

Building block anterior (TASK-02 + base TASK-03): modelagem em `docs/features/cli-parse-dispatch.md`; pipeline parse/dispatch/help/errors/output.

---

## 3. O que já está pronto

- Base documental + `CLAUDE.md` + `.gitignore` (P11.1). DEC-09 registrada. Commit inicial `9f16d52`.
- TASK-01: bootstrap Node executável e testado.
- TASK-02: parse + dispatch + `--help`/`--version` (CRIT-20, CRIT-21).
- TASK-03 (base): `errors.js`, `output.js`, `fs.js` (temp), `git.js` (assert+clone).
- TASK-04: `withTempClone` com cleanup garantido (CRIT-06, E-01a/b) — validado por testes e execução real.

---

## 4. O que ainda precisa acontecer

- TASK-05..12 (`init` real: cópia do núcleo → CLAUDE.md → estrutura → VERSION → escrita atômica → testes → publicação).
- TASK-13..16 (`doctor`/`update`); `lsRemote` em `git.js` entra com o `doctor`.
- CI multiplataforma (Linux + Windows nativo) — estabelecer cedo.

---

## 5. Próximos passos imediatos

1. Acionar Create Feature → **TASK-05** consultando `.cortex/08-orquestracao/tipos-de-trabalho/create-feature.md`.
2. Expandir `util/fs.js` com `copyTree(src, dst, filter)` (sem shell, EOL preservado) + criar módulo `SourceLayout` (REGRA-01); detectar `cortex/` vs. raiz legada (CRIT-12).
3. Consumir `withTempClone` no `init` para copiar o núcleo do clone para `<destino>/.cortex/`.
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
