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

Init Project concluído; **TASK-01..07 entregues e validadas**. CLI roda o pipeline parse/dispatch/saída + clone + layout + cópia do núcleo + `CLAUDE.md` + estrutura mínima; `node --test` verde (49/49). Pronto para a TASK-08 (VERSION). Commits: `9f16d52` (init), `70b6d46` (TASK-04), `612ff79` (TASK-05), `d1b0c0d` (TASK-06).

---

## 2. Última frente analisada

TASK-07 via Create Feature (estrutura mínima do projeto):
- `src/core/project-structure.js` — `MINIMAL_DIRS` + `createMinimalStructure(destDir)`: cria `docs/context/`, `docs/analysis/`, `memory/` via `mkdir({recursive:true})` — idempotente, não toca conteúdo preexistente (CRIT-03/11, REGRA-05/09). Retorna `{created, existing}` para o `init` reportar.
- `test/project-structure.test.js` — cria os 3 dirs, idempotência, preserva conteúdo, subpastas aninhadas, MINIMAL_DIRS conteúdo.

Decisão de escopo: `init.js` **permanece stub** — composição com staging atômico + guardas é TASK-09.

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

---

## 4. O que ainda precisa acontecer

- TASK-06..12 (`init` real: CLAUDE.md → estrutura → VERSION → escrita atômica → composição no `init.js` → testes → publicação).
- TASK-13..16 (`doctor`/`update`); `lsRemote` em `git.js` entra com o `doctor`.
- CI multiplataforma (Linux + Windows nativo) — estabelecer cedo.

---

## 5. Próximos passos imediatos

1. Acionar Create Feature → **TASK-08** consultando `.cortex/08-orquestracao/tipos-de-trabalho/create-feature.md`.
2. Criar `src/core/version.js`: `buildVersionRecord({source, ref, commit, installedAt, cliVersion})` produz o YAML flat do `.cortex/VERSION` (CRIT-04/05, REGRA-02); `writeVersion(stagingCortexDir, record)` grava o arquivo. Ler `source` do `git.js` (`revParseHead` para o `commit`).
3. Seguir para TASK-09 (composição do `init.js` com staging atômico + guardas REGRA-07/08) — ponto em que `init.js` deixa de ser stub.
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
