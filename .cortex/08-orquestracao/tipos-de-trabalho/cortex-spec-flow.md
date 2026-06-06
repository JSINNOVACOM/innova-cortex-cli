# Tipo de trabalho: Cortex Spec Flow

## Objetivo

Conduzir trabalho de spec/produto/análise — o "antes" e "paralelo" ao código — dentro do harness: brainstorm, jornada do usuário, definição de tasks, design discovery, regras de negócio, casos de uso, spec consumível por Create Feature.

Cortex Spec Flow é **opcional** — não substitui workflows existentes, não vira default obrigatório, não interfere em projetos que não acionarem. Sem acionamento, o Cortex se comporta exatamente como antes desta decisão.

Relacionado a:

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- [skill-cortex-spec-flow](../../03-skills/skill-cortex-spec-flow.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)
- [skill-detectar-workflow-relevante](../../03-skills/skill-detectar-workflow-relevante.md)
- [create-feature](create-feature.md)
- [session-handoff](session-handoff.md)

---

## Princípio central

Cortex Spec Flow é um **fluxo adicional opcional**, não uma camada por cima do harness. Adopter aciona quando quiser, escolhe modo, e o restante do Cortex (regras, padrões, agentes, outros workflows) continua funcionando exatamente como hoje.

O agente é bibliotecário e organizador da spec produzida — não autor do conhecimento. A autoria da spec (visão de produto, regras de negócio, decisões) é do adopter. O agente conduz processualmente, estrutura material, sinaliza ambiguidades.

---

## Os 4 modos

O modo é declarado pelo adopter no acionamento, varia o nível de estruturação. Default `guiado` quando não declarado.

| Modo | Lidera | Cenário típico | Etapas obrigatórias |
|---|---|---|---|
| **Exploração** | Adopter (agente observa) | Ideia nebulosa, brainstorm livre | Apenas captura |
| **Guiado** (default) | Adopter (com sugestões do agente) | Co-autoria, adopter conduz | Etapas opcionais, pulos registrados |
| **Conduzido** | Agente (com aprovação do adopter) | Adopter cansado, confia no agente | Sequência escolhida pelo agente |
| **Governado** | Processo formal | Adopter leigo ou rigor máximo | Todas obrigatórias, sequência rígida |

Eixo único do menos formal ao mais formal. Adopter escolhe — sem auto-sizing automático.

### Granularidade

**Por acionamento.** Cada sessão de Cortex Spec Flow pode estar em modo diferente — modo NÃO herda do projeto. Trabalho de spec varia muito dentro do mesmo projeto: um brainstorm é Exploração; uma spec pra equipe é Governado; uma jornada estruturada é Guiado.

### Transição entre modos

Adopter pode trocar de modo a qualquer momento dentro da mesma sessão. Material acumulado é preservado. Cada transição é registrada em `docs/specs/<nome>/context.md` com data e motivo.

A skill auxiliar [skill-cortex-spec-flow](../../03-skills/skill-cortex-spec-flow.md) sugere transições quando o contexto pede (ex: Exploração acumulou material e merece estruturação → Guiado; Guiado avançou e adopter sinaliza cansaço → Conduzido; spec encerrada → Create Feature).

---

## Modelo de acionamento

O adopter aciona com texto livre. Formas válidas:

- *"Acione Cortex Spec Flow em modo Guiado"*
- *"Use Cortex Spec Flow — modo Exploração"*
- *"Cortex Spec Flow, Governado"*
- *"Cortex Spec Flow"* (sem modo → assume `guiado`)

Ao identificar o acionamento, o agente declara no início da resposta:

```
Fluxo acionado: Cortex Spec Flow
Modo: <modo escolhido / "guiado" por default>
Documento consultado: 08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md
Objetivo do fluxo: conduzir trabalho de spec/produto/análise no modo declarado
```

Se modo não foi declarado, o agente assume `guiado`, **declara explicitamente o default aplicado** e oferece transição imediata caso o adopter queira outro.

---

## Estrutura de pastas no projeto

Spec produzida pelo Cortex Spec Flow vive em:

```text
docs/specs/<nome-da-spec>/
├── visao.md           ← visão do que está sendo specificado
├── usuarios.md        ← usuários e personas (quando aplicável)
├── jornadas.md        ← jornadas do usuário (IDs: JORN-01, JORN-02, ...)
├── casos-de-uso.md    ← casos de uso (IDs: CASO-01, CASO-02, ...)
├── regras-negocio.md  ← regras de negócio (IDs: REGRA-01, REGRA-02, ...)
├── criterios.md       ← critérios de aceite (IDs: CRIT-01, CRIT-02, ...)
├── tasks.md           ← tasks rastreáveis (IDs: TASK-01, TASK-02, ...)
├── decisoes.md        ← decisões registradas (IDs: DEC-01, DEC-02, ...)
├── context.md         ← contexto vivo da sessão + transições de modo
└── assinatura.md      ← destino declarado no encerramento (obrigatório)
```

Estrutura é **fixa, sem subtipo por modo**. Modo afeta processo (quais arquivos são criados, em que profundidade), não destino. Cada modo pode ignorar arquivos que não façam sentido (ex: Exploração tipicamente produz só `context.md` + `assinatura.md`).

### IDs rastreáveis

Começam no modo Guiado. Modo Exploração captura livre, sem ID obrigatório. Formatos:

- `JORN-01`, `JORN-02`, ... — jornadas
- `CASO-01`, `CASO-02`, ... — casos de uso
- `REGRA-01`, `REGRA-02`, ... — regras de negócio
- `CRIT-01`, `CRIT-02`, ... — critérios de aceite
- `TASK-01`, `TASK-02`, ... — tasks
- `DEC-01`, `DEC-02`, ... — decisões

IDs são únicos por spec (não cross-spec). Numeração crescente, sem reuso após descarte.

---

## Etapas por modo

### Modo Exploração

Etapas mínimas. Agente observa, captura, evita estruturar prematuramente.

| Etapa | Obrigatória? | Output |
|---|---|---|
| 1. Captura livre | sim | `context.md` com material bruto |
| 2. Resumo periódico | não (a cada ~15 min ou pedido do adopter) | bloco resumo em `context.md` |
| 3. Captura final | sim | bloco final em `context.md` + transição para próximo modo OU `assinatura.md` |

Princípio: **não estruturar até o adopter pedir.** Se material acumula e claramente merece estrutura, agente sugere transição para Guiado — não impõe.

### Modo Guiado (default)

Sequência flexível, agente sugere frameworks leves, adopter conduz.

| Etapa | Obrigatória? | Output |
|---|---|---|
| 1. Escopo | sim | `visao.md` (objetivo + delimitação) |
| 2. Visão | sim | `visao.md` (descrição do que é) |
| 3. Mapear áreas | não | seções iniciais em `usuarios.md` / `jornadas.md` |
| 4. Aprofundar (perguntas-âncora) | não | conteúdo em `casos-de-uso.md` / `regras-negocio.md` |
| 5. Ambiguidades | não | `gaps-and-unknowns.md` ou seção em `context.md` |
| 6. Resumo + destino | sim | `assinatura.md` |

Etapas pulam-se livremente. Cada pulo é registrado em `context.md` com motivo curto. A skill de encerramento (Check 7) verifica apenas que `assinatura.md` tem destino declarado.

### Modo Conduzido

Sem etapas fixas. Agente lidera, propõe estrutura inteira, adopter aprova ou ajusta cada bloco.

| Etapa mínima | Obrigatória? | Output |
|---|---|---|
| 1. Visão (proposta pelo agente) | sim | `visao.md` |
| 2. Estrutura proposta (resumo do que o agente vai construir) | sim | nota em `context.md` + aprovação do adopter |
| 3. Execução por blocos com aprovação | sim | arquivos da spec, conforme a estrutura aprovada |
| 4. Encerramento (resumo + destino) | sim | `assinatura.md` |

Sequência interna é escolhida pelo agente. Aprovação obrigatória por bloco — agente não consolida 4 blocos sem retorno do adopter.

### Modo Governado

Sequência rígida, todos os artefatos. Para adopter leigo ou rigor máximo (spec para outra equipe, contrato com cliente, regulação).

| Etapa | Obrigatória? | Output |
|---|---|---|
| 1. Visão | sim | `visao.md` |
| 2. Usuários | sim | `usuarios.md` |
| 3. Jornada | sim | `jornadas.md` (com IDs JORN-XX) |
| 4. Casos de uso | sim | `casos-de-uso.md` (com IDs CASO-XX) |
| 5. Regras de negócio | sim | `regras-negocio.md` (com IDs REGRA-XX) |
| 6. Critérios | sim | `criterios.md` (com IDs CRIT-XX) |
| 7. Tasks | sim | `tasks.md` (com IDs TASK-XX) |
| 8. Encerramento | sim | `assinatura.md` + checklist completo |

