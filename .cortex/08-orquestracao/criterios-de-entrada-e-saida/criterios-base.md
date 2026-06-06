# Critérios base de entrada e saída

## Objetivo
Definir condições mínimas para que uma etapa possa começar ou ser considerada minimamente concluída dentro do sistema, reduzindo avanço prematuro, troca vazia entre agentes e sensação artificial de progresso.

Relacionado a:
- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)
- [agente-inicializacao-projeto](../../02-agentes/agente-inicializacao-projeto.md)
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
- [agente-analista](../../02-agentes/agente-analista.md)
- [agente-planejador](../../02-agentes/agente-planejador.md)
- [roteamento-basico](../roteamento/roteamento-basico.md)
- [handoff-entre-agentes](../handoffs/handoff-entre-agentes.md)

---

## Princípio central
Nem toda etapa deve começar apenas porque existe demanda.

Nem toda etapa deve terminar apenas porque algo foi produzido.

Critério de entrada e saída existe para responder:
- isso já está pronto para começar?
- isso já está maduro o suficiente para avançar?
- falta consolidar algo antes de passar adiante?
- o fluxo deve seguir, voltar ou parar?

Sem esses critérios, o sistema tende a:
- trocar de agente cedo demais
- planejar sem entendimento suficiente
- estruturar com base frágil
- iniciar execução por impulso
- confundir volume com avanço real

---

## Papel deste arquivo
Este arquivo define critérios base reutilizáveis para entrada e saída de etapas do sistema.

Ele não substitui:
- critérios específicos por tipo de trabalho
- quality gates técnicos
- validações humanas necessárias
- critérios locais de um projeto específico

Seu papel é oferecer um conjunto mínimo de disciplina operacional para o fluxo entre agentes e etapas.

---

## O que este arquivo deve fazer
Este arquivo deve:
- reduzir avanço prematuro
- deixar claro quando uma etapa ainda não deveria começar
- deixar claro quando uma etapa ainda não deveria encerrar
- melhorar a qualidade do roteamento
- melhorar a qualidade dos handoffs
- reforçar a diferença entre entendimento, estruturação, planejamento e execução

---

## O que este arquivo não deve fazer
Este arquivo não deve:
- virar checklist infinito
- exigir o mesmo rigor para qualquer contexto
- impedir avanço quando já existe base suficiente
- substituir julgamento proporcional
- duplicar quality gate técnico
- funcionar como burocracia ornamental

---

## Regra de proporcionalidade
Os critérios devem ser aplicados com proporcionalidade.

A exigência mínima depende de fatores como:
- tipo de trabalho
- criticidade da demanda
- risco de interpretação errada
- impacto do próximo passo
- quantidade de contexto já consolidado
- custo de avançar errado

Regra prática:
- demanda simples e pouco arriscada → critério mais leve
- demanda complexa, ambígua ou crítica → critério mais explícito

---

## Regra geral de avanço
Na dúvida, o fluxo deve favorecer:

1. entendimento
2. consolidação
3. estruturação
4. planejamento
5. execução
6. validação

Se uma etapa ainda não tem base mínima, o correto não é “seguir para ganhar velocidade”.

O correto é:
- consolidar melhor
- voltar uma etapa
- registrar a lacuna
- ou parar para validação

---

## Critérios base de entrada e saída por etapa

## 1. Entrada em análise

### Quando normalmente acontece
Quando a demanda ainda precisa ser melhor compreendida, revisada ou clarificada.

### Entrada mínima aceitável
Deve existir pelo menos:
- objetivo inicial da demanda
- material mínimo para leitura, mesmo que incompleto
- noção inicial do problema ou da dúvida
- indicação do que precisa ser entendido, revisado ou validado

### Não deve entrar em análise como se estivesse pronta quando
- o objetivo ainda está totalmente indefinido
- o material é inexistente e ninguém sabe o que quer descobrir
- a demanda real é estruturação ou planejamento, não leitura crítica

### Saída mínima aceitável da análise
A análise pode ser considerada minimamente concluída quando deixar explícito:
- o que foi entendido
- o que está confirmado
- o que é hipótese ou inferência
- quais lacunas permanecem
- quais incoerências, ambiguidades ou riscos foram encontrados
- qual parece ser o próximo movimento mais sensato

