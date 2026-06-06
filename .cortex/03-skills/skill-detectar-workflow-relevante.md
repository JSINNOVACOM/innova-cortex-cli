# Skill: Detectar workflow relevante

## Objetivo
Monitorar o contexto da sessão atual e propor proativamente a invocação de workflows do Cortex que o adopter não pediu explicitamente, mas que o contexto sugere serem úteis.

A sugestão é **sempre pergunta — nunca ação automática**. O adopter decide aceitar, recusar ou pedir mais contexto. A skill mantém estado de cooldown para não repetir sugestões recusadas.

Relacionado a:
- [Claude](../Claude.md)
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [agente-analista](../02-agentes/agente-analista.md)
- [agente-planejador](../02-agentes/agente-planejador.md)
- [novo-projeto](../08-orquestracao/tipos-de-trabalho/novo-projeto.md)
- [setup-project](../08-orquestracao/tipos-de-trabalho/setup-project.md)
- [create-feature](../08-orquestracao/tipos-de-trabalho/create-feature.md)
- [refatoracao](../08-orquestracao/tipos-de-trabalho/refatoracao.md)
- [review](../08-orquestracao/tipos-de-trabalho/review.md)
- [session-handoff](../08-orquestracao/tipos-de-trabalho/session-handoff.md)
- [learn-simple](../08-orquestracao/tipos-de-trabalho/learn-simple.md)
- [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md)
- [skill-cortex-spec-flow](skill-cortex-spec-flow.md)

---

## Quando usar
Os 4 agentes invocam esta skill **ao final de cada turno relevante** (com frequência regulada — ver seção "Frequência e cooldown"). Não é invocação manual do adopter — é invocação automática do agente como parte da Regra de comportamento proativo.

A skill avalia o contexto recente e, se algum workflow for relevante e estiver fora de cooldown, retorna sugestão. Caso contrário, retorna silêncio.

---

## Princípio de fronteira

**O que esta skill faz:**
- monitora contexto de sessão (mensagens do adopter, diffs do turno, commits recentes)
- aplica heurísticas para detectar oportunidades de workflows subutilizados
- propõe sugestão como pergunta no fim do turno
- mantém estado de cooldown por workflow

**O que esta skill NÃO faz:**
- executar workflows automaticamente (sempre pergunta primeiro)
- **executar `/clear`** — a sugestão de clean (nível 3) é só recomendação; limpar a janela é ação do harness/adopter, nunca da skill
- substituir invocação nominal do adopter (workflows continuam acionáveis por comando direto)
- duplicar a responsabilidade da [skill-validar-encerramento](skill-validar-encerramento.md) (que é obrigatória/hard-block; esta é proativa/opcional)
- emitir sugestões a cada turno (frequência é regulada — ver abaixo)
- persistir estado entre sessões diferentes (cooldown é por sessão; em sessão nova, contadores zeram)

---

## Entrada da skill

A cada invocação, a skill recebe do agente:

1. **Contexto da sessão (últimos 3-5 turnos):**
   - mensagens do adopter (texto integral)
   - arquivos editados/criados/lidos
   - comandos rodados (build, test, lint, git)
2. **Estado interno persistente na sessão:**
   - turno atual (contador desde início da sessão)
   - mapa de workflows → último turno em que foram sugeridos
   - mapa de workflows → status da última sugestão (`aceito`, `recusado`, `ignorado`)
   - flag `--no-suggest` ativo? (se sim, retorna silêncio imediatamente)

---

## Saída da skill

A skill retorna uma das três respostas:

1. **Silêncio** (nada a sugerir agora):
   ```
   <nenhuma saída — o agente segue normalmente>
   ```
2. **Sugestão pronta para mostrar ao adopter:**
   ```
   ✋ Pausa para sugestão:

   <Justificativa textual curta sobre por que este workflow é relevante agora>

   [s] Sim, acionar <Workflow>
   [n] Não, seguir adiante
   [m] Mostrar quando faria sentido
   ```
3. **Explicação detalhada do critério** (quando o adopter responde `[m]`):
   ```
   Sugeri <Workflow> porque:
   - <Critério 1 atendido, com evidência>
   - <Critério 2 atendido, com evidência>
   - <...>

   Quer acionar agora ou seguir adiante?
   ```

---

## Heurísticas iniciais (conservadoras)

Cada heurística tem critério explícito. Default é conservador — só dispara quando o sinal é claro. Lista evolutiva: novas heurísticas podem ser adicionadas neste arquivo sem nova Decisão.

