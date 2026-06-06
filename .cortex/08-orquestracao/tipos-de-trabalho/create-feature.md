# Tipo de trabalho: criação de feature

## Objetivo

Definir como o sistema deve conduzir a criação de uma feature técnica pontual em um projeto já preparado, desde o entendimento da demanda até a validação e o registro de continuidade, sem pular etapas e sem começar por código.

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
- [criterios-base](../criterios-de-entrada-e-saida/criterios-base.md)
- [roteamento-basico](../roteamento/roteamento-basico.md)

---

## Princípio central

Feature não começa por código.

Ela começa por entendimento da demanda, consulta ao contexto existente e consulta aos padrões técnicos relevantes. Só depois disso existe plano. Só depois do plano existe implementação.

Alterações relevantes de código, estrutura ou dependência devem ser precedidas de plano aprovado pelo usuário antes de execução. O sistema não deve assumir que entendeu a demanda o suficiente para avançar sem essa confirmação.

A meta deste fluxo não é "escrever o código mais rápido possível".  
A meta é criar uma feature que respeita o contexto, os padrões e a continuidade do projeto.

---

## Quando este tipo de trabalho se aplica

Usar este fluxo quando:

- o projeto já foi inicializado documentalmente e preparado tecnicamente
- a demanda é uma funcionalidade delimitada e pontual
- o contexto do projeto está disponível para consulta
- a feature não exige mudança estrutural ampla no projeto

---

## Quando este tipo de trabalho não se aplica

Não usar este fluxo como padrão quando:

- o projeto ainda não tem base documental (usar [novo-projeto](novo-projeto.md) antes)
- o projeto ainda não foi preparado tecnicamente (usar [setup-project](setup-project.md) antes)
- a mudança exigida é estrutural e ampla (usar [refatoracao](refatoracao.md))
- a demanda não está delimitada o suficiente para ser chamada de feature
- o objetivo é apenas revisar algo já feito (usar [review](review.md))

Nesses casos, outro tipo de trabalho deve ser usado.

---

## Perguntas que este fluxo deve responder

Antes de considerar o fluxo bem executado, o sistema deve conseguir responder minimamente:

- o que exatamente esta feature deve fazer?
- onde ela se encaixa na arquitetura existente?
- quais padrões técnicos devem ser respeitados?
- quais são as principais restrições ou dependências?
- o plano de implementação foi definido e aprovado antes de alterar código?
- a implementação foi validada minimamente?
- o status e o handoff foram atualizados?

---

## Agentes mais prováveis no fluxo

Os agentes mais comuns para criação de feature são:

