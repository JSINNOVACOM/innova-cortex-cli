# Tipo de trabalho: revisão

## Objetivo

Definir como o sistema deve conduzir a revisão de uma entrega técnica, documental ou de fluxo, avaliando aderência a padrões, qualidade e governança, com distinção clara entre os tipos de falha encontrados.

Relacionado a:

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-analista](../../02-agentes/agente-analista.md)
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
- [agente-planejador](../../02-agentes/agente-planejador.md)
- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)
- [criterios-base](../criterios-de-entrada-e-saida/criterios-base.md)
- [handoff-entre-agentes](../handoffs/handoff-entre-agentes.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)

---

## Princípio central

Revisão começa por identificar claramente o que está sendo revisado e qual é o critério esperado.

Sem isso, a leitura vira opinião e a revisão perde utilidade operacional.

A meta deste fluxo não é "encontrar problemas".  
A meta é produzir uma avaliação que distinga com clareza o que está correto, o que está inadequado e qual é a natureza de cada inadequação.

---

## Quando este tipo de trabalho se aplica

Usar este fluxo quando:

- uma entrega foi concluída e precisa ser avaliada antes de avançar
- um documento, decisão ou fluxo precisa de leitura crítica estruturada
- há suspeita de falha técnica, documental, de fluxo ou de ambiente
- os critérios de saída de uma etapa precisam ser verificados formalmente
- um agente ou usuário solicita revisão explicitamente

---

## Quando este tipo de trabalho não se aplica

Não usar este fluxo como padrão quando:

- nada foi entregue ainda (não há objeto de revisão)
- o objetivo é criar algo novo (usar outro fluxo apropriado)
- o objetivo é reorganizar estrutura ampla (usar [refatoracao](refatoracao.md))
- o objetivo é apenas retomar e continuar um trabalho pausado

Nesses casos, outro tipo de trabalho deve ser usado.

---

## Tipos de falha que este fluxo distingue

Esta distinção é parte central do fluxo. Toda falha identificada deve ser classificada em uma das quatro categorias:

### Falha técnica
Problema no código, build, lint, teste ou configuração técnica.  
Exemplos: código que não compila, teste que falha, lint com erro não tratado, dependência incompatível.

### Falha de fluxo
Etapa de orquestração pulada, critério de entrada ou saída ignorado, handoff incompleto, agente atuando fora do seu escopo.  
Exemplos: feature implementada sem plano, setup feito antes de Init Project, handoff sem próximo passo definido.

### Falha de contexto
Documentação desatualizada, status incorreto, memória desalinhada com o estado real do projeto, decisão tomada com base em informação incorreta.  
Exemplos: `current-status.md` desatualizado, handoff sem registro de pontos abertos, hipótese tratada como fato.

### Falha de harness
Problema no ambiente de execução, ferramenta ou configuração de infraestrutura que não pertence ao código da aplicação.  
Exemplos: variável de ambiente ausente, versão de ferramenta incompatível, script de build quebrado por mudança de ambiente.

---

## Perguntas que este fluxo deve responder

Antes de considerar o fluxo bem executado, o sistema deve conseguir responder minimamente:

- o que exatamente está sendo revisado?
- qual é o critério esperado para esta entrega?
- o que está correto e aderente?
- o que está inadequado e por quê?
- qual é a natureza de cada inadequação (técnica, fluxo, contexto, harness)?
- quais são as recomendações por categoria?
- o resultado da revisão foi registrado?

---

## Agentes mais prováveis no fluxo

O agente mais comum para revisão é:

1. [agente-analista](../../02-agentes/agente-analista.md)

Dependendo do escopo da revisão, pode haver apoio de:

- [agente-arquiteto](../../02-agentes/agente-arquiteto.md), quando a revisão envolve decisões estruturais
- [agente-planejador](../../02-agentes/agente-planejador.md), quando a revisão gera lista de ações corretivas

---

## Skills mais prováveis no fluxo

A skill mais comum para este tipo de trabalho é:

- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)

E uma skill na etapa de fechamento:

- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)

---

## Fluxo recomendado

### Etapa 1: identificação do objeto e do critério

Objetivo:  
deixar explícito o que está sendo revisado e qual padrão deve ser atendido.

Deve produzir:

- descrição do objeto de revisão (código, documento, decisão, fluxo)
- critério esperado (padrão técnico, checklist de qualidade, critério de saída de etapa)
- escopo delimitado (o que está dentro e o que está fora desta revisão)

Se o objeto não estiver claro ou o critério não existir, solicitar clarificação antes de avançar.

---

### Etapa 2: leitura crítica

Objetivo:  
examinar o objeto de revisão com atenção ao critério definido.

Deve produzir:

- lista do que está correto e aderente
- lista do que está inadequado, com descrição objetiva de cada item
- separação clara entre fato observado e interpretação

---

### Etapa 3: classificação das falhas

