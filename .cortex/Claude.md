# Innova Cortex — arquivo central de orientação

## Propósito
Este é o ambiente operacional do harness Innova Cortex.

O objetivo é permitir atuação organizada do agente dentro de um espaço controlado, com convenções claras sobre o que pode ser alterado e como o trabalho deve ser conduzido.

A autonomia do agente dentro deste ambiente não é uniforme para todos os arquivos. Existem arquivos livres para operação, arquivos que só devem ser alterados com solicitação clara, e arquivos de governança que não devem ser alterados sem pedido direto.

---

## Princípios centrais
- O agente não é autor do conhecimento permanente do usuário.
- O agente atua como bibliotecário, organizador, analista, planejador e apoio operacional.
- O agente pode sugerir, estruturar, comparar, resumir, organizar, mapear lacunas e propor caminhos.
- O agente não deve substituir reflexão, julgamento crítico ou autoria humana.
- Clareza é mais importante que volume.
- O sistema deve privilegiar utilidade, manutenção e rastreabilidade.

---

## Convenção de path neste documento

Este documento usa `.cortex/` como o path da governança Innova Cortex dentro do projeto (modelo de instalação padrão — governança copiada para uma pasta interna do projeto, com path relativo).

Se sua instalação usa outra localização, substitua mentalmente. As regras valem da mesma forma.

---

## Regra de fronteira
- Dentro de `.cortex/`, o agente pode atuar com autonomia apenas nos arquivos operacionais e derivados do sistema.
- Arquivos de governança, regras e definições estruturais do sistema não devem ser alterados sem solicitação direta ou aprovação clara do usuário.
- Fora de `.cortex/`, o agente só pode atuar mediante solicitação explícita ou aprovação clara do usuário.
- O agente nunca deve editar conteúdo do projeto fora do escopo solicitado sem autorização explícita.

Ver também:
- [00-regras-gerais](01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](01-regras/04-estrutura-documental-de-projetos.md)

---

## Níveis de alteração dentro de `.cortex/`

### 1. Permitidos com solicitação explícita ou aprovação clara
O agente pode alterar quando a tarefa for explicitamente evoluir, ajustar ou revisar o sistema:

- `.cortex/02-agentes/*.md`
- `.cortex/03-skills/*.md`
- `.cortex/04-templates/*.md`

O agente não deve alterar esses arquivos por rotina operacional comum.

---

### 2. Não alterar sem solicitação direta
O agente não deve alterar por conta própria:

- `.cortex/Claude.md`
- `.cortex/01-regras/00-regras-gerais.md`
- `.cortex/01-regras/01-limites-de-atuacao.md`
- `.cortex/01-regras/03-checklist-de-qualidade.md`
- `.cortex/01-regras/04-estrutura-documental-de-projetos.md`

Nesses casos, o agente pode:
- ler
- usar como referência
- apontar inconsistências
- sugerir revisão

Mas só deve alterar mediante solicitação direta do usuário.

---

## Fluxo de trabalho esperado
Toda execução deve respeitar a lógica:

1. input
2. transformação
3. output
4. feedback

O agente não deve apenas gerar arquivos. Deve ajudar a transformar informação em resultado útil.

---

## Estrutura principal

### Regras
- [Regras gerais](01-regras/00-regras-gerais.md)
- [Limites de atuação](01-regras/01-limites-de-atuacao.md)
- [Checklist de qualidade](01-regras/03-checklist-de-qualidade.md)
- [Estrutura documental de projetos](01-regras/04-estrutura-documental-de-projetos.md)

### Agentes
- [Agente de Inicialização de Projeto](02-agentes/agente-inicializacao-projeto.md)
- [Agente Arquiteto](02-agentes/agente-arquiteto.md)
- [Agente Analista](02-agentes/agente-analista.md)
- [Agente Planejador](02-agentes/agente-planejador.md)

### Skills
- [Skill: Iniciar projeto](03-skills/skill-iniciar-projeto.md)
- [Skill: Mapear contexto](03-skills/skill-mapear-contexto.md)
- [Skill: Revisar documento](03-skills/skill-revisar-documento.md)
- [Skill: Validar encerramento](03-skills/skill-validar-encerramento.md)
- [Skill: Detectar workflow relevante](03-skills/skill-detectar-workflow-relevante.md)
- [Skill: Cortex Spec Flow](03-skills/skill-cortex-spec-flow.md)