### Conceito compartilhado — "unidade grande concluída"

Duas heurísticas do protocolo de encerramento (clean nível 3 e re-sync da fundação) dependem de detectar que uma **unidade grande** foi concluída. Os 3 sinais:

- **(projeto)** um [create-feature](../08-orquestracao/tipos-de-trabalho/create-feature.md) foi encerrado com [skill-validar-encerramento](skill-validar-encerramento.md) limpa;
- **(pasta 11 / governança)** fim de uma frente ou Decisão registrado (`current-status.md` + `handoff-*.md` marcando o fechamento);
- **(sessão)** fim de sessão sinalizado pelo adopter (`vou pausar`, `até amanhã`, `vou dormir`).

**Nunca dispara em micro-workflow** (um Learn Simple curto, uma edição isolada). Gatilho só em conclusão de unidade grande — evita ruído (parâmetro da Decisão 11).

### Para propor [review](../08-orquestracao/tipos-de-trabalho/review.md)

Dispara se **qualquer uma** das condições for verdadeira:

- Mensagens recentes do adopter contêm **2+ palavras-chave de fix**: `bug`, `fix`, `corrigir`, `erro`, `não funciona`, `quebrou`, `falha`, `regressão`.
- A sessão envolveu modificar código + rodar teste que estava falhando (e voltou a passar).
- O commit anterior usa prefixo `fix:` ou `hotfix:`.

E **adicionalmente**, o diff abrange apenas correções pontuais (não features novas).

**Justificativa típica:**

> Detectei que esta sessão foi predominantemente correção de bug (fix em `<arquivo>`). Quer acionar o workflow Review pra documentar a causa raiz e prevenir regressão?

### Para propor [refatoracao](../08-orquestracao/tipos-de-trabalho/refatoracao.md)

Dispara se **qualquer uma** das condições for verdadeira:

- Duplicação detectável de padrões nas últimas 2-3 features (mesma estrutura de código repetida **3+ vezes**).
- Funções/classes com complexidade ciclomática claramente crescente entre commits.
- Comentários `# TODO`, `# FIXME`, `// XXX` acumulados (**>3 no mesmo arquivo**).
- Mudanças repetidas no mesmo arquivo em **3+ sessões consecutivas**.

**Justificativa típica:**

> Notei que `<arquivo>` recebeu mudanças em 3 sessões consecutivas e acumulou 4 `# TODO`. Quer acionar o workflow Refactor pra avaliar se vale reestruturar antes de continuar?

### Para propor [learn-simple](../08-orquestracao/tipos-de-trabalho/learn-simple.md)

Dispara se **qualquer uma** das condições for verdadeira:

- Adopter cometeu o mesmo tipo de erro/dúvida **2x na mesma sessão**.
- Sessão envolveu descoberta de "ah, faltava isso" — sinal claro de aprendizado a registrar.

**Justificativa típica:**

> Esta sessão teve 2 momentos de "ah, eu não sabia que precisava de X". Quer acionar Learn Simple pra registrar o aprendizado em `memory/learnings.md`?

### Para propor [create-feature](../08-orquestracao/tipos-de-trabalho/create-feature.md), [setup-project](../08-orquestracao/tipos-de-trabalho/setup-project.md), [novo-projeto](../08-orquestracao/tipos-de-trabalho/novo-projeto.md), [session-handoff](../08-orquestracao/tipos-de-trabalho/session-handoff.md)

Estes workflows tipicamente são acionados pelo adopter de forma nominal. A skill não propõe por default, mas heurísticas podem ser adicionadas no futuro se aparecer padrão de subutilização (ex: adopter encerrando sessão sem chamar Handoff).

**Exceção atual — Handoff:**

- Se o adopter sinalizar fim de sessão (`vou pausar`, `até amanhã`, `vou dormir`, `salva o estado`) sem ter acionado Handoff explicitamente, sugerir [session-handoff](../08-orquestracao/tipos-de-trabalho/session-handoff.md) na hora.

### Para sugerir `/clear` (nível 3 — limpar contexto)

Esta é a sugestão do **nível 3** do protocolo de encerramento (Decisão 11). O Cortex **nunca executa** `/clear` — é ação do harness/adopter; a skill apenas **recomenda**.

Dispara quando:

- uma **unidade grande foi concluída** (ver "Conceito compartilhado" acima); **E**
- o **Handoff já foi concluído** nesta sessão. "Concluído" aqui significa o workflow [session-handoff](../08-orquestracao/tipos-de-trabalho/session-handoff.md) executado até a Saída mínima aceitável — **incluindo a verificação de coerência interna (nível 2)** — não apenas o arquivo `handoff.md` editado à mão. Editar o arquivo sem rodar o fluxo não satisfaz o gate, porque pula a checagem de coerência (fricção F-B3 do auto-teste 2026-06-05).

**Gate duro (encadeamento clean ↔ Handoff):** a sugestão de clean **só aparece após Handoff concluído**. Se a unidade grande fechou mas **não** houve Handoff, a skill **sugere Handoff primeiro** — clean nunca é sugerido "nu", porque limpar a janela sem continuidade registrada = perda de contexto.

**Texto-modelo:**

```
✋ Contexto registrado em handoff. Unidade "<X>" concluída.
   Quer limpar a janela e abrir uma sessão nova?

   [s] Sim, limpar (rode /clear)
   [n] Não, seguir nesta sessão
   [m] Mostrar critério detectado
```

A opção `[s]` **não executa** `/clear` — apenas confirma a recomendação; o adopter roda `/clear` (ação do harness). O `[m]` mostra qual sinal de "unidade grande" foi detectado.

### Para sugerir re-sync da fundação (cobre G3)

Dispara quando uma **unidade grande foi concluída** (ver "Conceito compartilhado") **e** a camada de memória/fundação parece ter derivado do estado real:

- `memory/project-context.md`, `docs/analysis/current-state-assessment.md` ou `docs/analysis/gaps-and-unknowns.md` não foram tocados desde a última feature/frente, enquanto `current-status.md` seguiu sendo atualizado (sinal conservador de frescor — fundação fossilizada).

**Robustez do sinal (F-B4 do auto-teste 2026-06-05):** o frescor por mtime/git é fraco logo após clone/cópia (que iguala mtimes) — justamente o momento de troca de máquina da evidência G4. Quando não houver histórico git confiável, complementar com um **sinal de conteúdo**: versão/porta/paths citados em `current-status.md` que estão ausentes (ou divergentes) em `project-context.md`/`as-is`. Opcional — a heurística é conservadora por design (falso-negativo é o modo de falha aceito).

**Texto-modelo:**

```
✋ A camada de memória/fundação pode ter derivado do estado real
   (project-context / current-state-assessment não tocados desde
   a última unidade). Quer re-sincronizar a fundação antes de fechar?

   [s] Sim, revisar memory/ e as-is
   [n] Não, seguir
   [m] Mostrar o que parece desatualizado
```

**Não é hard-block** — re-sync é julgamento do adopter. Forçar geraria falso positivo (nem toda unidade exige tocar `project-context`) e viraria ritual vazio, exatamente o risco que a Decisão 05 alertou. Por isso G3 é sugestão proativa, não check da [skill-validar-encerramento](skill-validar-encerramento.md).

### Para propor [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md)

Dispara se **qualquer uma** das condições for verdadeira:

- adopter mencionou 2+ vezes palavras de spec/produto (`requisitos`, `jornada do usuário`, `caso de uso`, `regra de negócio`, `critério de aceite`, `spec`, `discovery`, `brainstorm de produto`);
- adopter pediu ajuda para definir feature antes de implementar (`não sei ainda como fazer`, `vamos pensar primeiro`, `me ajuda a estruturar o que precisa ser feito`);
- adopter abriu Create Feature mas a feature está claramente nebulosa (sem visão definida, sem casos de uso).

**Justificativa típica:**

> Detectei sinais de trabalho de spec/produto ("vamos pensar primeiro", "regras de negócio"). Quer acionar **Cortex Spec Flow** pra estruturar a spec antes de partir pra Create Feature?

Cortex Spec Flow é **opcional** — sugestão respeita autonomia do adopter, que pode preferir ir direto a Create Feature.

---

## Heurísticas de transição dentro do Cortex Spec Flow

Quando a sessão está em [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md), a skill atua em coordenação com [skill-cortex-spec-flow](skill-cortex-spec-flow.md) para sugerir **transições para outros workflows** (saída do Spec Flow), enquanto a skill auxiliar cobre **transições entre modos** internos.

Proatividade adaptada pelo modo atual:

| Modo atual | Proatividade desta skill | Sugestões típicas |
|---|---|---|
| Exploração | desativada por default (`--no-suggest` automático) | — |
| Guiado | ativa | Create Feature (spec pronta), Handoff (pausa), Review (se sessão virou fix), Refactor (se aparecer padrão repetido) |
| Conduzido | ativa | Create Feature (spec pronta), Handoff (pausa) |
| Governado | ativa mas conservadora | Apenas Create Feature ao final do checklist; sem sugestão de mudança de modo no meio do fluxo formal |