Sequência não pode ser pulada. Cada etapa é fechada antes da próxima. Perguntas-âncora curtas em cada etapa (não roteiro extenso — agente conduz, não interroga).

`decisoes.md` (registro de IDs `DEC-XX`) **não é uma 9ª etapa obrigatória** — é criado apenas se decisões emergirem durante o fluxo. O Check 7 da skill-validar-encerramento o trata como condicional (ausência válida se nenhuma decisão foi registrada).

---

## Skills neste fluxo

### Skill auxiliar (em todos os modos)

[skill-cortex-spec-flow](../../03-skills/skill-cortex-spec-flow.md) — detecta sinais no acionamento, sugere modo quando não declarado, anuncia transparência no início, sugere transição entre modos durante a sessão.

### Skill obrigatória (encerramento)

[skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) com matriz de checks adaptada por modo do Spec Flow:

| Check | Exploração | Guiado | Conduzido | Governado |
|---|---|---|---|---|
| 1. Placeholders | silencioso | sim | sim | sim |
| 2. Refs penduradas | não | sim | sim | sim |
| 3. EOF | silencioso | sim | sim | sim |
| 4. Seções vazias | não | sim | sim | sim |
| 5. `.gitignore` mínimo | não | não | não | não |
| 6. Wikilinks fantasma | não | sim | sim | sim |
| **7. Fluxo encerrado** | sim (destino simples) | sim | sim | sim (checklist completo) |

- Check 5 pulado em todos os modos: Spec Flow não cria estrutura de projeto novo.
- Modo Exploração "silencioso": relatório aparece só se houver problema real.
- **Check 7 — Fluxo encerrado:** valida que `assinatura.md` tem destino declarado (ver abaixo).

### Skill proativa (durante a sessão)

[skill-detectar-workflow-relevante](../../03-skills/skill-detectar-workflow-relevante.md) com heurísticas adaptadas por modo:

| Modo | Proatividade | Sugestões típicas |
|---|---|---|
| Exploração | desativada por default (`--no-suggest` automático) | — |
| Guiado | ativa | "Mudar pra Conduzido?" / "Virar Create Feature?" / "Rodar Handoff?" |
| Conduzido | ativa | "Virar Create Feature?" / "Pausar com Handoff?" |
| Governado | ativa mas conservadora | "Spec encerrada — virar Create Feature?" (sem sugerir mudança de modo no meio do fluxo) |

Em modo Exploração, adopter pode reativar com `--suggest` se quiser.

---

## Destinos declarados no encerramento

O encerramento de qualquer modo exige `assinatura.md` com destino explícito. Opções válidas:

1. **Create Feature** — spec pronta para virar feature. Registrar link para arquivo principal da spec (`docs/specs/<nome>/visao.md` ou equivalente).
2. **Pausa** — spec parcial, retomar depois. Registrar motivo e gatilho de retomada.
3. **Descarte** — spec não vai virar feature. Registrar motivo (validação negativa, mudança de prioridade, etc.).
4. **Discovery adicional** — spec precisa de mais investigação. Registrar próxima ação concreta (entrevista, prototipação, validação com stakeholder).

`assinatura.md` mínimo:

```markdown
# Assinatura — <nome da spec>

**Data:** YYYY-MM-DD
**Modo final:** <modo em que a sessão encerrou>
**Destino:** <Create Feature | Pausa | Descarte | Discovery adicional>
**Detalhes do destino:** <link / motivo / gatilho / próxima ação>
**Arquivos produzidos:** <lista de arquivos em docs/specs/<nome>/>
```

Em modo Exploração, `assinatura.md` pode ser de uma linha:

```markdown
Destino: Pausa — ideia em incubação, retomar quando aparecer sinal de demanda.
```

O Check 7 da skill de encerramento valida a presença do destino. Sem destino declarado, workflow não pode fechar.

---

## Fluxo recomendado por modo

### Exploração

1. Agente declara modo Exploração + cria `docs/specs/<nome>/context.md` (vazio).
2. Adopter conversa livremente. Agente registra material em `context.md` sem estruturar.
3. (Opcional) Agente faz resumo periódico ou quando adopter pedir.
4. Encerramento: adopter sinaliza fim → agente cria `assinatura.md` com destino → skill valida.

### Guiado (default)

1. Agente declara modo Guiado + cria estrutura inicial em `docs/specs/<nome>/`.
2. Etapa 1 (Escopo) → Etapa 2 (Visão) → adopter decide aprofundar ou encerrar.
3. (Opcional) Etapas 3-5 conforme demanda. Cada pulo registrado em `context.md`.
4. Etapa 6 (Resumo + destino) → `assinatura.md` → skill valida.

