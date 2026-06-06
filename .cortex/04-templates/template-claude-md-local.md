# CLAUDE.md — {{PROJECT_NAME}} <!-- TODO: substituir pelo nome do projeto -->

## Projeto

Nome: {{PROJECT_NAME}} <!-- TODO: substituir pelo nome do projeto -->

Objetivo: {{PROJECT_OBJECTIVE}} <!-- TODO: descrever em 1-2 linhas o objetivo do projeto -->

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
- `docs/`, `memory/` (default ignorado; pode versionar arquivo específico via regra negativa explícita, ex: `!docs/business/domain-overview.md`)

Por default, **entram no Git**:

- `.cortex/` (governança precisa ser compartilhada com o time)
- `CLAUDE.md` (ponte pública sem segredos)
- código-fonte

A skill [skill-validar-encerramento](../03-skills/skill-validar-encerramento.md) (Check 5) aplica essa regra automaticamente no fechamento de Init Project e Setup Project. Detalhes em `.cortex/01-regras/04-estrutura-documental-de-projetos.md`, seção "Proteção mínima com `.gitignore`".