### Exploração → modo proativo desativado

Em modo Exploração, a skill retorna silêncio imediatamente — proatividade desligada por default. Adopter pode reativar com `--suggest` se quiser sugestões mesmo em Exploração.

Justificativa: Exploração tem natureza de captura livre. Sugestão de Review/Refactor/Create Feature interrompe o fluxo exploratório. Skill respeita a natureza do modo.

### Spec Flow → Create Feature

Dispara em modos Guiado/Conduzido/Governado quando:

- spec tem `visao.md` preenchido + pelo menos um de `casos-de-uso.md` ou `criterios.md` preenchido;
- adopter mencionou "pronto pra implementar", "vamos codar agora" ou equivalente;
- spec entrou em estágio de fechamento com destino "Create Feature" sugerido.

**Justificativa típica:**

> Spec tem visão + casos de uso definidos. Quer encerrar Cortex Spec Flow com destino "Create Feature" e acionar [create-feature](../08-orquestracao/tipos-de-trabalho/create-feature.md) na sequência?

### Spec Flow → Session Handoff

Dispara em qualquer modo (incluindo Exploração, se adopter ativou `--suggest`) quando:

- adopter sinalizou pausa (`vou pausar`, `até amanhã`, `vou dormir`);
- sessão longa + horário tardio.

**Justificativa típica:**

> Sinalizou pausa. Quer encerrar Cortex Spec Flow com destino "Pausa" e acionar [session-handoff](../08-orquestracao/tipos-de-trabalho/session-handoff.md) pra registrar continuidade?

### Spec Flow → Review / Refactor

As heurísticas padrão de Review e Refactor continuam valendo dentro do Spec Flow nos modos Guiado/Conduzido (não em Exploração nem Governado).

Em **Governado**, sugestões de mudança de workflow são **conservadoras** — apenas Create Feature ao final do checklist. Sugerir Review/Refactor no meio de Governado fragmenta o rigor sequencial do modo.

---

## Frequência e cooldown

### Frequência da invocação

A skill é invocada pelos 4 agentes **a cada 3-5 turnos relevantes** — não a cada turno (vira ruído). Turno relevante = turno em que o adopter escreveu algo ou em que o agente fez mudanças de código.

Em sessão muito curta (< 3 turnos relevantes), a skill pode ser pulada — não há contexto suficiente para sugestão útil.

### Cooldown por workflow

Para cada workflow, manter o último turno em que foi sugerido + status da resposta do adopter.

- Se **recusado** (`[n]`): cooldown de **5 turnos relevantes** antes de poder sugerir o mesmo workflow novamente.
- Se **aceito** (`[s]`): workflow foi acionado; cooldown infinito durante esta sessão (não sugerir o mesmo de novo).
- Se **ignorado** (adopter respondeu mas não escolheu): cooldown de 3 turnos.
- Se o **tipo de contexto mudar significativamente** (ex: adopter passa de "fixar bug" para "criar nova feature"), o cooldown se reseta para os workflows recusados — porque a justificativa anterior pode não mais se aplicar.

### Silenciador `--no-suggest`

O adopter pode silenciar todas as sugestões com flag `--no-suggest` em qualquer mensagem. Efeito:

- A flag fica ativa para o resto da sessão atual.
- A skill retorna silêncio imediatamente em todas as invocações.
- Para reativar, adopter envia `--suggest` (sem `no-`) ou começa nova sessão.

---

## Telemetria leve

Cada sugestão produzida pela skill registra uma linha em `06-logs-e-memoria/sugestoes-proativas.log` com:

```
<timestamp> | <workflow sugerido> | <heurística que disparou> | <resposta do adopter: aceito|recusado|ignorado|silenciado>
```

A telemetria existe para:
- revisar heurísticas após primeira semana de uso real;
- identificar quais sugestões são ruído (alta taxa de recusa) e quais são valiosas (alta taxa de aceite);
- ajustar heurísticas sem precisar de nova Decisão (atualizar este arquivo).

Telemetria fica em `06-logs-e-memoria/`, pasta privada (não vai para o OSS público).

---

## Conexão com modos do Cortex Spec Flow (Decisão 10)