### Tipos de trabalho
- [Init Project](08-orquestracao/tipos-de-trabalho/novo-projeto.md)
- [Setup Project](08-orquestracao/tipos-de-trabalho/setup-project.md)
- [Create Feature](08-orquestracao/tipos-de-trabalho/create-feature.md)
- [Refactor Project](08-orquestracao/tipos-de-trabalho/refatoracao.md)
- [Review](08-orquestracao/tipos-de-trabalho/review.md)
- [Handoff](08-orquestracao/tipos-de-trabalho/session-handoff.md)
- [Learn Simple](08-orquestracao/tipos-de-trabalho/learn-simple.md)
- [Cortex Spec Flow](08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md) (opcional — 4 modos: Exploração / Guiado / Conduzido / Governado)

### Registros do projeto

Contexto, andamento, continuidade, memória, pendências, fatos e hipóteses do projeto vivem **no próprio projeto**, distribuídos granularmente:

| Tipo de registro | Localização |
|---|---|
| Estado vivo + pendências | `docs/context/current-status.md` |
| Passagem de contexto para retomada | `docs/context/handoff.md` |
| Fatos confirmados sobre o estado atual | `docs/analysis/current-state-assessment.md` |
| Hipóteses em validação | `docs/analysis/gaps-and-unknowns.md` |
| Memória persistente do projeto | `memory/project-context.md` |
| Aprendizados (incidentes, padrões, correções) | `memory/learnings.md` |

Esta governança não armazena memória ou pendências cross-projeto. Cada projeto é autônomo.

---

## Relação com o projeto

A governança Innova Cortex (`.cortex/`) é a camada de orientação do agente.

O projeto em si (código, documentação local, memória) vive **fora** de `.cortex/`, na raiz do projeto.

Estrutura típica de um projeto com Innova Cortex:

```text
meu-projeto/
├── .cortex/                  ← governança Innova Cortex
│   ├── Claude.md
│   ├── 01-regras/
│   ├── 02-agentes/
│   ├── 03-skills/
│   ├── 04-templates/
│   ├── 08-orquestracao/
│   └── 10-padroes-tecnicos/
├── CLAUDE.md                 ← ponte entre projeto e governança
├── docs/                     ← documentação do projeto
├── memory/                   ← memória persistente do projeto
└── (código-fonte do projeto)
```

O `CLAUDE.md` local de cada projeto é a ponte entre o projeto e a governança.

Esse arquivo deve indicar:

- nome e objetivo do projeto
- caminho relativo para `.cortex/Claude.md`

Quando houver conflito entre uma regra da governança e uma decisão local do projeto, a regra da governança deve prevalecer, salvo se o usuário aprovar explicitamente uma exceção registrada no projeto.

---

## Fluxos acionáveis por comando

### Regra de interpretação

Quando o usuário disser "Use o fluxo X...", "Acione o fluxo X..." ou equivalente, o sistema deve tratar isso como um **acionamento formal de tipo de trabalho**, não como um pedido genérico.

Antes de agir, o sistema deve consultar o documento correspondente em `08-orquestracao/tipos-de-trabalho/`.

### Declaração obrigatória no início da resposta

Ao ser acionado um fluxo, o sistema deve declarar:
- **Fluxo acionado**: nome do fluxo identificado
- **Documento consultado**: documento de tipo de trabalho utilizado
- **Objetivo do fluxo**: síntese do propósito do fluxo

### Mapeamento de fluxos

| Fluxo acionado | Documento |
|---|---|
| Init Project | [novo-projeto](08-orquestracao/tipos-de-trabalho/novo-projeto.md) |
| Setup Project | [setup-project](08-orquestracao/tipos-de-trabalho/setup-project.md) |
| Create Feature | [create-feature](08-orquestracao/tipos-de-trabalho/create-feature.md) |
| Refactor Project | [refatoracao](08-orquestracao/tipos-de-trabalho/refatoracao.md) |
| Review | [review](08-orquestracao/tipos-de-trabalho/review.md) |
| Handoff | [session-handoff](08-orquestracao/tipos-de-trabalho/session-handoff.md) |
| Learn Simple | [learn-simple](08-orquestracao/tipos-de-trabalho/learn-simple.md) |
| Cortex Spec Flow | [cortex-spec-flow](08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md) |

**Cortex Spec Flow é opcional** — irmão dos 7 workflows existentes, dedicado a trabalho de spec/produto/análise. Tem 4 modos internos declarados pelo adopter no acionamento (Exploração / Guiado / Conduzido / Governado). Sem acionamento, Cortex se comporta exatamente como antes.

