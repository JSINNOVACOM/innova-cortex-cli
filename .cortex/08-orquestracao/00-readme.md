# Orquestração de agentes

## Objetivo

Definir como o sistema coordena agentes, skills e fluxos de trabalho em diferentes tipos de demanda, sem misturar esse papel com governança global, padrões técnicos ou documentação real de projeto.

Relacionado a:

- [Claude](../Claude.md)
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [agente-analista](../02-agentes/agente-analista.md)
- [agente-planejador](../02-agentes/agente-planejador.md)

---

## Princípio central

Governança, operação e orquestração não são a mesma coisa.

- **governança** define regras, limites e critérios
- **operação** define agentes, skills, templates e outputs
- **orquestração** define como essas partes se encadeiam em um fluxo de trabalho

Esta pasta existe para coordenar execução.

Ela não existe para substituir:

- regras globais
- definição de agente
- skill específica
- documentação real de projeto

---

## Papel desta pasta

A pasta `08-orquestracao/` existe para responder perguntas como:

- qual tipo de trabalho entrou?
- qual agente deve atuar primeiro?
- quando um agente deve passar o contexto para outro?
- o que precisa estar pronto antes de avançar?
- o que caracteriza saída mínima aceitável de uma etapa?
- quando interromper o fluxo e voltar para análise ou clarificação?

---

## O que esta pasta deve conter

Esta pasta deve conter orientações sobre:

- sequenciamento entre agentes
- fluxo por tipo de trabalho
- roteamento entre papéis
- critérios de entrada e saída entre etapas
- handoffs estruturados
- pontos de parada, retorno ou validação

---

## O que esta pasta não deve conter

Esta pasta não deve virar:

- catálogo de regras gerais
- repositório de decisões técnicas por linguagem
- documentação principal de projeto
- conjunto de templates de projeto
- backlog de tarefas
- histórico cronológico de execução

Esses papéis já pertencem a outras áreas do sistema.

---

## Estrutura desta pasta

```text
08-orquestracao/  
  00-readme.md  
  tipos-de-trabalho/  
  roteamento/  
  handoffs/  
  criterios-de-entrada-e-saida/
```

---

## Papel de cada subpasta

### `tipos-de-trabalho/`

Define fluxos por tipo de demanda.

Exemplos de tipos de trabalho:

- novo projeto
- refatoração
- nova feature
- migração
- correção
- discovery técnico
- revisão de documentação
- reorganização estrutural

A pergunta central aqui é:  
**“qual fluxo faz sentido para este tipo de trabalho?”**

---

### `roteamento/`

Define como escolher o próximo agente, skill ou etapa com base no estado atual do trabalho.

A pergunta central aqui é:  
**“para onde isso deve ir agora?”**

Exemplos de uso:

- quando uma demanda ainda precisa de contexto
- quando já existe base suficiente para planejamento
- quando o fluxo deve voltar para análise
- quando o trabalho deve parar e pedir validação humana

---

### `handoffs/`

Define como a passagem de contexto entre agentes deve acontecer.

A pergunta central aqui é:  
**“o que precisa ser entregue para a próxima etapa começar bem?”**

Exemplos de conteúdo:

- estrutura mínima de handoff
- o que não pode ficar implícito
- o que deve estar explícito antes de transferir responsabilidade

---

### `criterios-de-entrada-e-saida/`

Define as condições mínimas para iniciar ou encerrar etapas.

A pergunta central aqui é:  
**“isso está pronto para entrar ou sair desta etapa?”**

Exemplos de conteúdo:

- entrada mínima para análise
- saída mínima de um planejamento
- condição para iniciar implementação
- critérios para voltar uma etapa

---

## Relação com agentes

A orquestração não substitui agentes.

Ela usa agentes como unidades de atuação.

Regra prática:

- agente define **quem atua**
- skill define **como atua**
- template define **como estruturar**
- orquestração define **quando cada um entra e sai**

---

## Relação com projetos reais

A orquestração ajuda a conduzir o trabalho, mas não substitui a documentação do projeto.

Se o fluxo estiver lidando com um projeto específico, a documentação real continua no próprio projeto, especialmente em:

- `docs/context/current-status.md`
- `docs/context/handoff.md`

A pasta de orquestração não deve absorver:

- status detalhado de projeto
- handoff real de projeto
- plano principal de projeto
- documentação funcional do projeto

---

## Relação com material do projeto

A orquestração pode gerar referências que depois apareçam em arquivos do projeto:

- análises → `docs/analysis/`
- decisões → `docs/decisions/`
- specs → `docs/specs/`
- visão futura → `docs/to-be/`

A lógica principal do fluxo continua aqui em `08-orquestracao/`, enquanto o conteúdo principal do projeto continua no próprio projeto.

---

## Regra de crescimento

Não criar dezenas de fluxos cedo demais.

Começar com poucos arquivos realmente úteis.

Preferir:

- 1 fluxo claro por tipo de trabalho relevante
- 1 regra de roteamento reutilizável
- 1 padrão de handoff
- 1 conjunto inicial de critérios de entrada e saída

Evitar:

- microvariações excessivas
- fluxos redundantes
- orquestração ornamental
- árvore complexa sem uso real

---

## Critério de bom uso

A orquestração está sendo bem usada quando:

- o sistema consegue encaminhar demandas com clareza
- o próximo passo entre agentes fica explícito
- há menos ambiguidade de sequência
- o fluxo evita atuação prematura
- a passagem entre etapas fica mais previsível
- o sistema escala melhor para múltiplos agentes

---

## Sinais de uso ruim

Há desvio quando:

- agentes atuam sem critério claro de entrada
- cada demanda segue um fluxo improvisado
- handoffs ficam implícitos
- o sistema cria múltiplos fluxos quase iguais
- a pasta vira coleção de desenhos sem uso real
- a orquestração começa a duplicar regras ou documentação de projeto

---

## Regra final

A orquestração existe para coordenar o trabalho entre agentes.

Ela não substitui:

- a governança do sistema
- a operação dos agentes
- os padrões técnicos
- a documentação real dos projetos

Seu papel é simples:  
**dar ordem, sequência e clareza ao fluxo de execução.**