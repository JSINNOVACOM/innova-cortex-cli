# Roteamento básico

## Objetivo
Definir regras iniciais de encaminhamento entre agentes, skills e etapas, ajudando o sistema a decidir qual deve ser o próximo movimento mais sensato diante de um tipo de demanda.

Relacionado a:
- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-inicializacao-projeto](../../02-agentes/agente-inicializacao-projeto.md)
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
- [agente-analista](../../02-agentes/agente-analista.md)
- [agente-planejador](../../02-agentes/agente-planejador.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)

---

## Princípio central
Roteamento não é execução.

Roteamento existe para responder:
- quem deve atuar agora?
- com base em quê?
- o que precisa acontecer antes?
- quando o fluxo deve avançar, voltar ou parar?

O objetivo desta pasta não é executar o trabalho.
O objetivo é evitar sequência improvisada.

---

## Papel deste arquivo
Este arquivo define regras iniciais e genéricas de roteamento dentro do sistema.

Ele deve ajudar a decidir:
- qual agente tende a entrar primeiro
- quando ainda falta contexto
- quando já existe base para estruturar
- quando o fluxo deve ir para planejamento
- quando o trabalho deve parar e pedir validação humana

---

## O que este arquivo deve fazer
Este arquivo deve:
- orientar encaminhamento inicial
- reduzir ambiguidade entre etapas
- evitar salto prematuro para implementação
- apoiar triagem entre análise, arquitetura, planejamento e continuidade

---

## O que este arquivo não deve fazer
Este arquivo não deve:
- substituir as definições dos agentes
- substituir skills
- virar catálogo de fluxos detalhados por stack
- virar backlog de execução
- duplicar documentação real do projeto

---

## Regra geral de prioridade
Na dúvida, o roteamento deve favorecer:

1. entendimento
2. clarificação
3. estruturação
4. planejamento
5. execução

Ou seja:
se ainda não está claro o suficiente, não avançar para a próxima etapa como se estivesse.

---

## Regras básicas de roteamento

### 1. Se a demanda chegou vaga ou ambígua
Encaminhar primeiro para:
- [agente-analista](../../02-agentes/agente-analista.md)
ou
- [agente-inicializacao-projeto](../../02-agentes/agente-inicializacao-projeto.md), se for claramente um projeto novo

Objetivo:
- entender melhor o contexto
- separar fato, hipótese e dúvida
- evitar execução com base frágil

Sinais típicos:
- “quero criar algo”
- “preciso organizar isso”
- “não sei bem por onde começar”
- contexto incompleto
- múltiplas interpretações possíveis

---

### 2. Se a demanda é claramente um novo projeto
Encaminhar primeiro para:
- [agente-inicializacao-projeto](../../02-agentes/agente-inicializacao-projeto.md)

Objetivo:
- criar base documental mínima
- estruturar o projeto no próprio projeto real
- tornar continuidade possível

Depois, normalmente seguir para:
- [agente-analista](../../02-agentes/agente-analista.md)
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
- [agente-planejador](../../02-agentes/agente-planejador.md)

---

### 3. Se a demanda já tem material e precisa de leitura crítica
Encaminhar para:
- [agente-analista](../../02-agentes/agente-analista.md)

Objetivo:
- revisar documento
- identificar lacunas
- apontar incoerências
- separar confirmação de interpretação

Sinais típicos:
- há documento para revisar
- há contexto já escrito
- o problema principal é avaliar qualidade, clareza ou consistência

---

### 4. Se a demanda já está entendida e precisa de estrutura
Encaminhar para:
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)

Objetivo:
- organizar a solução
- separar atual e futuro
- comparar alternativas
- definir estrutura de raciocínio ou solução

Sinais típicos:
- contexto suficiente já existe
- o problema agora é estruturar
- há múltiplos caminhos possíveis
- é necessário comparar trade-offs

---

### 5. Se a demanda já está entendida e precisa de sequenciamento
Encaminhar para:
- [agente-planejador](../../02-agentes/agente-planejador.md)

Objetivo:
- quebrar em etapas
- definir ordem
- apontar dependências
- registrar próximos passos

Sinais típicos:
- já existe base mínima de entendimento
- o problema principal é “como executar”
- a questão central é sequência e priorização

---

### 6. Se a demanda pede implementação imediata
Não encaminhar automaticamente para execução.

Antes, verificar:
- já existe contexto suficiente?
- o escopo está claro?
- os critérios mínimos estão explícitos?
- já existe base documental suficiente?
- o risco de alucinação ou retrabalho está aceitável?

Se a resposta for não, voltar para:
- análise
- inicialização
- arquitetura
ou
- planejamento

---

### 7. Se houver conflito, ambiguidade ou falta crítica de informação
Parar o avanço do fluxo.

Encaminhar para:
- clarificação
- análise
- revisão de contexto
ou
- validação humana

Não continuar apenas para “manter o fluxo andando”.

---

## Roteamento por estado da demanda

### Estado: pouco contexto
Destino mais provável:
- [agente-inicializacao-projeto](../../02-agentes/agente-inicializacao-projeto.md)
- [agente-analista](../../02-agentes/agente-analista.md)

---

### Estado: contexto parcial, mas desorganizado
Destino mais provável:
- [agente-analista](../../02-agentes/agente-analista.md)
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)

---

### Estado: contexto suficiente, mas solução ainda indefinida
Destino mais provável:
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)

---

### Estado: solução entendida, mas execução não planejada
Destino mais provável:
- [agente-planejador](../../02-agentes/agente-planejador.md)

---

### Estado: plano existe, mas falta validação para seguir
Destino mais provável:
- revisão crítica
- validação humana
- checagem de critérios de entrada e saída

---

## Perguntas de roteamento
Antes de decidir o próximo passo, responder:

- o problema está claro?
- já existe contexto suficiente?
- isso é um novo projeto ou continuidade?
- o principal problema agora é entender, estruturar ou planejar?
- falta documentação mínima?
- avançar agora reduz risco ou aumenta retrabalho?

Se essas perguntas não estiverem minimamente respondidas, o fluxo ainda não está pronto para avançar com segurança.

---

## Relação com `tipos-de-trabalho`
Este arquivo é uma regra geral de roteamento.

Fluxos mais específicos por tipo de demanda devem viver em:
- `08-orquestracao/tipos-de-trabalho/`

Ou seja:
- `tipos-de-trabalho` define o fluxo por contexto
- `roteamento-basico` define princípios gerais de encaminhamento

---

## Relação com handoffs
Roteamento decide para onde o trabalho vai.

Handoff decide o que precisa ser entregue para a próxima etapa começar bem.

Os dois são complementares:
- roteamento sem handoff gera passagem vazia
- handoff sem roteamento gera passagem sem direção

---

## Critério de bom uso
O roteamento está sendo bem usado quando:

- o próximo agente faz sentido pelo estado da demanda
- o fluxo não pula etapas cedo demais
- há menos improviso
- o sistema para quando deveria parar
- o encaminhamento reduz retrabalho

---

## Sinais de uso ruim
Há desvio quando:

- qualquer demanda vai direto para execução
- análise, arquitetura e planejamento são pulados sem critério
- o sistema escolhe o próximo agente por costume e não por contexto
- o fluxo continua mesmo sem clareza mínima
- o encaminhamento gera retrabalho previsível

---

## Regra final
O roteamento básico existe para impedir que o sistema avance de forma apressada ou arbitrária.

Seu papel é simples:
**direcionar a demanda para a próxima etapa mais coerente com o estado atual do trabalho.**