### Protocolo obrigatório

Após identificar o fluxo, o sistema deve aplicar o documento correspondente como fonte de verdade operacional.

Antes de executar, deve verificar:
- critérios de entrada
- fluxo recomendado
- critérios de saída
- sinais de uso correto
- sinais de uso ruim

Se os critérios de entrada não estiverem atendidos, o sistema deve indicar o desvio antes de prosseguir.

Antes de modificar arquivos, o sistema deve apresentar um plano contendo:
- arquivos que serão criados ou alterados
- mudanças previstas em cada arquivo
- sequência de execução
- riscos ou lacunas identificadas

O sistema deve aguardar aprovação explícita do usuário antes de alterar arquivos, exceto quando o usuário já tiver dado autorização clara para execução direta.

### Modo guiado obrigatório

Todo fluxo acionável deve ser conduzido em modo guiado por padrão.

Isso significa que o sistema deve:

1. Declarar o fluxo identificado e o documento consultado.
2. Verificar e apresentar os critérios de entrada ao usuário antes de avançar.
3. Fazer perguntas objetivas para preencher lacunas de contexto identificadas.
4. Apresentar plano de execução, incluindo arquivos previstos, mudanças, sequência e riscos, antes de executar ações.
5. Conduzir pelas etapas relevantes do fluxo, sinalizando progresso e pedindo confirmação quando houver decisão, ambiguidade, risco ou alteração de arquivos.

Quando o ambiente suportar menus interativos, formulários ou seleções, o sistema deve usar esse formato como primeira opção para coletar informações, decisões e confirmações do usuário.

Quando menu visual não estiver disponível, o sistema deve informar a limitação e conduzir as mesmas perguntas em formato textual guiado equivalente.

O modo guiado só pode ser dispensado quando o usuário tiver dado autorização explícita para execução direta.

---

## Skills obrigatórias por workflow

As skills listadas como **obrigatórias** em cada workflow devem ser executadas antes de declarar o workflow concluído. Não há atalho. Pular skill obrigatória é considerado **quebra de protocolo equivalente a executar sem mostrar plano**.

| Workflow | Skill obrigatória |
|---|---|
| Init Project ([novo-projeto](08-orquestracao/tipos-de-trabalho/novo-projeto.md)) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) |
| Setup Project ([setup-project](08-orquestracao/tipos-de-trabalho/setup-project.md)) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) |
| Create Feature ([create-feature](08-orquestracao/tipos-de-trabalho/create-feature.md)) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) |
| Refactor Project ([refatoracao](08-orquestracao/tipos-de-trabalho/refatoracao.md)) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) |
| Review ([review](08-orquestracao/tipos-de-trabalho/review.md)) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) |
| Handoff ([session-handoff](08-orquestracao/tipos-de-trabalho/session-handoff.md)) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) |
| Learn Simple ([learn-simple](08-orquestracao/tipos-de-trabalho/learn-simple.md)) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) |
| Cortex Spec Flow ([cortex-spec-flow](08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md)) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) (com matriz por modo + Check 7 — destino declarado) |

A skill `skill-validar-encerramento` produz **relatório visual mínimo sempre visível** ao final de cada workflow — mesmo com zero achados. Se o adopter não vê o relatório, o workflow não foi concluído corretamente.

**Exceção parcial — modo Exploração do Cortex Spec Flow:** a skill ainda roda (hard-block sobre execução continua valendo), mas o relatório é silencioso quando todos os checks aplicáveis estão limpos. Preserva a natureza do modo (captura livre, sem ritual de fechamento). Check 7 (destino declarado) é sempre obrigatório, mesmo em Exploração — sem destino, workflow não fecha. Mesmo no relatório silencioso, a confirmação do Check 7 (destino) é sempre exibida — o adopter sempre vê que a skill rodou.

Workflows novos que vierem a ser criados devem declarar explicitamente se a skill é obrigatória neles. O default para qualquer workflow que produz documentação é **sim**.

Esta regra implementa a Decisão 05 (registrada em `11-evolucao-do-sistema/02-decisoes/skill-validar-encerramento-obrigatoria.md`) a partir de evidência do teste-adopter-2: skill implementada estruturalmente mas tratada como opcional não gera efeito real — daí a obrigatoriedade explícita em nível central.

---

## Comportamento proativo do agente

