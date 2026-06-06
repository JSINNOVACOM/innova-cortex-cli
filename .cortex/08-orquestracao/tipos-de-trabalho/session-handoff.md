# Tipo de trabalho: handoff de sessão

## Objetivo

Definir como o sistema deve encerrar uma sessão de trabalho e registrar continuidade, garantindo que o projeto possa ser retomado por qualquer agente ou pelo usuário sem depender de contexto implícito ou memória informal.

Relacionado a:

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- [handoff-entre-agentes](../handoffs/handoff-entre-agentes.md)
- [template-handoff](../../04-templates/template-handoff.md)
- [template-current-status](../../04-templates/template-current-status.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)
- [criterios-base](../criterios-de-entrada-e-saida/criterios-base.md)

---

## Princípio central

Sessão encerrada sem handoff é contexto perdido.

O handoff de sessão não é burocracia. É a única garantia de que o trabalho feito nesta sessão poderá ser continuado com clareza na próxima.

A meta deste fluxo não é produzir documentação longa.  
A meta é garantir que o estado atual do projeto esteja registrado de forma suficiente para continuidade segura.

---

## Distinção crítica

Este fluxo é diferente do [handoff-entre-agentes](../handoffs/handoff-entre-agentes.md).

**Handoff de sessão** (este arquivo):
- acionado pelo usuário ao encerrar uma sessão de trabalho
- registra o estado do projeto para continuidade futura
- atualiza `docs/context/current-status.md` e `docs/context/handoff.md`
- pode envolver qualquer agente ativo na sessão

**Handoff entre agentes** ([handoff-entre-agentes](../handoffs/handoff-entre-agentes.md)):
- acionado internamente pelo sistema durante uma sessão
- transfere contexto de um agente para outro dentro da mesma sessão
- não encerra a sessão
- não atualiza documentação de continuidade do projeto

Os dois mecanismos coexistem e têm propósitos distintos. Este não substitui o outro.

---

## Quando este tipo de trabalho se aplica

Usar este fluxo quando:

- o usuário quer encerrar a sessão de trabalho atual
- o usuário precisa pausar o trabalho e garantir que poderá retomar com clareza
- a sessão produziu mudanças relevantes que precisam estar registradas
- há risco de perda de contexto se o trabalho for interrompido agora

---

## Quando este tipo de trabalho não se aplica

Não usar este fluxo como padrão quando:

- o objetivo é apenas passar contexto de um agente para outro dentro da mesma sessão (usar [handoff-entre-agentes](../handoffs/handoff-entre-agentes.md))
- o projeto não está ativo e não houve sessão de trabalho real
- o objetivo é criar documentação nova do projeto, não registrar estado atual

---

## Perguntas que este fluxo deve responder

Antes de considerar o fluxo bem executado, o sistema deve conseguir responder minimamente:

- o que foi feito nesta sessão?
- o que ficou em aberto?
- qual é o próximo passo mais sensato?
- o estado atual do projeto está corretamente registrado?
- o handoff está completo o suficiente para que outra pessoa ou agente retome sem perguntas básicas?
- o handoff é internamente coerente (próximos passos consistentes com o que foi feito)?
- existe alguma pendência ou bloqueio que precisa estar visível em `docs/context/current-status.md`?

---

## Agentes mais prováveis no fluxo

Qualquer agente ativo na sessão pode conduzir este fluxo.

O agente que conduziu o trabalho final da sessão é o mais indicado para iniciar o handoff, pois tem o contexto mais fresco.

---

## Skills mais prováveis no fluxo

Este fluxo usa diretamente os templates:

- [template-handoff](../../04-templates/template-handoff.md)
- [template-current-status](../../04-templates/template-current-status.md)

E uma skill na etapa de fechamento:

- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)

---

## Fluxo recomendado

### Etapa 1: levantamento do que foi feito

Objetivo:  
identificar o que foi produzido, alterado ou decidido nesta sessão.

Deve produzir:

- lista objetiva das ações realizadas
- decisões tomadas durante a sessão
- mudanças feitas em código, documentação ou configuração
- resultados alcançados

---

### Etapa 2: levantamento do que está em aberto

Objetivo:  
identificar o que ficou pendente e qual é o próximo passo.

Deve produzir:

- pontos em aberto que ainda precisam de ação
- dúvidas não resolvidas
- riscos ou bloqueios identificados
- próximo passo mais sensato recomendado

