# Project Context — innova-cortex-cli

Memória persistente do projeto. Contexto estável entre sessões.

---

## Identidade

- **Nome:** innova-cortex-cli
- **Pacote npm:** `innova-cortex` (invocável via `npx innova-cortex`)
- **Objetivo:** CLI Node que instala e versiona o `.cortex/` em projetos adopters, substituindo `git clone + cp -r`, com versão rastreável (`.cortex/VERSION`) e atualização controlada que preserva customizações.
- **Repositório:** próprio (`innova-cortex-cli`), separado do repo de conteúdo `JSINNOVACOM/innova-cortex` (DEC-07).

---

## Decisões-chave (estáveis)

- **DEC-01** — Dev no WSL nativo (`~/dev/projeto_pessoal/`), nunca `/mnt/c`.
- **DEC-02** — Multiplataforma é premissa dura; validação no Windows nativo é gate de release (TASK-11/CRIT-10).
- **DEC-04** — Copiar só o núcleo (`INCLUDE_DIRS`) da raiz `cortex/`; detecção de layout legado embutida.
- **DEC-05** — `.cortex/VERSION` em YAML, versionado no Git do adopter (`source`/`ref`/`commit`/`installed_at`/`cli_version`).
- **DEC-06** — `update` conservador por default; agressivo opt-in.
- **DEC-07** — Repo separado; publicar como `innova-cortex`; CLI busca conteúdo via git URL.
- **DEC-08** — Versionamento do CLI é próprio e independente do conteúdo. **Nomenclatura:** "CLI — `init`" e "CLI — `doctor`/`update`", nunca "v0.2/v0.3".
- **DEC-09** (fechada 2026-06-05) — Node **≥ 20 LTS**, **ESM**, **zero deps de runtime**. Stdlib: `node:util` parseArgs, `node:child_process`, `node:fs/promises`; testes `node:test`; YAML do VERSION à mão.
- **DEC-10** — Spec canônica vive no vault; o repo apenas referencia. Não editar `docs/spec/` como fonte de verdade.

---

## Convenções operacionais

- Governança em `.cortex/` — ler `.cortex/Claude.md` antes de trabalho estruturado; não alterar sem pedido direto.
- `docs/` e `memory/` fora do Git por default (P11.1). Spec não versionada neste repo.
- Fluxos acionados pelo nome ("Use o fluxo X") seguem `.cortex/08-orquestracao/tipos-de-trabalho/`.

---

## Estado atual (resumo — detalhe em docs/context/current-status.md)

- Init Project concluído (fundação documental + git + .gitignore).
- Próximo: Create Feature → TASK-01 (bootstrap Node).

---

## Estrutura-alvo do código (da spec)

```text
innova-cortex-cli/
├── bin/cli.js              # entrypoint (shebang)
├── src/
│   ├── commands/           # init, doctor, update
│   ├── core/               # clone, layout, cópia, template, VERSION, merge
│   └── util/               # fs portável, wrapper git, logging
├── test/                   # fixtures, multiplataforma
└── package.json            # ESM, bin: innova-cortex → ./bin/cli.js
```