### Sinal de que não deve sair ainda
- resumo superficial sem separar fato e hipótese
- leitura sem apontar lacunas relevantes
- conclusão forte demais para evidência fraca
- próxima etapa ainda indefinida por falta de consolidação

---

## 2. Entrada em estruturação

### Quando normalmente acontece
Quando já existe entendimento mínimo e agora é preciso organizar o raciocínio, comparar alternativas, separar estado atual e visão futura ou desenhar uma solução.

### Entrada mínima aceitável
Deve existir pelo menos:
- problema minimamente compreendido
- contexto suficiente para evitar estruturação no escuro
- noção do estado atual ou do cenário existente
- principais restrições, riscos ou dúvidas minimamente visíveis

### Não deve entrar em estruturação quando
- o contexto ainda está confuso demais
- ainda não foi separado o que é fato e o que é hipótese
- a demanda real ainda é leitura crítica ou descoberta inicial

### Saída mínima aceitável da estruturação
A estruturação pode ser considerada minimamente concluída quando deixar explícito:
- estado atual
- visão futura, se houver
- alternativas relevantes, quando fizer sentido
- trade-offs principais
- recomendação inicial ou direção sugerida
- pontos que ainda dependem de validação

### Sinal de que não deve sair ainda
- proposta apresentada como fato consumado
- ausência de trade-offs quando há mais de um caminho possível
- mistura entre diagnóstico e proposta
- recomendação sem base suficiente

---

## 3. Entrada em planejamento

### Quando normalmente acontece
Quando o problema já está razoavelmente entendido e agora o foco principal é ordenar execução, definir etapas, dependências, riscos e próximos passos.

### Entrada mínima aceitável
Deve existir pelo menos:
- objetivo suficientemente claro
- base mínima de entendimento do problema
- noção do que já está decidido e do que ainda está em aberto
- restrições ou dependências principais identificadas

### Não deve entrar em planejamento quando
- o trabalho ainda depende de descoberta relevante
- a estrutura da solução ainda está nebulosa
- ainda falta separar hipótese, lacuna e decisão
- o sistema está tentando planejar para compensar falta de entendimento

### Saída mínima aceitável do planejamento
O planejamento pode ser considerado minimamente concluído quando deixar explícito:
- etapas principais
- ordem sugerida
- dependências relevantes
- riscos principais
- critérios de avanço minimamente claros
- próximo passo objetivo

### Sinal de que não deve sair ainda
- lista de tarefas sem lógica de sequência
- plano que esconde incertezas importantes
- ausência de dependências em demanda claramente dependente
- planejamento que parece implementação disfarçada

---

## 4. Entrada em execução

### Quando normalmente acontece
Quando já existe clareza suficiente sobre o que deve ser feito e a etapa anterior deixou base adequada para agir.

### Entrada mínima aceitável
Deve existir pelo menos:
- objetivo claro
- escopo minimamente delimitado
- direção definida
- risco principal conhecido
- critérios mínimos de validação conhecidos

### Não deve entrar em execução quando
- o entendimento ainda é frágil
- o plano ainda está implícito
- a solução ainda depende de decisão estrutural importante
- a demanda só parece urgente, mas continua confusa

### Saída mínima aceitável da execução
A execução pode ser considerada minimamente concluída quando existir:
- evidência de que o que foi proposto foi realmente produzido
- clareza sobre o que foi alterado ou entregue
- indicação do que foi validado e do que não foi
- registro do impacto percebido
- próxima condição de continuidade ou encerramento

### Sinal de que não deve sair ainda
- não está claro o que foi feito
- não existe validação mínima compatível com o contexto
- impacto da mudança continua desconhecido
- a entrega depende de interpretação informal para ser entendida

---

## 5. Entrada em revisão crítica ou validação

### Quando normalmente acontece
Quando já existe material, proposta, plano ou entrega que precisa ser avaliada antes de avançar ou encerrar.

### Entrada mínima aceitável
Deve existir pelo menos:
- artefato, decisão, plano ou entrega concreta para revisar
- objetivo da revisão explícito
- contexto suficiente para entender o que está sendo avaliado

### Não deve entrar em revisão quando
- ainda não existe material minimamente consolidado
- a revisão seria apenas formalidade vazia
- o problema ainda é falta de produção, não falta de avaliação

### Saída mínima aceitável da revisão
A revisão pode ser considerada minimamente concluída quando deixar explícito:
- o que está aceitável
- o que precisa de ajuste
- quais riscos permanecem
- se o material pode avançar, deve voltar ou precisa parar para validação humana

