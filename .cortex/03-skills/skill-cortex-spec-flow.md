# Skill: Cortex Spec Flow

## Objetivo

Apoiar o workflow [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md) em 3 frentes:

1. **Detectar sinais no acionamento** para sugerir modo quando adopter não declarou.
2. **Anunciar transparência no início da sessão** (modo aplicado, default se for o caso).
3. **Sugerir transições entre modos** durante a sessão quando o contexto pede.

A skill é auxiliar — adopter sempre decide o modo. A skill nunca infere modo silenciosamente; quando não declarado, assume default `guiado` e **declara explicitamente** que aplicou o default, oferecendo transição.

Relacionado a:

- [Claude](../Claude.md)
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md)
- [skill-validar-encerramento](skill-validar-encerramento.md)
- [skill-detectar-workflow-relevante](skill-detectar-workflow-relevante.md)
- [create-feature](../08-orquestracao/tipos-de-trabalho/create-feature.md)
- [session-handoff](../08-orquestracao/tipos-de-trabalho/session-handoff.md)

---

## Quando usar

Esta skill é invocada pelo agente responsável pelo Cortex Spec Flow em 3 momentos:

1. **No início da sessão de Cortex Spec Flow** — detecta sinais no acionamento, sugere modo (se não declarado), anuncia transparência.
2. **Durante a sessão** (junto com a [skill-detectar-workflow-relevante](skill-detectar-workflow-relevante.md)) — observa contexto e sugere transições entre modos quando heurísticas dispararem.
3. **No encerramento** — apoia a [skill-validar-encerramento](skill-validar-encerramento.md) confirmando que o destino declarado em `assinatura.md` é coerente com o modo final.

Não é invocação manual do adopter — é apoio automático durante o ciclo do Cortex Spec Flow.

---

## Princípio de fronteira

**O que esta skill faz:**

- detecta palavras-chave e padrões textuais no acionamento que indicam intenção de modo;
- sugere modo quando o adopter não declarou (sempre como pergunta + default explícito);
- anuncia ao adopter o modo aplicado no início da sessão;
- monitora sinais de transição durante a sessão (material acumulado em Exploração, cansaço em Guiado, spec pronta);
- sugere transições como pergunta — nunca aplica transição automaticamente.

**O que esta skill NÃO faz:**

- aplica modo automaticamente sem declaração ao adopter;
- força transição (sempre pergunta);
- substitui a [skill-validar-encerramento](skill-validar-encerramento.md) no encerramento (Check 7 continua sendo dela);
- duplica a [skill-detectar-workflow-relevante](skill-detectar-workflow-relevante.md) (essa cobre workflows externos — Create Feature, Handoff, etc.; esta skill cobre transições internas ao Spec Flow);
- opera fora de sessões de Cortex Spec Flow.

---

## Entrada da skill

A cada invocação, a skill recebe:

1. **Mensagem de acionamento** (texto livre do adopter).
2. **Modo atual da sessão** (declarado pelo adopter ou default aplicado).
3. **Contexto da sessão** (últimos turnos, material acumulado em `context.md`, arquivos criados em `docs/specs/<nome>/`).
4. **Estado interno:**
   - turno atual;
   - histórico de transições de modo na sessão;
   - flag `--no-suggest` ativa?

---

## Saída da skill

Três tipos de saída, dependendo do momento:

### No início da sessão

```
Fluxo acionado: Cortex Spec Flow
Modo: <modo declarado pelo adopter | "guiado" (default aplicado)>

<se default aplicado>
ℹ Modo `guiado` aplicado por default. Quer trocar?
[E] Exploração — conversa livre, captura mínima
[G] Guiado — co-autoria com sugestões (atual)
[C] Conduzido — agente lidera, adopter aprova
[V] Governado — sequência rígida, todos os artefatos
[seguir] Manter Guiado e prosseguir
</se>

Documento consultado: 08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md
Objetivo do fluxo: <síntese curta do propósito>
```

Se modo foi declarado pelo adopter, a skill confirma o modo declarado e prossegue sem oferecer troca.