A frente 11 (definição conceitual de Spec-Driven Development) foi encerrada em 2026-05-19. A proposta P-08 original (modos do harness) virou **modos internos do Cortex Spec Flow** — não modos globais do harness. Portanto, esta skill **continua ativa por default** em todos os contextos fora do Spec Flow.

Dentro do [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md), a proatividade desta skill é adaptada por modo:

- **Modo Exploração** — desativada por default (`--no-suggest` automático). Adopter pode forçar com `--suggest`.
- **Modo Guiado** — ativa, todas as heurísticas valem.
- **Modo Conduzido** — ativa, foco em Create Feature e Handoff (transições naturais para fora do Spec Flow).
- **Modo Governado** — ativa mas conservadora, apenas Create Feature ao final do checklist (sem fragmentar o rigor sequencial).

Fora do Spec Flow (nos outros 7 workflows), nada muda: skill ativa em todos os contextos, conforme Decisão 06.

---

## Regras aplicáveis
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)

---

## Agentes que mais usam esta skill
Todos os 4 agentes invocam a skill ao final de cada turno relevante:

- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md) (Init Project, Setup Project)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md) (Create Feature, Refatoração)
- [agente-analista](../02-agentes/agente-analista.md) (Review, Learn Simple)
- [agente-planejador](../02-agentes/agente-planejador.md) (Session Handoff)

---

## Sinais de uso correto
- adopter recebe sugestão proativa de Review/Refactor/Learn Simple quando o contexto pede;
- sugestões aparecem como pergunta clara, com opção `[m]` para entender o critério;
- adopter pode silenciar facilmente com `--no-suggest` se virar ruído;
- cooldown evita repetição de sugestões recusadas;
- telemetria em `06-logs-e-memoria/sugestoes-proativas.log` permite ajuste das heurísticas com base em dados reais.

---

## Sinais de uso ruim
- skill propõe workflow a cada turno (frequência alta demais);
- sugestões fora de contexto (heurística mal calibrada);
- skill executa workflow automaticamente sem perguntar;
- adopter precisa silenciar repetidamente nas primeiras sessões — sinal de que heurísticas precisam ser ajustadas;
- skill ignora cooldown e sugere o mesmo workflow turno após turno;
- telemetria não é registrada — perda da oportunidade de calibração.

---

## Risco principal a monitorar

**Heurísticas mal calibradas viram ruído.** Se as sugestões aparecem fora de contexto, adopter desliga (`--no-suggest`) e perde o ganho. Calibração + ajuste fino são parte do design.

Mitigação:
- Começar conservador (critérios claros, alta confiança).
- Telemetria leve em `06-logs-e-memoria/sugestoes-proativas.log` para revisar após primeira semana de uso.
- Atualizar heurísticas neste arquivo sem precisar de nova Decisão.

---

## Origem
Esta skill foi criada em 2026-05-18 para implementar a Decisão 06 — Agentes Proativos para Review e Refactor (registrada em `11-evolucao-do-sistema/02-decisoes/agentes-proativos-review-refactor.md`) a partir de fricções identificadas no teste-adopter-2 (questionário 2.3, 6.3, 6.1 #3): adopter usou Cortex em 2 projetos por 4-5 sessões e **nunca** invocou Review nem Refactor, embora em retrospecto reconhecesse que ambos teriam sido úteis. O agente deveria ter percebido.

Em 2026-05-20, recebeu expansão da Decisão 10 (frente 14 — Cortex Spec Flow):

- heurística nova para sugerir [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md) quando contexto pede;
- heurísticas de transição dentro do Spec Flow (saída para Create Feature, Handoff, Review, Refactor) adaptadas por modo (Exploração / Guiado / Conduzido / Governado);
- proatividade desativada por default em modo Exploração (preserva natureza do modo).

Em 2026-06-05, recebeu expansão da Decisão 11 (frente 16 — protocolo de encerramento robusto, registrada em `11-evolucao-do-sistema/02-decisoes/protocolo-encerramento-robusto.md`):

- heurística de **sugestão de `/clear`** (nível 3 do protocolo) — gated por Handoff concluído, cobre G4;
- heurística de **re-sync da fundação** (cobre G3) — sugestão proativa, não check bloqueante;
- ambas disparadas por "unidade grande concluída", ambas sob `--no-suggest`/cooldown.

---

## Regra final
O papel desta skill é simples:
**garantir que workflows do Cortex sejam usados quando o contexto pede, sem depender de invocação nominal do adopter.** Sempre pergunta, nunca executa automaticamente, respeita cooldown e silenciador, evolui via heurísticas e telemetria.
