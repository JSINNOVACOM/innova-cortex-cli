# Tipo de trabalho: refatoração

## Objetivo
Definir como o sistema deve conduzir demandas de refatoração, desde o entendimento do estado atual até a preparação e execução controlada da mudança, sem confundir refatoração com reescrita impulsiva ou implementação desancorada.

Relacionado a:
- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-analista](../../02-agentes/agente-analista.md)
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
- [agente-planejador](../../02-agentes/agente-planejador.md)
- [skill-mapear-contexto](../../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)
- [roteamento-basico](../roteamento/roteamento-basico.md)
- [handoff-entre-agentes](../handoffs/handoff-entre-agentes.md)
- [criterios-base](../criterios-de-entrada-e-saida/criterios-base.md)

---

## Princípio central
Refatoração não é começar do zero.

Refatoração também não é apenas “mexer no código”.

Ela existe para melhorar estrutura, clareza, manutenção, acoplamento, evolução ou segurança de mudança, preservando o comportamento esperado ou controlando explicitamente o que será alterado.

Este fluxo existe para evitar:
- reescrita impulsiva disfarçada de refatoração
- mudança estrutural sem entendimento do que existe hoje
- quebra acidental de comportamento importante
- avanço técnico sem delimitar risco, impacto e critério de validação

---

## Quando este tipo de trabalho se aplica
Usar este fluxo quando:
- algo já existe e precisa ser reorganizado ou melhorado
- o problema principal é estrutural, não ausência total de solução
- há necessidade de reduzir acoplamento, complexidade ou fragilidade
- existe intenção de modernizar sem necessariamente reconstruir tudo
- é preciso preparar a base para evolução futura com menos risco

---

## Quando este tipo de trabalho não se aplica
Não usar este fluxo como padrão quando:
- a demanda é um projeto realmente novo
- a necessidade principal é descoberta inicial de domínio
- a mudança é apenas uma feature pontual sem impacto estrutural relevante
- a solução existente é tão insuficiente que a discussão real é substituição completa
- não existe base mínima para dizer o que está sendo preservado ou mudado

Nesses casos, outro tipo de trabalho deve ser usado.

---

## Perguntas que este fluxo deve responder
Antes de considerar o fluxo bem executado, o sistema deve conseguir responder minimamente:
- o que existe hoje?
- qual problema estrutural está motivando a refatoração?
- o que precisa ser preservado?
- o que pode ser alterado?
- quais riscos de regressão ou interpretação errada existem?
- como validar que a mudança foi segura o suficiente?
- o próximo passo é refatorar, investigar mais ou reavaliar a abordagem?

---

## Agentes mais prováveis no fluxo
Os agentes mais comuns para refatoração são:

1. [agente-analista](../../02-agentes/agente-analista.md)
2. [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
3. [agente-planejador](../../02-agentes/agente-planejador.md)

Dependendo do contexto, pode haver apoio de:
- [agente-inicializacao-projeto](../../02-agentes/agente-inicializacao-projeto.md), se o projeto estiver muito solto documentalmente

A ordem mais comum é:
- entender
- avaliar
- estruturar
- planejar
- executar
- revisar

---

## Skills mais prováveis no fluxo
As skills mais comuns para este tipo de trabalho são:
- [skill-mapear-contexto](../../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) (etapa de fechamento)

---

## Fluxo recomendado

### Etapa 1: leitura do estado atual

Objetivo:
entender minimamente o que existe hoje e por que isso está sendo questionado.

Deve produzir:
- descrição do ponto atual
- problema estrutural percebido
- escopo inicial da refatoração
- evidências do incômodo atual
- risco inicial de mexer nisso

Se ainda não estiver claro o que a refatoração quer melhorar, não avançar para solução estrutural.

---

### Etapa 2: separação entre comportamento e estrutura

Objetivo:
distinguir o que deve ser preservado do que precisa ser reorganizado.

Deve explicitar:
- comportamento esperado que não deveria quebrar
- limitações ou falhas da estrutura atual
- partes críticas sensíveis a regressão
- mudanças aceitáveis e mudanças que exigiriam decisão explícita

Sem essa separação, a refatoração tende a virar mudança funcional implícita.

---

### Etapa 3: avaliação crítica da base existente

Objetivo:
produzir leitura mais disciplinada do problema estrutural.

Deve responder:
- onde está a principal fragilidade?
- o problema é acoplamento, organização, duplicação, clareza, dependência externa, teste, contrato ou outro?
- a base atual está apenas desorganizada ou estruturalmente inadequada?
- existe valor em evoluir incrementalmente ou a hipótese de reestruturação maior precisa ser considerada?

---

### Etapa 4: estruturação da direção de refatoração

Objetivo:
organizar a proposta de melhoria sem tratá-la como implementação pronta.

Deve explicitar:
- estado atual resumido
- direção sugerida
- alternativas relevantes, quando fizer sentido
- trade-offs principais
- risco da mudança
- dependências ou pré-condições para mexer com segurança

---

### Etapa 5: planejamento da execução

Objetivo:
transformar a direção escolhida em passos executáveis e controlados.

Deve deixar claro:
- o que fazer primeiro
- o que pode rodar em paralelo
- o que não deve ser mexido ainda
- qual validação mínima precisa existir
- como detectar regressão ou impacto indesejado
- onde parar se a mudança começar a expandir escopo

---

### Etapa 6: execução controlada

Objetivo:
realizar a refatoração sem perder controle de impacto.

A execução deve buscar:
- passos pequenos quando possível
- clareza do que foi alterado
- validação proporcional ao risco
- preservação explícita do que precisava continuar funcionando

Se a execução começar a alterar demasiadamente o comportamento sem decisão explícita, o fluxo deve parar e reavaliar.

---

### Etapa 7: revisão e continuidade

Objetivo:
verificar se a refatoração realmente melhorou a situação e preparar continuidade segura.

Deve atualizar, quando aplicável:
- critérios de validação usados
- impacto percebido
- pontos ainda frágeis
- próximos passos
- handoff e status do projeto, se houver projeto específico

---

### Etapa 8: validação de fechamento (OBRIGATÓRIA)

**Status:** hard-required. Workflow NÃO pode ser declarado concluído sem este passo.

Objetivo:
garantir que a documentação atualizada pela refatoração não contém pendências silenciosas.

Aplicar [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) sobre os arquivos criados ou editados (`docs/analysis/*`, `docs/context/current-status.md`, `docs/context/handoff.md`). A skill verifica:

- **Check 1:** placeholders pendentes (`{{...}}`, `<!-- TODO: ... -->`);
- **Check 2:** referências a arquivos que não existem;
- **Check 3:** EOF/newline final;
- **Check 4:** seções vazias com cabeçalho;
- **Check 6:** wikilinks fantasma (lista negra em `03-skills/wikilinks-fantasma.txt`).

(Check 5 — `.gitignore` mínimo — roda apenas em Init Project e Setup Project, não nesta etapa.)

O relatório consolidado deve ser apresentado ao usuário **mesmo se zero problemas encontrados** (output mínimo obrigatório). Achados devem ser corrigidos ou registrados como pendência explícita em `docs/context/current-status.md` antes do encerramento.

---

## Saída mínima aceitável
Este fluxo só deve ser considerado minimamente concluído quando existir:
- entendimento suficiente do estado atual
- problema estrutural explicitado
- separação entre estrutura e comportamento preservado
- direção de refatoração organizada
- plano mínimo de execução ou sequência de mudança
- critério mínimo de validação
- clareza sobre o que foi melhorado ou o que ainda falta
- validação de fechamento executada (Checks 1, 2, 3, 4, 6 da skill)
- ⚠ Workflow não é considerado concluído sem relatório da skill (mesmo se vazio).

Sem isso, ainda há grande chance de a refatoração ter sido apenas movimentação de código sem direção clara.

---

## Critérios de entrada
Este fluxo pode começar quando houver pelo menos:
- algo existente para analisar
- motivação minimamente clara para refatorar
- autorização para avaliar ou evoluir a estrutura
- algum material, código, documentação ou evidência do problema atual

---

## Critérios de saída
Este fluxo pode ser encerrado quando:
- a direção de refatoração estiver clara e registrada
- a execução já tiver sido concluída com validação mínima
ou
- o sistema concluir, com base suficiente, que ainda não é hora de refatorar e que é melhor voltar para análise ou clarificação

Encerrar este fluxo não significa que tudo está perfeito.
Significa apenas que a refatoração deixou de estar improvisada.

---

## Sinais de uso correto
Este fluxo está sendo bem usado quando:
- o comportamento preservado fica explícito
- a refatoração não começa por impulso
- o problema estrutural é nomeado com clareza
- a execução ocorre com controle de impacto
- o sistema evita confundir refatoração com reescrita total
- o próximo passo fica mais previsível

---

## Sinais de uso ruim
Há desvio quando:
- o sistema chama qualquer reescrita de refatoração
- ninguém explicita o que precisa continuar funcionando
- a mudança estrutural cresce sem delimitação
- o fluxo pula análise e vai direto para alteração
- não existe critério mínimo de validação
- mudanças funcionais aparecem como efeito colateral silencioso

---

## Relação com projetos reais
Quando a refatoração pertence a um projeto específico, o acompanhamento local deve acontecer no próprio projeto.

Especialmente em:
- `docs/analysis/`
- `docs/context/current-status.md`
- `docs/context/handoff.md`

Este arquivo de orquestração não substitui esses documentos.
Ele apenas define como conduzir bem esse tipo de trabalho.

---

## Relação com `criterios-base`
Este tipo de trabalho deve respeitar especialmente:
- entrada mínima em análise
- entrada mínima em estruturação
- entrada mínima em planejamento
- entrada mínima em execução
- saída mínima compatível com handoff e revisão

Refatoração sem esse controle tende a acelerar cedo demais.

---

## Regra final
Refatoração deve sair do estado de incômodo estrutural difuso e chegar ao estado de mudança compreendida, delimitada e validável.

A prioridade é simples:
**entender o que existe, preservar o que importa, melhorar com controle e só então avançar.**