### Conduzido

1. Agente declara modo Conduzido + propõe visão inicial → adopter aprova.
2. Agente propõe estrutura completa que pretende construir → adopter aprova.
3. Execução por blocos: cada bloco proposto e aprovado antes do próximo.
4. Encerramento: agente consolida `assinatura.md` → adopter aprova → skill valida.

### Governado

1. Agente declara modo Governado + apresenta as 8 etapas obrigatórias com estimativa breve.
2. Adopter confirma disponibilidade para o rigor — se não, agente sugere transição para Guiado.
3. Execução etapa por etapa, na ordem. Cada etapa fechada antes da próxima.
4. Etapa 8 (Encerramento) → `assinatura.md` com checklist completo → skill valida (todos os 6 checks aplicáveis).

---

## Saída mínima aceitável

Este fluxo só é considerado concluído quando existir:

- `docs/specs/<nome>/` criado;
- pelo menos `context.md` e `assinatura.md` presentes;
- `assinatura.md` com destino declarado (1 de 4 opções);
- relatório da skill-validar-encerramento exibido (mesmo se zero achados);
- transições de modo (se houve) registradas em `context.md`.

⚠ Workflow não é considerado concluído sem relatório da skill (mesmo se vazio). Em modo Exploração, o "relatório mínimo" é a confirmação do Check 7 (destino declarado) — os demais checks ficam silenciados se limpos.

---

## Critérios de entrada

Cortex Spec Flow pode começar quando:

- adopter aciona explicitamente o fluxo;
- há intenção de produzir spec/análise (não código direto);
- projeto tem `docs/` ou aceita criação da pasta.

Não exige projeto inicializado com Innova Cortex — pode rodar em qualquer projeto desde que `docs/specs/<nome>/` possa ser criado.

---

## Critérios de saída

Este fluxo encerra quando:

- `assinatura.md` está preenchido com destino válido;
- skill-validar-encerramento rodou e mostrou relatório;
- adopter confirmou encerramento.

Encerrar o fluxo **não** significa que a spec está completa — significa que o estado atual está registrado com destino claro. Spec parcial encerrada com destino "Pausa" é encerramento válido.

---

## Sinais de uso correto

- modo declarado explicitamente no início (ou default `guiado` anunciado);
- material acumulado tem destino claro ao final (não vira spec órfã);
- transições de modo preservam material e ficam registradas;
- skill de encerramento roda em todos os modos (com matriz adaptada);
- adopter percebe o modo como ajuste de processo, não como ritual;
- spec gerada em modo Governado é consumível por Create Feature sem retrabalho;
- modo Exploração não vira muleta perpétua — agente sugere transição quando material acumula.

---

## Sinais de uso ruim

- agente assume modo sem declarar;
- material de spec criado fora de `docs/specs/<nome>/`;
- transição de modo sem registro em `context.md`;
- spec encerrada sem destino em `assinatura.md`;
- agente força estrutura em modo Exploração (descaracteriza o modo);
- agente improvisa em modo Governado (descaracteriza o modo);
- modo Exploração usado sistematicamente sem evoluir — sinal de fuga de estrutura;
- adopter aciona Create Feature direto e o agente sugere Cortex Spec Flow sem necessidade (workflow é opcional, não default para nada).

---

## Relação com Create Feature

Cortex Spec Flow não substitui [create-feature](create-feature.md) e não é pré-requisito dele.

- Adopter pode acionar Create Feature direto quando a feature já está clara — Cortex Spec Flow não é exigido.
- Spec produzida pelo Cortex Spec Flow (modos Guiado/Conduzido/Governado) vira input limpo pra Create Feature — adopter copia o conteúdo relevante e aciona Create Feature normalmente.
- Não há integração automática em v1 — handoff é manual. A skill proativa pode sugerir "spec pronta — virar Create Feature?" mas a transição é decisão do adopter.

Spec do Cortex Spec Flow + Create Feature = sequência opcional. Cada um funciona sozinho.

---

## Regra final

Cortex Spec Flow existe para dar espaço dedicado ao trabalho de spec/produto/análise dentro do harness, sem transformar o resto do Cortex em SDD obrigatório. O modo é declarado pelo adopter, a transição é livre, o destino é sempre explícito.

A prioridade é simples:
**declarar modo, conduzir conforme o modo, registrar transições, encerrar com destino declarado.**