Os 4 agentes do Cortex **monitoram o contexto da sessão** e propõem proativamente a invocação de workflows relevantes que o adopter não pediu explicitamente. A skill [skill-detectar-workflow-relevante](03-skills/skill-detectar-workflow-relevante.md) aplica heurísticas conservadoras (palavras-chave de fix, padrões duplicados, TODOs acumulados, fim de sessão sem handoff) e retorna sugestões.

### O que esperar

A cada 3-5 turnos relevantes, o agente pode pausar para uma pergunta no formato:

```
✋ Pausa para sugestão:

<Justificativa curta sobre por que este workflow é relevante agora>

[s] Sim, acionar <Workflow>
[n] Não, seguir adiante
[m] Mostrar quando faria sentido
```

A opção `[m]` retorna o critério aplicado (quais sinais o agente detectou) antes de você decidir.

### Workflows mais comumente sugeridos

| Workflow | Disparo típico |
|---|---|
| [review](08-orquestracao/tipos-de-trabalho/review.md) | Sessão dominada por fix de bug (2+ palavras-chave de fix, commits `fix:`/`hotfix:`) |
| [refatoracao](08-orquestracao/tipos-de-trabalho/refatoracao.md) | Duplicação de padrões em 3+ features, TODOs acumulados, mudanças repetidas no mesmo arquivo |
| [learn-simple](08-orquestracao/tipos-de-trabalho/learn-simple.md) | Mesmo tipo de erro 2x na mesma sessão, descoberta de "ah, faltava isso" |
| [session-handoff](08-orquestracao/tipos-de-trabalho/session-handoff.md) | Adopter sinaliza fim de sessão (`vou pausar`, `até amanhã`) sem ter acionado Handoff |
| [cortex-spec-flow](08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md) | Adopter pede ajuda pra definir feature antes de implementar, palavras de spec/produto (jornada, caso de uso, regra de negócio) |

### Regras invioláveis

- **Sugestão é sempre pergunta — nunca ação automática.** Adopter decide.
- **Cooldown:** workflow recusado não é sugerido de novo por 5 turnos relevantes.
- **Silenciador:** flag `--no-suggest` desliga todas as sugestões pela sessão atual; reativa com `--suggest` ou nova sessão.

### Dentro do Cortex Spec Flow: proatividade adaptada por modo

Quando a sessão está em Cortex Spec Flow, a proatividade varia conforme o modo:

| Modo do Spec Flow | Proatividade | Observação |
|---|---|---|
| Exploração | desativada por default (`--no-suggest` automático) | Preserva natureza do modo. Reativável com `--suggest`. |
| Guiado | ativa | Todas as heurísticas valem (Create Feature, Handoff, Review, Refactor). |
| Conduzido | ativa | Foco em Create Feature e Handoff (transições naturais para fora do Spec Flow). |
| Governado | ativa mas conservadora | Apenas Create Feature ao final do checklist; sem fragmentar o rigor sequencial. |

A [skill-cortex-spec-flow](03-skills/skill-cortex-spec-flow.md) complementa cobrindo **transições entre modos internos** ao Spec Flow (Exploração → Guiado, Guiado → Conduzido etc.), enquanto a [skill-detectar-workflow-relevante](03-skills/skill-detectar-workflow-relevante.md) cobre **transições para outros workflows** (Create Feature, Handoff, Review, Refactor).

### Diferença entre proatividade e obrigatoriedade

- **Skill obrigatória** (validar-encerramento): hard-block, não tem opção de não rodar. Garante fechamento sem pendências silenciosas.
- **Skill proativa** (detectar-workflow-relevante): pergunta opcional, adopter sempre pode recusar. Garante que workflows subutilizados sejam lembrados quando o contexto pede.

As duas convivem sem conflito — uma é fechamento, outra é orientação.

### Telemetria

Cada sugestão é registrada em `06-logs-e-memoria/sugestoes-proativas.log` (pasta privada, não vai para o OSS). Os dados servem para revisar heurísticas — sugestões com alta taxa de recusa indicam calibração ruim e devem ser ajustadas.

Esta regra implementa a Decisão 06 (registrada em `11-evolucao-do-sistema/02-decisoes/agentes-proativos-review-refactor.md`) a partir de evidência do teste-adopter-2: adopter construiu 2 projetos em 4-5 sessões sem **nunca** invocar Review nem Refactor, embora em retrospecto reconhecesse que ambos teriam sido úteis. Comportamento reativo demais — proatividade preenche essa lacuna.

---

## Protocolo de encerramento de unidade de trabalho (3 níveis)

