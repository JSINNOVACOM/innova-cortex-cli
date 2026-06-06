# CLAUDE.md — Innova Cortex CLI

## Projeto

Nome: innova-cortex-cli

Objetivo: CLI Node (`npx innova-cortex`) que instala e versiona o `.cortex/` em projetos adopters, substituindo o fluxo manual `git clone + cp -r`. Torna a versão instalada rastreável (`.cortex/VERSION`) e as atualizações controladas, preservando customizações locais. Publicado no npm como pacote `innova-cortex`.

---

## Arquivo central de orientação

Antes de qualquer trabalho estruturado neste projeto, leia:

```text
./.cortex/Claude.md
```

`.cortex/` é a camada de disciplina operacional do harness, contém todas as regras, fluxos, agentes e skills que governam como o projeto funciona. O agente consulta .cortex/Claude.md antes de qualquer ação estruturada, garantindo consistência e evitando deriva entre sessões.

---

## Comandos operacionais

Quando você disser "Use o fluxo X", "Acione o agente Y" ou equivalente, busque a interpretação em `./.cortex/Claude.md`, não neste arquivo.

---

## Papel deste arquivo

Este `CLAUDE.md` local serve apenas como ponto de conexão entre este projeto e o arquivo central de orientação.

As regras de trabalho, critérios, fluxos, padrões e demais instruções devem ser obtidos a partir do arquivo central e dos documentos que ele indicar.

---

## Registros locais

- `docs/` — documentação do projeto
- `memory/` — contexto persistente entre sessões
- Não copie conteúdo de `.cortex/` para outro lugar

---

## Proteção mínima com `.gitignore` (regra P11.1)

Este projeto segue a regra P11.1 do Cortex. Por default, ficam **fora do Git**:

- `.claude/`, `tasks/`, `node_modules/`, `logs/`, `AGENTS.md`, `*.pyc`, `__pycache__/`, `.DS_Store` (sem decisão a tomar)
- `docs/spec/` apenas (canônica no vault — DEC-10)

**Entram no Git** (exceção local à P11.1, decidida em 2026-06-05 — ver `docs/context/current-status.md`):

- `.cortex/` (governança)
- `CLAUDE.md` (ponte)
- código-fonte
- `docs/` (exceto `spec/`) e `memory/` — **versionados como backup**, pois este é um projeto solo de fonte única e nada daqui é exposto ao adopter (o usuário recebe a governança do repo de conteúdo separado, não deste repo)

A skill [skill-validar-encerramento](../03-skills/skill-validar-encerramento.md) (Check 5) aplica essa regra automaticamente no fechamento de Init Project e Setup Project. Detalhes em `.cortex/01-regras/04-estrutura-documental-de-projetos.md`, seção "Proteção mínima com `.gitignore`".