---

### Etapa 3: atualização de `current-status.md`

Objetivo:  
atualizar o registro vivo de estado do projeto.

Deve conter:

- estado atual do projeto
- o que foi concluído
- o que está em andamento
- o que está bloqueado
- data da última atualização

Usar [template-current-status](../../04-templates/template-current-status.md) como referência de estrutura.

---

### Etapa 4: atualização de `handoff.md`

Objetivo:  
registrar o contexto necessário para retomada segura.

Deve conter, no mínimo:

- contexto resumido do projeto
- estado atual
- pontos ainda abertos
- motivo da pausa, quando relevante
- próxima ação esperada
- referências relevantes (arquivos, decisões, documentos)

Usar [template-handoff](../../04-templates/template-handoff.md) como referência de estrutura.

Se não existir `docs/context/` no projeto, registrar essa ausência como lacuna e indicar ao usuário antes de encerrar.

---

### Etapa 5: verificação de pendências do projeto

Objetivo:  
garantir que pendências e bloqueios identificados durante a sessão estão visíveis no `current-status.md` para a próxima retomada.

Deve verificar:

- todas as pendências relevantes desta sessão estão listadas em `docs/context/current-status.md`?
- bloqueios identificados estão nomeados com clareza?
- a próxima ação recomendada considera essas pendências?

Pendências não devem viver em arquivos paralelos. O `current-status.md` é a fonte única de verdade para o estado vivo do projeto, incluindo pendências e bloqueios.

---

### Etapa 6: validação de fechamento (OBRIGATÓRIA)

**Status:** hard-required. Workflow NÃO pode ser declarado concluído sem este passo.

Objetivo:  
garantir que o material atualizado nesta sessão (`current-status.md`, `handoff.md`) não contém pendências silenciosas que poluam a retomada.

Aplicar [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) sobre os dois arquivos. A skill verifica:

- **Check 1:** placeholders pendentes (`{{...}}`, `<!-- TODO: ... -->`);
- **Check 2:** referências a arquivos que não existem (caso típico em handoff: linkar arquivo que ainda não foi criado);
- **Check 3:** EOF/newline final;
- **Check 4:** seções vazias com cabeçalho;
- **Check 6:** wikilinks fantasma (lista negra em `03-skills/wikilinks-fantasma.txt`);
- **Check 8:** marcadores de conflito de merge (`<<<<<<<` / `=======` / `>>>>>>>`) — hard-block. Crítico neste fluxo: `current-status.md` e `handoff.md` são exatamente os arquivos onde um `git stash`/merge malsucedido grava conflito (evidência G1), e são os primeiros lidos numa retomada.

(Check 5 — `.gitignore` mínimo — roda apenas em Init Project e Setup Project, não nesta etapa.)

O relatório consolidado deve ser apresentado ao usuário **mesmo se zero problemas encontrados** (output mínimo obrigatório). Achados devem ser corrigidos antes do encerramento ou registrados como pendência explícita no próprio `current-status.md` — exceto marcadores de conflito (Check 8), que não admitem pendência e devem ser resolvidos.

#### Verificação de coerência interna do handoff (nível 2 do protocolo de encerramento)

Além dos checks mecânicos da skill, antes de declarar o fluxo concluído, conferir que o `handoff.md` é **auto-suficiente para retomada cega** — isto é, que outra pessoa ou agente conseguiria retomar sem perguntas básicas. Em especial:

- a seção de **próximos passos / o que está aberto** é **consistente** com a seção de **o que foi feito**: um item dado como concluído não pode aparecer também como pendente ou "(opcional) melhoria futura";
- o próximo passo declarado é coerente com o estado registrado em `current-status.md`.

Esta verificação é **estrutural** (consistência entre seções), não análise semântica profunda do conteúdo. Cobre a lacuna G2 (Decisão 11): handoff que roda a skill e commita, mas fica internamente dessincronizado, deixando a retomada ambígua.

Para o cruzamento ser verificável, recomenda-se que os itens de **o que foi feito** e **próximos passos** carreguem um **identificador estável** (`TASK-XX`, `DEC-XX`) — assim "feito × pendente" do mesmo item casa por ID. Sem ID compartilhado, a verificação é **best-effort**: cobre repetição literal entre seções, mas não paráfrase (o mesmo item descrito por prosa divergente pode escapar — fricção F-B2 do auto-teste 2026-06-05).

