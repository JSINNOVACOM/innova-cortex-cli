# Skill: Iniciar projeto

## Objetivo
Iniciar a organização documental de um projeto antes de qualquer implementação, criando uma base mínima de entendimento, continuidade e rastreabilidade.

Relacionado a:
- [Claude](../Claude.md)
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
- [skill-mapear-contexto](skill-mapear-contexto.md)
- [templates-readme](../04-templates/templates-readme.md)

---

## Quando usar
Usar esta skill quando:
- um projeto está começando
- há pouco contexto consolidado
- a documentação é insuficiente
- existe risco de partir cedo para execução
- será necessário organizar discovery antes de especificar ou implementar

---

## Resultado esperado
Ao final da execução, deve existir pelo menos:
- estrutura documental mínima proposta ou criada
- entendimento inicial do projeto organizado
- separação entre confirmado, hipótese e dúvida
- status atual registrado no projeto
- handoff preparado no projeto
- lacunas principais visíveis
- próximo passo recomendado

---

## Estrutura mínima sugerida

```text
/docs
  /as-is
    system-overview.md

  /business
    domain-overview.md

  /analysis
    current-state-assessment.md
    gaps-and-unknowns.md

  /context
    current-status.md
    handoff.md
```

Esta estrutura existe para tirar o projeto do estado de contexto disperso e colocá-lo em um estado minimamente navegável.

---

## Papel desta skill
Esta skill existe para transformar uma intenção inicial de projeto em uma base documental útil.

Ela deve ajudar a:
- organizar o ponto de partida
- separar o que já se sabe do que ainda está em aberto
- evitar execução precoce
- registrar continuidade no lugar certo
- preparar a próxima etapa do trabalho

---

## Passos

### 1. Entender a demanda inicial
- identificar qual é o projeto ou iniciativa
- resumir o problema aparente
- registrar restrições já conhecidas
- separar sinais de fato, hipótese e dúvida

### 2. Avaliar o nível atual de clareza
- identificar se o projeto está solto, parcial ou minimamente compreendido
- apontar dependência de conhecimento informal
- explicitar riscos de começar cedo demais

### 3. Propor ou criar a estrutura mínima
- garantir que o núcleo documental exista
- evitar abrir documentação demais sem necessidade
- organizar os arquivos por finalidade
- para projetos técnicos: verificar se há repositório Git; se ausente, propor ao usuário — nunca executar sem aprovação explícita
- a ausência de Git em projeto técnico deve ser registrada como exceção, não tratada como padrão silencioso

### 4. Preencher os documentos iniciais com base real
- registrar visão inicial do sistema
- registrar visão inicial de domínio
- registrar avaliação inicial do estado atual
- registrar lacunas e dúvidas em aberto
- registrar status atual do trabalho
- registrar handoff inicial

### 5. Preparar continuidade
- deixar claro o que já está minimamente consolidado
- deixar claro o que ainda depende de validação
- apontar a próxima ação mais útil

### 6. Encaminhar para a próxima etapa
Depois da inicialização, a skill normalmente prepara terreno para:
- [agente-analista](../02-agentes/agente-analista.md), quando ainda falta leitura crítica
- [agente-arquiteto](../02-agentes/agente-arquiteto.md), quando já existe base para estruturar
- [agente-planejador](../02-agentes/agente-planejador.md), quando já existe base para sequenciar execução

---

## Regra de fronteira
Quando a demanda for de projeto específico:
- registrar contexto, andamento e continuidade no próprio projeto
- usar especialmente:
  - `docs/context/current-status.md`
  - `docs/context/handoff.md`

Os registros do projeto vivem nos arquivos do projeto, granularmente:
- memória persistente do projeto → `memory/project-context.md`
- fatos confirmados → `docs/analysis/current-state-assessment.md`
- hipóteses em validação → `docs/analysis/gaps-and-unknowns.md`
- pendências e bloqueios → `docs/context/current-status.md`

---

## Templates envolvidos
- [template-system-overview](../04-templates/template-system-overview.md)
- [template-domain-overview](../04-templates/template-domain-overview.md)
- [template-current-state-assessment](../04-templates/template-current-state-assessment.md)
- [template-gaps-and-unknowns](../04-templates/template-gaps-and-unknowns.md)
- [template-current-status](../04-templates/template-current-status.md)
- [template-handoff](../04-templates/template-handoff.md)

---

## Sinais de uso correto
- o projeto deixa de depender apenas de conversa informal
- a base mínima aparece cedo
- dúvidas ficam explícitas
- a continuidade fica mais fácil
- o sistema evita começar por execução
- a próxima etapa fica mais coerente

---

## Sinais de uso ruim
Há desvio quando:
- o projeto começa por implementação
- a estrutura mínima não é criada quando necessária
- a documentação nasce inflada e vazia
- hipótese vira fato
- o projeto continua sem ponto claro de retomada
- arquivos globais do sistema começam a absorver contexto de projeto

---

## Regra final
O papel desta skill é simples:
**tirar o projeto do estado de contexto solto e colocá-lo em uma base documental mínima, útil e retomável antes de qualquer execução relevante.**