Se o modo foi **sugerido pela skill** (via heurística de detecção de modo) e o adopter **aceitou** a sugestão, a skill emite o bloco de declaração padrão (`Fluxo acionado / Modo / Documento consultado / Objetivo`) com o modo escolhido. O aceite da sugestão equivale a declaração explícita do adopter — não há terceiro formato de saída.

### Durante a sessão (sugestão de transição)

```
✋ Pausa para sugestão de transição:

<Justificativa curta sobre por que a transição é relevante agora>

[s] Sim, transicionar para <modo sugerido>
[n] Não, seguir no modo atual
[m] Mostrar critério aplicado
```

Se `[m]`, a skill responde:

```
Sugeri transição para <modo> porque:
- <Critério 1 com evidência>
- <Critério 2 com evidência>

Quer transicionar agora ou seguir adiante?
```

### Silêncio

Quando nenhuma transição é relevante ou flag `--no-suggest` está ativa.

---

## Heurísticas de detecção de modo no acionamento

Quando o adopter aciona sem declarar modo, a skill aplica heurísticas para sugerir modo mais adequado **antes** de aplicar o default `guiado`. A sugestão é sempre pergunta — adopter pode aceitar ou pedir `guiado`.

### Sinais que sugerem Exploração

- Palavras: `ideia`, `brainstorm`, `pensar em voz alta`, `não sei ainda`, `só explorar`, `incubação`, `pensar livre`.
- Acionamento sem nome de spec definido.
- Mensagem curta, exploratória, sem objetivo concreto.

Sugestão típica:

> Detectei sinais de ideia em estágio nebuloso ("ainda não sei", "só explorar"). Quer começar em modo **Exploração** (captura livre, sem estruturar)?

### Sinais que sugerem Guiado

- Palavras: `quero pensar`, `me ajuda a estruturar`, `vamos definir`, `vamos rascunhar`, `co-criar`.
- Tópico delineado mas com lacunas conhecidas.

Esses sinais reforçam o default — agente confirma `guiado` sem oferecer troca redundante.

### Sinais que sugerem Conduzido

- Palavras: `cansado de pensar`, `propõe você`, `vai conduzindo`, `eu aprovo no final`, `não tenho cabeça pra estruturar agora`.
- Adopter sinaliza que quer agente liderando.

Sugestão típica:

> Detectei sinais de que você prefere o agente liderar ("vai conduzindo", "eu aprovo"). Quer modo **Conduzido** (agente propõe estrutura, você aprova blocos)?

### Sinais que sugerem Governado

- Palavras: `spec formal`, `pra equipe`, `pra cliente`, `documento contratual`, `rigor máximo`, `processo completo`, `regulação`.
- Tópico exige todos os artefatos (jornada, casos, regras, critérios, tasks).

Sugestão típica:

> Detectei sinais de spec formal ("pra equipe", "rigor máximo"). Quer modo **Governado** (sequência rígida, todos os artefatos)?

### Sem sinais claros

Se nenhuma heurística dispara, aplicar default `guiado` e declarar:

> Modo `guiado` aplicado por default. Quer trocar?

---

## Heurísticas de transição durante a sessão

### Exploração → Guiado

Dispara se **qualquer uma** das condições for verdadeira:

- material acumulado em `context.md` excede ~1500 palavras sem estruturação;
- adopter mencionou 3+ vezes palavras de estruturação (`vamos organizar`, `melhor formalizar`, `acho que dá pra escrever`);
- adopter perguntou "como organizo isso?" ou equivalente.

Justificativa típica:

> Material acumulado em `context.md` chegou a ~N palavras sem estrutura. Quer transicionar para **Guiado** e organizar em jornadas/casos/regras?

### Exploração / Guiado → Conduzido

Dispara se **qualquer uma** das condições for verdadeira:

- adopter sinalizou cansaço (`tô cansado`, `não tô conseguindo pensar`, `me ajuda mais`);
- progresso estagnado por 3+ turnos (mesmo tópico, sem avanço);
- adopter pediu explicitamente "conduz você".