1. [agente-analista](../../02-agentes/agente-analista.md)
2. [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
3. [agente-planejador](../../02-agentes/agente-planejador.md)

A ordem mais comum é:

- entender a demanda
- consultar contexto e padrões
- estruturar o plano
- executar
- validar

---

## Skills mais prováveis no fluxo

As skills mais comuns para este tipo de trabalho são:

- [skill-mapear-contexto](../../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) (etapa de fechamento)

---

## Fluxo recomendado

### Etapa 1: entendimento e delimitação da demanda

Objetivo:  
entender o que a feature deve fazer antes de qualquer outra ação.

Deve produzir:

- descrição clara da feature
- comportamento esperado
- critério mínimo de aceitação
- restrições conhecidas
- dúvidas que precisam ser resolvidas antes de avançar

Se a demanda ainda estiver ambígua demais para ser chamada de feature delimitada, não avançar. Solicitar clarificação ao usuário.

---

### Etapa 2: consulta ao contexto local

Objetivo:  
entender como a feature se encaixa no que já existe no projeto.

Deve produzir:

- leitura dos documentos relevantes em `docs/` do projeto
- identificação da área do código que será afetada
- entendimento de dependências internas
- riscos de impacto em outras partes do sistema

---

### Etapa 3: consulta a padrões técnicos relevantes

Objetivo:  
garantir que a implementação respeitará os padrões estabelecidos.

Deve verificar:

- padrões técnicos aplicáveis em `10-padroes-tecnicos/`
- padrões de componentes, arquitetura ou stack relevantes à feature
- restrições de qualidade definidas em `10-padroes-tecnicos/quality-gates/`

Se não houver padrão técnico aplicável, registrar essa ausência explicitamente.

---

### Etapa 4: plano de implementação

Objetivo:  
definir o que será feito, em que ordem e com quais critérios de validação, antes de alterar qualquer código.

Deve produzir:

- arquivos ou módulos que serão criados ou alterados
- ordem de implementação
- dependências entre as partes
- critério mínimo de validação
- o que não deve ser alterado nesta feature

Alterações relevantes de código, estrutura ou dependência devem ser apresentadas ao usuário nesta etapa e aguardar aprovação antes de avançar para implementação.

Se não for possível produzir um plano mínimo, não avançar para implementação.

---

### Etapa 5: implementação controlada

Objetivo:  
executar a feature respeitando o plano definido, sem expandir escopo.

A implementação deve buscar:

- passos pequenos e verificáveis quando possível
- aderência ao plano definido na etapa anterior
- sinais de expansão de escopo tratados como alerta, não como oportunidade

Se durante a implementação surgir algo que altere o plano de forma relevante, pausar e reavaliar com o usuário antes de continuar.

---

### Etapa 6: validação

Objetivo:  
verificar se a feature funciona conforme o critério de aceitação definido.

Deve produzir:

- evidência de que o comportamento esperado foi alcançado
- resultado de build, lint e testes quando aplicável à stack
- registro de comportamentos inesperados encontrados
- decisão sobre o que ficou fora do escopo desta feature

---

### Etapa 7: atualização de status e handoff

Objetivo:  
garantir que o projeto possa ser retomado com clareza.

Deve atualizar no projeto:

- `docs/context/current-status.md`
- `docs/context/handoff.md`

---

### Etapa 8: validação de fechamento (OBRIGATÓRIA)

**Status:** hard-required. Workflow NÃO pode ser declarado concluído sem este passo.

Objetivo:  
garantir que a documentação produzida nesta feature não contém pendências silenciosas — em particular, referências a arquivos que o workflow citou mas não criou.

Aplicar [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) sobre os arquivos criados ou editados na feature (`docs/features/<feature>.md`, `memory/learnings*.md`, `docs/context/current-status.md`, `docs/context/handoff.md`). A skill verifica:

- **Check 1:** placeholders pendentes (`{{...}}`, `<!-- TODO: ... -->`);
- **Check 2:** referências a arquivos que não existem (caso típico desta etapa);
- **Check 3:** EOF/newline final;
- **Check 4:** seções vazias com cabeçalho;
- **Check 6:** wikilinks fantasma (lista negra em `03-skills/wikilinks-fantasma.txt`).

(Check 5 — `.gitignore` mínimo — roda apenas em Init Project e Setup Project, não nesta etapa.)

Para cada referência pendurada, decidir entre:

- criar o arquivo agora (se a referência prometia conteúdo, ex: `memory/learnings_<feature>.md`);
- remover a referência;
- substituir por outra fonte que exista.

O relatório consolidado deve ser apresentado ao usuário **mesmo se zero problemas encontrados** (output mínimo obrigatório). A feature só pode ser declarada concluída após esta etapa.

---

## Saída mínima aceitável

Este fluxo só deve ser considerado minimamente concluído quando existir:

- descrição clara da feature implementada
- evidência de que o comportamento esperado foi alcançado
- resultado de build, lint e testes registrado, quando aplicável à stack
- status e handoff atualizados
- o que ficou fora do escopo registrado
- validação de fechamento executada (Checks 1, 2, 3, 4, 6 da skill)
- ⚠ Workflow não é considerado concluído sem relatório da skill (mesmo se vazio).

Sem isso, a feature pode estar funcionando mas o projeto está mais difícil de continuar.

---

## Critérios de entrada

Este fluxo pode começar quando houver pelo menos:

- projeto com base documental e preparação técnica existentes
- demanda delimitada o suficiente para ser chamada de feature
- contexto local acessível para consulta
- autorização para alterar código do projeto

---

## Critérios de saída

Este fluxo pode ser encerrado quando:

- a feature estiver implementada e validada
- o status e o handoff estiverem atualizados
- o que ficou fora do escopo estiver registrado

Encerrar este fluxo não significa que a feature é perfeita.  
Significa que ela está entregue com contexto suficiente para continuar.

---

## Sinais de uso correto

Este fluxo está sendo bem usado quando:

- a implementação começa depois do entendimento e do plano
- alterações relevantes são apresentadas ao usuário antes de executar
- os padrões técnicos são consultados antes de escrever código
- o escopo não se expande durante a implementação sem decisão explícita
- a validação acontece com base no critério de aceitação definido
- o status e o handoff são atualizados ao final

---

## Sinais de uso ruim

Há desvio quando:

- o código começa antes do entendimento da demanda
- alterações relevantes de estrutura ou dependência são feitas sem plano aprovado
- os padrões técnicos são ignorados
- o escopo cresce silenciosamente durante a implementação
- a validação é pulada
- o status e o handoff não são atualizados
- a feature entregue não tem critério de aceitação definido

---

## Relação com projetos reais

A documentação desta feature deve viver no próprio projeto.

Especialmente em:

- `docs/context/current-status.md`
- `docs/context/handoff.md`

Para padrões técnicos aplicáveis, consultar:

- `10-padroes-tecnicos/`

Este arquivo de orquestração não substitui esses documentos.  
Ele apenas define como conduzir bem esse tipo de trabalho.

---

## Regra final

Feature deve sair do estado de demanda e chegar ao estado de entrega validada com continuidade registrada.

A prioridade é simples:  
**entender, consultar contexto, planejar com aprovação, implementar com controle, validar e registrar.**