### Sinal de que não deve sair ainda
- revisão que apenas elogia ou reprova sem critério
- ausência de justificativa para aceitação ou bloqueio
- material crítico tratado sem apontar riscos remanescentes

---

## 6. Entrada em handoff

### Quando normalmente acontece
Quando uma etapa foi suficientemente concluída e outra pessoa, agente ou sessão futura precisa assumir sem reconstruir o contexto do zero.

### Entrada mínima aceitável
Deve existir pelo menos:
- saída mínima da etapa anterior
- motivo claro da transferência
- próximo passo esperado
- referências mínimas para continuidade

### Não deve entrar em handoff quando
- a etapa anterior ainda não produziu base suficiente
- a troca está acontecendo apenas para “andar o fluxo”
- o contexto continua confuso ou contraditório

### Saída mínima aceitável do handoff
O handoff pode ser considerado minimamente concluído quando deixar explícito:
- contexto resumido
- estado atual
- o que já está consolidado
- o que ainda está em aberto
- motivo da transferência
- próxima ação esperada
- referências relevantes
- alertas importantes

### Sinal de que não deve sair ainda
- o próximo agente precisaria recomeçar do zero
- a próxima etapa não está clara
- o objetivo atual ficou implícito
- as lacunas críticas não foram mencionadas

---

## Critérios transversais para permitir avanço
Independentemente da etapa, o fluxo só deve avançar quando estas perguntas puderem ser respondidas minimamente:

- qual é o objetivo atual?
- o que já está claro?
- o que ainda está em aberto?
- qual é o principal risco de seguir agora?
- por que a próxima etapa faz sentido neste momento?

Se essas perguntas não puderem ser respondidas, há forte sinal de que o avanço está cedo demais.

---

## Critérios transversais para bloquear avanço
O fluxo deve ser interrompido, devolvido ou pausado quando houver:
- ambiguidade crítica ainda não tratada
- ausência de saída mínima da etapa anterior
- conflito entre materiais ou interpretações
- troca de agente sem motivo claro
- tentativa de execução com base frágil
- risco alto sendo tratado como detalhe pequeno

Nesses casos, o sistema deve:
- voltar uma etapa
- consolidar melhor
- registrar lacuna ou bloqueio
- ou pedir validação humana

---

## Relação com roteamento
Roteamento responde:
- para onde isso deve ir?

Critério de entrada e saída responde:
- isso já pode ir?
- isso já pode sair?

Regra prática:
- roteamento escolhe o destino
- critério valida se já existe base para a passagem

Sem esse acoplamento, o sistema corre o risco de encaminhar corretamente uma demanda que ainda não está madura para avançar.

---

## Relação com handoffs
Handoff depende de saída mínima da etapa anterior.

Se a etapa ainda não produziu base adequada, não existe handoff bom possível.

Regra prática:
- critério de saída ruim gera handoff ruim
- handoff ruim gera retomada ruim

---

## Relação com quality gates
Critério de entrada e saída não substitui quality gate.

Diferença prática:
- critério de entrada e saída verifica maturidade da etapa
- quality gate verifica segurança mínima para avanço técnico

Os dois são complementares.

---

## Relação com projetos reais
Quando o fluxo estiver ligado a um projeto específico, os efeitos práticos destes critérios devem aparecer no próprio projeto, especialmente em:
- `docs/context/current-status.md`
- `docs/context/handoff.md`

Este arquivo não substitui esses registros.

Ele apenas define a disciplina base para que eles façam sentido.

---

## Sinais de uso correto
Este arquivo está sendo bem usado quando:
- o fluxo deixa de trocar de etapa cedo demais
- há menos improviso entre agentes
- a entrada em planejamento acontece com mais base
- handoffs ficam mais úteis
- o sistema para quando deveria parar
- a continuidade melhora

---

## Sinais de uso ruim
Há desvio quando:
- qualquer etapa começa sem base mínima
- qualquer produção já é tratada como saída suficiente
- o sistema usa os critérios como ritual vazio
- a exigência é igual para qualquer contexto
- o fluxo avança apesar de ambiguidade relevante

---

## Regra final
Critérios de entrada e saída existem para proteger a qualidade do fluxo, não para engessar o trabalho.

Seu papel é simples:
**garantir que cada etapa só comece ou termine quando já existir base mínima coerente para isso.**