Justificativa típica:

> Notei que estamos no mesmo ponto há 3 turnos. Quer que eu assuma a condução (**modo Conduzido**) e proponha próximos blocos?

### Guiado / Conduzido → Governado

Dispara se **qualquer uma** das condições for verdadeira:

- adopter mencionou audiência externa (`pra equipe`, `pra cliente`, `outra área`);
- adopter pediu rigor (`mais formal`, `documento completo`, `não pular nada`);
- spec entra em estágio de fechamento e ainda há lacunas de jornada/regras/critérios.

Justificativa típica:

> Spec está virando documento pra audiência externa. Quer fechar com rigor de **Governado** (jornada + casos + regras + critérios + tasks)?

### Qualquer modo → Create Feature (saída para outro workflow)

Dispara se **qualquer uma** das condições for verdadeira:

- spec tem visão clara + casos de uso definidos + critérios de aceite;
- adopter mencionou "pronto pra implementar" ou equivalente;
- material da spec é suficiente para virar input de Create Feature.

Justificativa típica:

> Spec tem visão + casos + critérios definidos. Quer encerrar Cortex Spec Flow com destino "Create Feature" e acionar Create Feature na sequência?

### Qualquer modo → Session Handoff (pausa)

Dispara se **qualquer uma** das condições for verdadeira:

- adopter sinalizou fim de sessão (`vou pausar`, `até amanhã`, `vou dormir`);
- horário tardio + sessão longa.

Justificativa típica:

> Sinalizou pausa. Quer encerrar Cortex Spec Flow com destino "Pausa" e acionar Session Handoff pra registrar continuidade?

### Modo Exploração estagnado (telemetria leve)

Se a mesma spec está em modo Exploração por 3+ sessões sem transição, a skill sinaliza (sem forçar):

> Esta spec está em Exploração há 3 sessões. Quer transicionar para Guiado, ou encerrar com destino "Descarte"?

---

## Frequência e cooldown

### Frequência

A skill é invocada pelo agente **no início da sessão de Spec Flow** (1x) e **a cada 3-5 turnos relevantes** durante a sessão, em coordenação com a [skill-detectar-workflow-relevante](skill-detectar-workflow-relevante.md).

### Cooldown

Para cada transição sugerida e recusada:

- cooldown de **5 turnos relevantes** antes de sugerir a mesma transição de novo;
- se o contexto mudar significativamente (ex: material novo acumulou rapidamente), cooldown se reseta;
- se adopter aceitou transição, transição é aplicada e cooldown vira infinito para "voltar atrás" (a skill não sugere voltar para modo anterior automaticamente).

### Conexão com modo Exploração

Em modo Exploração, a [skill-detectar-workflow-relevante](skill-detectar-workflow-relevante.md) fica **desativada por default** (`--no-suggest` automático). Esta skill (skill-cortex-spec-flow) continua ativa, mas com sensibilidade reduzida — só sugere transição quando heurística é clara (não no primeiro indício).

Adopter pode forçar proatividade total em Exploração com `--suggest`.

---

## Telemetria leve

Cada sugestão de transição produzida pela skill registra uma linha em `06-logs-e-memoria/sugestoes-proativas.log` (mesma fonte da skill-detectar-workflow-relevante) com formato:

```
<timestamp> | spec-flow-transicao | <de-modo> → <para-modo> | <heurística> | <resposta: aceito|recusado|ignorado|silenciado>
```

A telemetria existe para revisar heurísticas após uso real e ajustar sem precisar de nova Decisão.

Telemetria fica em `06-logs-e-memoria/`, pasta privada (não vai para o OSS público).

---

## Apoio ao Check 7 da skill-validar-encerramento

No encerramento, a [skill-validar-encerramento](skill-validar-encerramento.md) roda Check 7 (Fluxo encerrado). Esta skill complementa:

- **valida coerência entre modo e destino:**
  - modo Exploração com destino "Create Feature" → alerta de inconsistência (sem visão + casos, Create Feature não tem input limpo);
  - modo Governado com destino "Pausa" sem checklist completo → alerta de inconsistência;
  - modo Conduzido sem aprovação registrada → alerta de fluxo não confirmado. A aprovação dos blocos vive em `context.md` (Etapas 2 e 3 do workflow); a `assinatura.md` apenas a referencia. O check considera o fluxo confirmado se houver registro de aprovação em **qualquer um dos dois** (`context.md` ou `assinatura.md`) — não exige que esteja na `assinatura.md`.

- **sugere texto de `assinatura.md`** quando adopter pede ajuda no formato.

A skill-validar-encerramento mantém o hard-block sobre o Check 7 (workflow não fecha sem destino). Esta skill apenas enriquece o relatório quando aplicável.

---

## Regras aplicáveis

- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)

---

## Agentes que mais usam esta skill

O Cortex Spec Flow não tem agente dedicado — pode ser conduzido por qualquer um dos 4 agentes, dependendo da natureza da spec:

- [agente-analista](../02-agentes/agente-analista.md) (Exploração, Guiado em fases iniciais — análise + descoberta);
- [agente-arquiteto](../02-agentes/agente-arquiteto.md) (Guiado, Conduzido — estruturação de jornada + casos + regras);
- [agente-planejador](../02-agentes/agente-planejador.md) (Governado — sequência rígida, tasks rastreáveis);
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md) (raro — só se a spec for sobre inicialização de projeto novo).

O agente é escolhido pelo adopter no acionamento, ou inferido pelo conteúdo da spec.

---

## Sinais de uso correto

- modo é sempre declarado explicitamente no início (declarado pelo adopter ou default anunciado);
- sugestão de modo no acionamento aparece apenas quando heurísticas têm sinal claro;
- transições durante a sessão são sugeridas, nunca aplicadas automaticamente;
- modo Exploração não vira muleta perpétua — skill sugere transição quando material acumula;
- destino em `assinatura.md` é coerente com modo final (skill alerta inconsistências);
- adopter pode silenciar transições com `--no-suggest` se virar ruído.

---

## Sinais de uso ruim

- skill aplica modo silenciosamente sem declarar;
- skill sugere transição a cada turno (frequência alta demais);
- skill insiste em transicionar Exploração para Guiado contra a vontade do adopter (modo Exploração existe por razão — material exploratório sem estrutura);
- skill duplica sugestões da skill-detectar-workflow-relevante (não deve sugerir Review/Refactor — só transições dentro do Spec Flow);
- skill força transição sem perguntar;
- telemetria não é registrada — perda da oportunidade de calibração.

---

## Risco principal a monitorar

**Heurísticas mal calibradas viram ruído.** Em particular, modo Exploração tem natureza de "deixar acontecer" — sugerir transição cedo demais descaracteriza o modo.

Mitigação:

- começar conservador (limiar alto para sugerir transição — `~1500 palavras` em Exploração não é pouco);
- telemetria leve registra cada sugestão + resposta do adopter;
- ajustar heurísticas neste arquivo sem precisar de nova Decisão;
- em caso de dúvida, **não sugerir** — silêncio é melhor que sugestão errada.

---

## Origem

Esta skill foi criada em 2026-05-20 para implementar a Decisão 10 — Cortex Spec Flow: implementação (registrada em `11-evolucao-do-sistema/02-decisoes/cortex-spec-flow-implementacao.md`), parte da rodada coordenada da frente 14.

Conceito amadurecido durante a frente 11 (2026-05-16 a 2026-05-19) e consolidado em `01-roadmap/spec-driven-development-conceito.md`. Decisão 10 aberta em 2026-05-19; implementação no dia seguinte.

---

## Regra final

O papel desta skill é simples:
**garantir que o modo do Cortex Spec Flow seja sempre explícito (declarado ou default anunciado), que transições entre modos sejam sugeridas quando o contexto pede, e que destino + modo final sejam coerentes.** Sempre pergunta, nunca aplica automaticamente.