---

### Etapa 7: sugestão de limpeza de contexto (OPCIONAL — nível 3)

**Status:** opcional, nunca hard-block.

Objetivo:  
fechar o terceiro nível do protocolo de encerramento (Decisão 11) — costurar a continuidade registrada (níveis 1 e 2) com a troca de contexto / limpeza de janela.

Com o Handoff concluído (níveis 1 e 2 fechados), e se a sessão concluiu uma **unidade grande** (feature completa, fim de frente/Decisão, fim de sessão sinalizado), oferecer ao adopter a sugestão de limpar a janela e abrir sessão nova. O gatilho e o texto são da [skill-detectar-workflow-relevante](../../03-skills/skill-detectar-workflow-relevante.md) (heurística de `/clear`):

```
✋ Contexto registrado em handoff. Unidade "<X>" concluída.
   Quer limpar a janela e abrir uma sessão nova?
   [s] Sim (rode /clear)   [n] Não   [m] Critério
```

Regras:

- a sugestão **só aparece após o Handoff concluído** — clean sem continuidade registrada = perda de contexto;
- o Cortex **nunca executa** `/clear` — é ação do harness/adopter; aqui só recomenda;
- obedece `--no-suggest` e o cooldown das sugestões proativas (Decisão 06);
- na **pasta 11 (governança)**, o equivalente ao Handoff é atualizar `current-status.md` + `handoff-*.md`, e a sugestão de clean vale ao fechar uma frente/Decisão (escopo dual da Decisão 11).

---

## Saída mínima aceitável

Este fluxo só deve ser considerado minimamente concluído quando existir:

- registro do que foi feito na sessão
- registro do que está em aberto
- `docs/context/current-status.md` atualizado
- `docs/context/handoff.md` atualizado com próximo passo claro, internamente coerente (próximos passos × o que foi feito)
- validação de fechamento executada (Checks 1, 2, 3, 4, 6, 8 da skill)
- ⚠ Workflow não é considerado concluído sem relatório da skill (mesmo se vazio).
- (opcional) sugestão de limpeza de contexto oferecida quando a sessão concluiu unidade grande

Sem isso, a sessão foi encerrada com contexto parcial ou perdido.

---

## Critérios de entrada

Este fluxo pode começar quando houver pelo menos:

- uma sessão de trabalho ativa ou recente que precisa ser encerrada
- acesso à documentação de contexto do projeto (`docs/context/`)
- contexto suficiente para descrever o que foi feito e o que está aberto

---

## Critérios de saída

Este fluxo pode ser encerrado quando:

- `current-status.md` estiver atualizado, incluindo pendências e bloqueios
- `handoff.md` estiver atualizado com próximo passo claro

Encerrar este fluxo não significa que o projeto está concluído.  
Significa que ele pode ser retomado com segurança.

---

## Sinais de uso correto

Este fluxo está sendo bem usado quando:

- o handoff é feito antes de encerrar a sessão, não depois
- o próximo passo fica explícito no handoff
- `current-status.md` reflete o estado real do projeto, incluindo pendências
- o handoff não depende de memória implícita ou contexto de sessão anterior

---

## Sinais de uso ruim

Há desvio quando:

- a sessão é encerrada sem atualizar `current-status.md` ou `handoff.md`
- o próximo passo fica implícito ou ausente
- o handoff descreve o que foi feito mas não o que ainda falta
- pontos abertos importantes são omitidos
- pendências do projeto vão para arquivos paralelos em vez de `current-status.md`
- o fluxo é usado para documentar contexto histórico em vez de estado atual

---

## Relação com projetos reais

Os dois artefatos obrigatórios deste fluxo vivem no próprio projeto:

- `docs/context/current-status.md` (estado vivo, incluindo pendências e bloqueios)
- `docs/context/handoff.md` (passagem de contexto para retomada)

Este arquivo de orquestração não substitui esses documentos.  
Ele apenas define como conduzir bem o encerramento de sessão.

---

## Regra final

Handoff de sessão deve sair do estado de sessão ativa e chegar ao estado de projeto pausado com continuidade garantida.

A prioridade é simples:  
**registrar o que foi feito, explicitar o que está aberto, atualizar status e handoff, e só então encerrar.**
