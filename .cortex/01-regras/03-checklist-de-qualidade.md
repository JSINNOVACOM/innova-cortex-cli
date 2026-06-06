# Checklist de qualidade

## Objetivo
Garantir que toda entrega produzida pelo agente tenha clareza, rastreabilidade e utilidade prática.

Relacionado a:
- [Claude](../Claude.md)
- [00-regras-gerais](00-regras-gerais.md)
- [01-limites-de-atuacao](01-limites-de-atuacao.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [agente-analista](../02-agentes/agente-analista.md)
- [agente-planejador](../02-agentes/agente-planejador.md)
- [skill-mapear-contexto](../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../03-skills/skill-revisar-documento.md)

---

## Checklist obrigatório

### Estrutura lógica
- O objetivo está claro?
- O contexto foi entendido antes da ação?
- O estado atual está separado da visão futura?
- Há distinção entre problema, hipótese e recomendação?

### Qualidade da informação
- Existe alguma hipótese sendo tratada como fato?
- Existe alguma conclusão além das evidências?
- As incertezas foram explicitadas?
- O que está confirmado foi registrado em `docs/analysis/current-state-assessment.md`?
- O que está em aberto foi registrado em `docs/analysis/gaps-and-unknowns.md`?

### Qualidade da decisão
- A recomendação tem justificativa?
- Existem trade-offs explícitos?
- Existem riscos explicitados?
- Foram consideradas alternativas?

### Qualidade operacional
- A ação respeita [01-limites-de-atuacao](01-limites-de-atuacao.md)?
- O output gerado tem utilidade real?
- Há risco de gerar volume sem valor?
- Decisões duradouras foram registradas em `memory/project-context.md`?

### Continuidade
- Existem pendências?
- Elas foram registradas em `docs/context/current-status.md`?
- O próximo passo está claro?
- O agente correto foi usado?
- O `docs/context/handoff.md` está atualizado para retomada?

### Aprendizado do projeto
- Houve erro relevante, retrabalho, confusão ou comportamento inadequado do agente?
- O caso precisa ser tratado como incidente do projeto?
- O ocorrido revela um padrão de falha com chance de repetição?
- Já existe correção preventiva clara a ser registrada?

Quando aplicável, registrar em `memory/learnings.md` (mediante aprovação do usuário), nas seções apropriadas:
- `## Incidentes` — erros pontuais com causa e efeito identificados
- `## Padrões de falha observados` — padrões com potencial de repetição
- `## Correções preventivas recomendadas` — ajustes estruturais

---

## Uso por agente

### Para estruturação
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [skill-mapear-contexto](../03-skills/skill-mapear-contexto.md)

### Para revisão crítica
- [agente-analista](../02-agentes/agente-analista.md)
- [skill-revisar-documento](../03-skills/skill-revisar-documento.md)

### Para sequenciamento de execução
- [agente-planejador](../02-agentes/agente-planejador.md)

---

## Critério final

Nenhum output deve ser considerado bom apenas porque está bem escrito.

Ele precisa ser:
- correto
- útil
- revisável
- rastreável