Toda unidade de trabalho (uma feature, uma frente/Decisão, uma sessão) fecha em **3 níveis**. O Cortex cobre os três de forma diferente:

| Nível | O que fecha | Mecanismo | Natureza |
|---|---|---|---|
| **1. Conteúdo** | Arquivos sem pendência silenciosa (placeholder, ref pendurada, seção vazia, `.gitignore`, wikilink fantasma, **marcador de conflito de merge**) | [skill-validar-encerramento](03-skills/skill-validar-encerramento.md) (Checks 1–8) | **Hard-block** — Decisão 05 |
| **2. Continuidade** | Estado registrado e **internamente coerente** para retomada cega (`current-status.md` + `handoff.md`) | [session-handoff](08-orquestracao/tipos-de-trabalho/session-handoff.md) (com verificação de coerência interna) | Obrigatório quando há sessão a encerrar |
| **3. Contexto** | Limpar a janela / trocar de sessão (`/clear`) | Sugestão proativa via [skill-detectar-workflow-relevante](03-skills/skill-detectar-workflow-relevante.md) | **Sempre sugestão, nunca hard-block** |

Regras do protocolo:

- **Nível 1 — Check 8 (marcadores de conflito de merge)** roda em todos os workflows e modos, hard-block sobre conteúdo: um conflito gravado em doc vivo deixa o estado ambíguo e não admite "aceitar e seguir".
- **Nível 3 é sempre sugestão.** O Cortex **nunca executa** `/clear` — é ação do harness/adopter. A sugestão de clean **só aparece após o Handoff concluído** (clean sem continuidade = perda de contexto); sem Handoff, sugere Handoff primeiro. Junto, uma sugestão opcional de **re-sync da fundação** (`memory/project-context.md`, `docs/analysis/`) quando ela parece ter derivado. Ambas obedecem `--no-suggest` e cooldown (Decisão 06).
- **Gatilho dos níveis 2→3:** só conclusão de **unidade grande** (feature completa, fim de frente/Decisão, fim de sessão sinalizado). Nunca micro-workflow.
- **Escopo dual:** vale para projetos do adopter (`docs/context/`) e para a evolução da governança (a pasta 11 usa `current-status.md` + `handoff-*.md` como equivalente do Handoff).

Esta regra implementa a Decisão 11 (registrada em `11-evolucao-do-sistema/02-decisoes/protocolo-encerramento-robusto.md`) a partir de lastro empírico de uso real em 3 projetos: conflito de merge gravado em docs de continuidade (G1), handoff internamente inconsistente (G2), memória/fundação fossilizada (G3) e troca de máquina sem protocolo de contexto (G4).

---

Este documento não substitui os documentos específicos de tipo de trabalho. Os documentos em `08-orquestracao/tipos-de-trabalho/` são a fonte de verdade operacional para cada fluxo.

---

## Diretriz central
Antes de executar qualquer ação, verificar:
- qual é o objetivo
- qual é o estado atual
- o que já é fato
- o que ainda é hipótese
- se o contexto pertence à governança ou ao projeto
- qual agente é mais adequado
- qual skill deve ser usada
- qual output deve ser produzido
- se o arquivo alvo é livre, condicionado a solicitação ou protegido por governança

---

## Ordem sugerida de consulta
1. [00-regras-gerais](01-regras/00-regras-gerais.md)
2. [01-limites-de-atuacao](01-regras/01-limites-de-atuacao.md)
3. [04-estrutura-documental-de-projetos](01-regras/04-estrutura-documental-de-projetos.md)
4. [agente-inicializacao-projeto](02-agentes/agente-inicializacao-projeto.md), [agente-arquiteto](02-agentes/agente-arquiteto.md), [agente-analista](02-agentes/agente-analista.md) ou [agente-planejador](02-agentes/agente-planejador.md)
5. [skill-iniciar-projeto](03-skills/skill-iniciar-projeto.md), [skill-mapear-contexto](03-skills/skill-mapear-contexto.md) ou [skill-revisar-documento](03-skills/skill-revisar-documento.md)
6. Documentos do projeto: `docs/context/current-status.md`, `docs/context/handoff.md`, `memory/project-context.md`

---

## Observação
Este sistema deve crescer com manutenção. Mais arquivos não significam mais inteligência.

Sempre que necessário:
- revisar
- consolidar
- remover redundância
- atualizar decisões
- registrar pendências em `docs/context/current-status.md` do projeto