Objetivo:  
categorizar cada inadequação encontrada em um dos quatro tipos.

Para cada falha identificada, deve explicitar:

- descrição objetiva do que foi observado
- classificação: técnica / fluxo / contexto / harness
- impacto percebido
- evidência que sustenta a classificação

---

### Etapa 4: recomendações por categoria

Objetivo:  
propor ação corretiva específica para cada falha classificada.

Deve produzir, por categoria:

- o que deve ser corrigido
- sugestão de como corrigir
- se a correção é bloqueante para avançar ou apenas recomendada
- se a falha exige aprovação humana antes de agir

---

### Etapa 5: registro do resultado

Objetivo:  
garantir que a revisão produziu um resultado rastreável.

Deve registrar:

- resumo da revisão (objeto, critério, resultado geral)
- lista de falhas classificadas
- recomendações
- próximos passos sugeridos

Se o projeto tiver `docs/context/`, o resultado deve ser referenciado ou registrado lá.

---

### Etapa 6: validação de fechamento (OBRIGATÓRIA)

**Status:** hard-required. Workflow NÃO pode ser declarado concluído sem este passo.

Objetivo:  
garantir que o relatório de revisão produzido não contém pendências silenciosas.

Aplicar [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) sobre os arquivos criados ou editados pela revisão (relatório de revisão, `docs/context/current-status.md`, `docs/context/handoff.md` quando atualizados). A skill verifica:

- **Check 1:** placeholders pendentes (`{{...}}`, `<!-- TODO: ... -->`);
- **Check 2:** referências a arquivos que não existem;
- **Check 3:** EOF/newline final;
- **Check 4:** seções vazias com cabeçalho;
- **Check 6:** wikilinks fantasma (lista negra em `03-skills/wikilinks-fantasma.txt`).

(Check 5 — `.gitignore` mínimo — roda apenas em Init Project e Setup Project, não nesta etapa.)

O relatório consolidado deve ser apresentado ao usuário **mesmo se zero problemas encontrados** (output mínimo obrigatório). Achados devem ser corrigidos ou registrados como pendência antes do encerramento da revisão.

---

## Saída mínima aceitável

Este fluxo só deve ser considerado minimamente concluído quando existir:

- objeto de revisão identificado com clareza
- critério utilizado explicitado
- o que está correto registrado
- falhas classificadas nas categorias corretas
- recomendações produzidas por categoria
- resultado registrado de forma rastreável
- validação de fechamento executada (Checks 1, 2, 3, 4, 6 da skill)
- ⚠ Workflow não é considerado concluído sem relatório da skill (mesmo se vazio).

Sem isso, a revisão foi apenas uma leitura sem saída operacional.

---

## Critérios de entrada

Este fluxo pode começar quando houver pelo menos:

- uma entrega, documento, decisão ou fluxo disponível para revisão
- algum critério de qualidade identificável (padrão técnico, checklist, critério de saída)
- autorização para avaliar o objeto indicado

---

## Critérios de saída

Este fluxo pode ser encerrado quando:

- todas as falhas encontradas estiverem classificadas
- as recomendações estiverem registradas
- o próximo passo estiver claro (corrigir, aprovar, rever abordagem)

Encerrar este fluxo não significa que tudo está correto.  
Significa que a revisão produziu saída útil para decisão.

---

## Sinais de uso correto

Este fluxo está sendo bem usado quando:

- o critério de revisão é explicitado antes de começar a leitura
- as falhas são classificadas por tipo, não listadas em bloco genérico
- existe separação entre o que está correto e o que está inadequado
- as recomendações são proporcionais à gravidade de cada falha
- o resultado fica registrado de forma rastreável

---

## Sinais de uso ruim

Há desvio quando:

- a revisão começa sem critério definido
- todas as falhas são tratadas como do mesmo tipo
- a revisão produz apenas uma lista de problemas sem classificação
- recomendações de correção são genéricas demais para ser acionáveis
- o resultado não é registrado em lugar nenhum
- a revisão vira julgamento de qualidade subjetivo sem base em padrão

---

## Relação com projetos reais

O resultado desta revisão deve viver no próprio projeto.

Especialmente em:

- `docs/context/current-status.md`
- `docs/context/handoff.md`
- `docs/analysis/`, quando a revisão gerar análise mais extensa

Para critérios de entrada e saída de etapas, consultar:

- [criterios-base](../criterios-de-entrada-e-saida/criterios-base.md)

Para checklist de qualidade do sistema, consultar:

- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)

Este arquivo de orquestração não substitui esses documentos.  
Ele apenas define como conduzir bem esse tipo de trabalho.

---

## Regra final

Revisão deve sair do estado de entrega não avaliada e chegar ao estado de resultado classificado, recomendado e registrado.

A prioridade é simples:  
**identificar o critério, ler com atenção, classificar por tipo de falha, recomendar com clareza e registrar.**
