# System Overview — innova-cortex-cli

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** system-overview
- **Estado:** inicial
- **Última atualização:** 2026-06-05
- **Responsável:** Jonathan

---

## 1. Resumo do projeto

CLI em Node, invocável via `npx innova-cortex`, que **instala e versiona o `.cortex/`** (governança Innova Cortex) dentro do projeto de um adopter. Substitui o fluxo manual `git clone + cp -r`, que era frágil e sem rastreabilidade. Publicado no npm como pacote `innova-cortex`. Repositório próprio (`innova-cortex-cli`), separado do repo de conteúdo `JSINNOVACOM/innova-cortex` (DEC-07).

---

## 2. Propósito aparente

Eliminar a fricção e o erro humano da adoção/manutenção da governança: garantir que o adopter receba **só o núcleo** da governança, com a **versão rastreável** e **atualizações controladas** que preservam customizações locais. Princípio canônico (Decisão 07 do OSS): instalação e manutenção do `.cortex/` são responsabilidade do CLI, não do adopter.

---

## 3. O que o sistema aparentemente faz

- `init` — clona o repo de conteúdo numa `ref`, copia só o núcleo (`INCLUDE_DIRS`), materializa o `CLAUDE.md` do template, cria a estrutura mínima do projeto e grava o `.cortex/VERSION`.
- `doctor` — compara a versão local com o remoto, detecta arquivos modificados localmente e sugere `update`. (somente leitura)
- `update` — atualiza o `.cortex/` preservando customizações (estratégia conservadora por default; agressiva opt-in).
- `--help` / `--version` — convenções padrão de CLI Node.

---

## 4. Áreas principais identificadas

- **Entrada/CLI:** parse de argumentos + dispatch de comandos (`bin/cli.js`).
- **Comandos:** `src/commands/` (`init`, `doctor`, `update`).
- **Núcleo:** `src/core/` (clone, detecção de layout, cópia filtrada, materialização de template, geração de VERSION, engine de diff/merge).
- **Utilitários:** `src/util/` (fs portável, wrapper de git como subprocesso, logging/resumo).
- **Testes:** `test/` com fixtures, rodando em Linux e Windows nativo.

---

## 5. Limites percebidos

### Dentro do escopo percebido
- Instalação (`init`) e gerenciamento contínuo (`doctor`/`update`) do `.cortex/` via `npx`.
- Multiplataforma: Windows, macOS, Linux.

### Fora do escopo percebido
- Redesign visual/UX da linha de comando.
- Package managers além de `npx` (Bun, Yarn) — adicionável depois.
- Instalação via `git submodule`.
- Monorepo com vários `.cortex/`.
- Alterar a governança `01-10` ou abrir frente na pasta `11`.

---

## 6. Fontes usadas para esta visão

- `docs/spec/visao.md`, `docs/spec/tasks.md`, `docs/spec/decisoes.md` (spec canônica do CLI)
- `.cortex/Claude.md` e regras de governança
- Decisão 07 do OSS (input canônico)

---

## 7. Confirmado

- Runtime = Node, distribuição via `npx innova-cortex` (DEC-07).
- Repo separado, publicado como `innova-cortex` (DEC-07).
- Versionamento do CLI é próprio e independente do conteúdo (DEC-08).
- DEC-09 fechada: Node ≥ 20 LTS, ESM, zero deps de runtime.

---

## 8. Hipóteses

- O layout legado (raiz vs. subdir `cortex/`) ainda existe em refs antigas e precisa de detecção embutida (DEC-04).
- A estratégia conservadora de `update` cobre a maioria dos casos reais de customização local.

---

## 9. Dúvidas em aberto

- Comportamento exato do `update` em conflitos não triviais (3-way merge?).
- Forma final de documentar a lista-fonte (`INCLUDE_DIRS`) gerada (CRIT-21).

---

## 10. Observações relevantes

- Desenvolvimento no WSL nativo (DEC-01), **validação no Windows nativo** é gate de release (DEC-02 / TASK-11) — onde o `cp -r` mais quebrou.

---

## 11. Documentos relacionados no projeto
- `docs/business/domain-overview.md`
- `docs/analysis/current-state-assessment.md`
- `docs/analysis/gaps-and-unknowns.md`
- `docs/context/current-status.md`
- `docs/context/handoff.md`
