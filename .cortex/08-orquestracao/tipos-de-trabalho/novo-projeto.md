# Tipo de trabalho: novo projeto

## Objetivo

Definir como o sistema deve conduzir demandas de novo projeto, desde o entendimento inicial até a preparação para execução, sem pular etapas e sem começar por implementação precoce.

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
- [skill-iniciar-projeto](../../03-skills/skill-iniciar-projeto.md)
- [skill-mapear-contexto](../../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)

---

## Princípio central

Novo projeto não deve começar por implementação.

Ele deve começar por:

- entendimento mínimo do problema
- delimitação inicial do escopo
- separação entre fato, hipótese e dúvida
- estrutura documental mínima
- visão clara do próximo passo

A meta deste fluxo não é “construir tudo”.  
A meta é criar base suficiente para construir com clareza.

---

## Quando este tipo de trabalho se aplica

Usar este fluxo quando:

- o projeto ainda não existe formalmente
- existe uma ideia, mas pouca estrutura
- há necessidade de iniciar algo novo do zero
- ainda não está claro o suficiente o que deve ser feito
- a equipe ou os agentes precisam de base documental antes de avançar

---

## Quando este tipo de trabalho não se aplica

Não usar este fluxo como padrão quando:

- o projeto já está em andamento e precisa só de continuidade
- a demanda é apenas uma feature pontual
- o trabalho é uma correção localizada
- o principal problema é refatoração de algo já existente
- já existe documentação suficiente e o ponto agora é execução

Nesses casos, outro tipo de trabalho deve ser usado.

---

## Perguntas que este fluxo deve responder

Antes de considerar o fluxo bem executado, o sistema deve conseguir responder minimamente:

- o que é este projeto?
- qual problema ele aparenta resolver?
- o que já está entendido?
- o que ainda está incerto?
- quais são os principais riscos?
- onde a continuidade do trabalho será registrada?
- qual é o próximo passo mais sensato?

---

## Agentes mais prováveis no fluxo

Os agentes mais comuns para novo projeto são:

1. [agente-inicializacao-projeto](../../02-agentes/agente-inicializacao-projeto.md)
2. [agente-analista](../../02-agentes/agente-analista.md)
3. [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
4. [agente-planejador](../../02-agentes/agente-planejador.md)

A ordem pode variar, mas o padrão é:

- iniciar
- entender
- estruturar
- planejar

---

## Skills mais prováveis no fluxo

As skills mais comuns para este tipo de trabalho são:

- [skill-iniciar-projeto](../../03-skills/skill-iniciar-projeto.md)
- [skill-mapear-contexto](../../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) (etapa de fechamento)

---

## Fluxo recomendado

### Etapa 1: entrada e clarificação inicial

Objetivo:  
entender minimamente a demanda.

Deve produzir:

- descrição inicial do projeto
- problema aparente
- contexto recebido
- restrições conhecidas
- dúvidas iniciais

Se ainda houver muita ambiguidade, não avançar para execução.

---

### Etapa 2: inicialização documental

Objetivo:  
criar a base mínima do projeto no próprio projeto real.

Estrutura mínima esperada:
```text
docs/  
  as-is/  
    system-overview.md  
  
  business/  
    domain-overview.md  
  
  analysis/  
    current-state-assessment.md  
    gaps-and-unknowns.md  
  
  context/  
    current-status.md  
    handoff.md

```

O foco aqui é sair do vazio documental.

Para projetos técnicos, verificar se o repositório Git já foi inicializado.
Se não estiver, propor ao usuário antes de avançar.
O sistema não deve executar `git init` sem aprovação explícita.
A ausência de Git em projeto técnico deve ser registrada como exceção explícita, não tratada como padrão silencioso.

Também validar a existência de `.gitignore` mínimo para proteger governança local, `docs/`, memória de agentes, tarefas temporárias, dependências e artefatos locais, conforme [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md).

---

### Etapa 3: mapeamento de contexto

Objetivo:  
organizar o que já se sabe e o que ainda está aberto.

Deve explicitar:

- fatos confirmados
- hipóteses
- dúvidas em aberto
- riscos iniciais
- limites percebidos

---

### Etapa 4: avaliação do estado inicial

Objetivo:  
produzir leitura crítica do que foi entendido até agora.

Deve responder:

- o nível de clareza é baixo, médio ou alto?
- quais são as maiores fragilidades?
- quais lacunas impedem avanço seguro?
- o projeto já pode ser especificado ou ainda precisa de descoberta?

---

### Etapa 5: preparação para continuidade

Objetivo:  
garantir que o projeto possa ser retomado sem depender de contexto implícito.

Deve atualizar no projeto:

- `docs/context/current-status.md`
- `docs/context/handoff.md`

Esses dois arquivos são obrigatórios para continuidade.

---

### Etapa 6: planejamento inicial

Objetivo:  
definir o próximo passo útil com base no nível de clareza alcançado.

A saída pode ser:

- continuar discovery
- aprofundar análise
- abrir especificação
- preparar implementação
- pedir validação humana

---

### Etapa 7: validação de fechamento (OBRIGATÓRIA)

**Status:** hard-required. Workflow NÃO pode ser declarado concluído sem este passo.

Objetivo:  
garantir que o material produzido neste fluxo não contém pendências silenciosas.

Aplicar [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) sobre os arquivos criados ou editados durante o fluxo (`CLAUDE.md`, `docs/`, `memory/`). A skill verifica:

- **Check 1:** placeholders pendentes (`{{...}}`, `<!-- TODO: ... -->`);
- **Check 2:** referências a arquivos que não existem;
- **Check 3:** EOF/newline final;
- **Check 4:** seções vazias com cabeçalho;
- **Check 5:** `.gitignore` mínimo (10 entradas da regra P11.1 — só roda em Init Project e Setup Project);
- **Check 6:** wikilinks fantasma (lista negra em `03-skills/wikilinks-fantasma.txt`).

O relatório consolidado deve ser apresentado ao usuário **mesmo se zero problemas encontrados** (output mínimo obrigatório). Para cada achado, decidir: corrigir agora ou registrar como pendência em `docs/context/current-status.md`.

O fluxo só pode ser declarado concluído após esta etapa, mesmo que algumas pendências sejam aceitas de forma deliberada.

---

## Saída mínima aceitável

Este fluxo só deve ser considerado minimamente concluído quando existir:

- estrutura mínima de documentação criada no projeto
- visão inicial do sistema ou problema
- visão inicial de domínio
- avaliação inicial do estado atual
- lacunas visíveis
- status atual registrado
- handoff registrado
- próximo passo recomendado
- validação de fechamento executada (todos os 6 checks da skill)
- ⚠ Workflow não é considerado concluído sem relatório da skill (mesmo se vazio).

Sem isso, ainda não há base suficiente para chamar o projeto de minimamente inicializado.

---

## Critérios de entrada

Este fluxo pode começar quando houver pelo menos:

- uma intenção clara de abrir um projeto novo
- algum contexto inicial, mesmo que parcial
- autorização para estruturar a base documental

---

## Critérios de saída

Este fluxo pode ser encerrado quando:

- a base documental mínima existir
- a continuidade estiver preservada
- as principais incertezas estiverem visíveis
- houver clareza razoável sobre o próximo movimento

Encerrar este fluxo não significa que o projeto está pronto.  
Significa apenas que ele deixou de estar “solto”.

---

## Sinais de uso correto

Este fluxo está sendo bem usado quando:

- o projeto não começa por código
- a documentação mínima aparece cedo
- as dúvidas ficam explícitas
- o próximo passo fica mais claro
- a retomada passa a ser possível
- a equipe ou os agentes deixam de depender de memória informal

---

## Sinais de uso ruim

Há desvio quando:

- o projeto começa por implementação
- a estrutura mínima não é criada
- hipótese vira fato
- contexto fica espalhado
- continuidade não é registrada
- o sistema finge clareza onde ainda existe ambiguidade

---

## Relação com projetos reais

A documentação principal deste fluxo deve viver no próprio projeto.

Especialmente em:

- `docs/as-is/`
- `docs/business/`
- `docs/analysis/`
- `docs/context/`

Este arquivo de orquestração não substitui esses documentos.  
Ele apenas define como iniciar bem esse tipo de trabalho.

---

## Regra final

Novo projeto deve sair do estado de ideia solta e chegar ao estado de base minimamente estruturada.

A prioridade é simples:  
**entender, estruturar, registrar continuidade e só depois avançar.**