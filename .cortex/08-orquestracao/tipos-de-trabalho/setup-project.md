# Tipo de trabalho: setup de projeto

## Objetivo

Definir como o sistema deve conduzir a preparação técnica de um projeto já inicializado, desde a verificação da stack até a validação mínima de execução, sem reabrir o processo de inicialização documental e sem começar por implementação de feature.

Relacionado a:

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
- [agente-planejador](../../02-agentes/agente-planejador.md)
- [skill-mapear-contexto](../../03-skills/skill-mapear-contexto.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)
- [novo-projeto](novo-projeto.md)
- [criterios-base](../criterios-de-entrada-e-saida/criterios-base.md)

---

## Princípio central

Setup técnico começa onde Init Project termina.

Ele não cria contexto documental. Ele assume que o projeto já possui base mínima e parte para preparação técnica objetiva: stack, dependências, build, lint, testes básicos, Git e validação mínima de execução.

A meta deste fluxo não é "construir a feature".  
A meta é garantir que o projeto está tecnicamente pronto para receber desenvolvimento com segurança.

---

## Fronteiras explícitas

Este fluxo:

- vem **depois** de [novo-projeto](novo-projeto.md), nunca antes
- **não substitui** o fluxo de inicialização documental
- **não cria** funcionalidade de produto
- **não resolve** dívida técnica ampla nem reescreve arquitetura

Qualquer evolução estrutural mais ampla do projeto deve ser tratada como pauta separada, com aprovação explícita.

---

## Quando este tipo de trabalho se aplica

Usar este fluxo quando:

- o projeto já passou pelo fluxo de novo projeto ou possui base documental mínima existente
- a stack ainda não está definida, configurada ou verificada
- as dependências ainda precisam ser instaladas ou auditadas
- não existe build, lint ou teste básico funcionando e a stack os exige
- o repositório Git ainda não foi inicializado ou o `.gitignore` está ausente ou inadequado
- o projeto precisa de validação mínima de execução antes de receber desenvolvimento

---

## Quando este tipo de trabalho não se aplica

Não usar este fluxo como padrão quando:

- o projeto ainda não tem base documental (usar [novo-projeto](novo-projeto.md) antes)
- o objetivo é criar uma feature pontual (usar [create-feature](create-feature.md))
- o objetivo é reorganizar algo que já existe e funciona (usar [refatoracao](refatoracao.md))
- a stack já está configurada e o projeto já executa sem problemas
- a preparação técnica já foi feita em sessão anterior e está registrada

Nesses casos, outro tipo de trabalho deve ser usado.

---

## Perguntas que este fluxo deve responder

Antes de considerar o fluxo bem executado, o sistema deve conseguir responder minimamente:

- qual é a stack definida para este projeto?
- as dependências estão instaladas e compatíveis?
- o build executa sem erro, quando aplicável à stack?
- existe lint configurado e passando, quando aplicável?
- existe cobertura mínima de teste, quando aplicável?
- o Git foi verificado? está inicializado com aprovação ou a exceção está registrada?
- o `.gitignore` está adequado para a estrutura do projeto?
- o projeto consegue ser executado localmente em estado mínimo?
- onde a continuidade do trabalho está registrada?

---

## Agentes mais prováveis no fluxo

Os agentes mais comuns para setup de projeto são:

1. [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
2. [agente-planejador](../../02-agentes/agente-planejador.md)

A ordem mais comum é:

- avaliar contexto e stack
- planejar configuração técnica
- executar e validar

---

## Skills mais prováveis no fluxo

As skills mais comuns para este tipo de trabalho são:

- [skill-mapear-contexto](../../03-skills/skill-mapear-contexto.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) (etapa de fechamento)

---

## Fluxo recomendado

### Etapa 1: leitura do contexto existente

Objetivo:  
entender o estado atual do projeto antes de qualquer configuração técnica.

Deve produzir:

- leitura do `CLAUDE.md` local do projeto
- leitura dos documentos em `docs/` disponíveis
- entendimento do objetivo do projeto
- identificação do que já está tecnicamente presente
- identificação do que está ausente ou incerto

Se o projeto não possuir base documental mínima, não avançar. Indicar ao usuário que o fluxo [novo-projeto](novo-projeto.md) deve ser executado primeiro.

---

### Etapa 2: avaliação e definição da stack

Objetivo:  
confirmar ou definir a stack técnica que o projeto usará.

Deve produzir:

- stack confirmada ou proposta (linguagem, framework, gerenciador de dependências)
- referência aos padrões técnicos relevantes em `10-padroes-tecnicos/stacks/`, quando existirem
- decisões ou pendências sobre a stack registradas

Se a stack ainda não estiver clara, não avançar para instalação de dependências.

---

### Etapa 3: instalação e verificação de dependências

Objetivo:  
garantir que as dependências do projeto estão instaladas e sem conflito.

Deve produzir:

- dependências instaladas
- ausências ou conflitos identificados e registrados
- versões fixadas quando relevante para segurança e reprodutibilidade

---

### Etapa 4: configuração de build, lint e qualidade mínima

Objetivo:  
garantir que o projeto possui pipeline mínima de qualidade funcionando, quando aplicável à stack.

Deve produzir, quando aplicável:

- build executando sem erro
- lint configurado e passando, ou justificativa de ausência registrada explicitamente
- teste básico configurado e passando
- `quality-gates` verificados quando existirem em `10-padroes-tecnicos/quality-gates/`

Se build, lint ou testes não forem aplicáveis à stack em uso, registrar a justificativa explicitamente antes de avançar.

---

### Etapa 5: verificação de Git e `.gitignore`

Objetivo:  
verificar o estado do repositório e garantir proteção adequada da estrutura do projeto.

Deve verificar:

- se o repositório Git está inicializado
- se o `.gitignore` protege adequadamente: governança local, `docs/`, memória de agentes, dependências e artefatos locais
- se há necessidade de configuração de remote ou branch principal

O sistema não deve executar `git init` sem aprovação explícita do usuário.  
Se o Git não estiver inicializado, apresentar a situação ao usuário e aguardar decisão.  
A ausência de Git deve ser registrada como exceção explícita, não tratada como padrão silencioso.

---

### Etapa 6: validação de execução mínima e atualização de continuidade

Objetivo:  
confirmar que o projeto está tecnicamente pronto para receber desenvolvimento e registrar esse estado.

Deve produzir:

- confirmação de que o projeto executa em estado mínimo
- lacunas técnicas remanescentes registradas
- `docs/context/current-status.md` atualizado
- `docs/context/handoff.md` atualizado com o estado técnico alcançado e o próximo passo sugerido

---

### Etapa 7: validação de fechamento (OBRIGATÓRIA)

**Status:** hard-required. Workflow NÃO pode ser declarado concluído sem este passo.

Objetivo:  
garantir que o material produzido neste fluxo não contém pendências silenciosas.

Aplicar [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) sobre os arquivos criados ou editados durante o setup (configurações, docs atualizados, scripts). A skill verifica:

- **Check 1:** placeholders pendentes (`{{...}}`, `<!-- TODO: ... -->`);
- **Check 2:** referências a arquivos que não existem;
- **Check 3:** EOF/newline final;
- **Check 4:** seções vazias com cabeçalho;
- **Check 5:** `.gitignore` mínimo (10 entradas da regra P11.1 — também roda em Setup Project, complementando a Etapa 5);
- **Check 6:** wikilinks fantasma (lista negra em `03-skills/wikilinks-fantasma.txt`).

Apresentar o relatório ao usuário **mesmo se zero problemas encontrados** (output mínimo obrigatório) e decidir, por achado, entre corrigir agora ou registrar como pendência em `docs/context/current-status.md`. O fluxo só pode ser declarado concluído após esta etapa.

---

## Saída mínima aceitável

Este fluxo só deve ser considerado minimamente concluído quando existir:

- stack definida e registrada
- dependências instaladas e verificadas
- build executando sem erro, quando aplicável à stack
- lint configurado, quando aplicável, ou justificativa de ausência registrada
- testes básicos passando, quando aplicável à stack
- Git verificado, inicializado com aprovação explícita ou exceção registrada
- `.gitignore` adequado à estrutura do projeto (Check 5 da skill aplicado)
- validação mínima de execução concluída
- status e handoff atualizados com o estado técnico alcançado
- validação de fechamento executada (todos os 6 checks da skill)
- ⚠ Workflow não é considerado concluído sem relatório da skill (mesmo se vazio).

Sem isso, o projeto ainda não está pronto para receber desenvolvimento com segurança.

---

## Critérios de entrada

Este fluxo pode começar quando houver pelo menos:

- base documental mínima existente (resultado de [novo-projeto](novo-projeto.md) ou equivalente)
- objetivo técnico do setup claro
- stack desejada ou evidência da stack existente
- autorização para configurar e alterar a estrutura técnica do projeto

---

## Critérios de saída

Este fluxo pode ser encerrado quando:

- a stack estiver definida e funcionando
- as dependências estiverem instaladas e verificadas
- o build e o lint estiverem passando, quando aplicável à stack
- o Git estiver verificado e adequadamente configurado, ou exceção registrada explicitamente
- a continuidade estiver registrada em status e handoff

Encerrar este fluxo não significa que o projeto está completo.  
Significa que ele está tecnicamente pronto para receber desenvolvimento.

---

## Sinais de uso correto

Este fluxo está sendo bem usado quando:

- o setup começa pela leitura do contexto existente, não pela instalação de dependências
- a stack é confirmada antes de qualquer configuração
- build, lint e testes são avaliados com proporcionalidade à stack em uso
- o Git é verificado com aprovação do usuário antes de qualquer inicialização
- as lacunas técnicas ficam explícitas
- o status e o handoff são atualizados ao final
- o fluxo não avança para feature sem encerrar o setup

---

## Sinais de uso ruim

Há desvio quando:

- o sistema começa instalando dependências sem ler o contexto
- a stack é assumida sem confirmação
- build, lint ou testes são exigidos sem verificar se se aplicam à stack
- o Git é inicializado sem aprovação do usuário
- nenhuma lacuna técnica é registrada
- o status e o handoff não são atualizados
- o fluxo começa a criar feature no meio do setup

---

## Relação com projetos reais

A documentação técnica deste fluxo deve viver no próprio projeto.

Especialmente em:

- `docs/context/current-status.md`
- `docs/context/handoff.md`

Para referências de stack e padrões técnicos, consultar:

- `10-padroes-tecnicos/stacks/`
- `10-padroes-tecnicos/quality-gates/`

Este arquivo de orquestração não substitui esses documentos.  
Ele apenas define como conduzir bem esse tipo de trabalho.

---

## Regra final

Setup de projeto deve sair do estado de base documental existente e chegar ao estado de projeto tecnicamente pronto para receber desenvolvimento.

A prioridade é simples:  
**ler o contexto, confirmar a stack, configurar com controle, validar execução e registrar continuidade.**
