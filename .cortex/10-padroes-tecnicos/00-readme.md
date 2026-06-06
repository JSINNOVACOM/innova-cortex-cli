# Padrões técnicos

## Objetivo

Concentrar referências técnicas estáveis do ecossistema, separando claramente:

- padrões por stack
- padrões por componente
- quality gates
- princípios arquiteturais

Relacionado a:

- [Claude](../Claude.md)
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)

---

## Princípio central

Nem toda regra técnica deve virar:

- regra global do sistema
- definição de agente
- skill isolada
- documentação de projeto

Esta pasta existe para guardar padrões técnicos reutilizáveis e relativamente estáveis, que possam orientar múltiplos projetos, agentes e fluxos de trabalho.

---

## Papel desta pasta

A pasta `10-padroes-tecnicos/` existe para responder perguntas como:

- quais convenções técnicas mínimas usamos nesta stack?
- quais responsabilidades cabem a este tipo de componente?
- quais gates técnicos mínimos devem ser observados?
- quais princípios arquiteturais valem de forma transversal?

---

## O que esta pasta deve conter

Ela deve conter referências técnicas estáveis, como:

- convenções por stack
- responsabilidades por tipo de componente
- quality gates mínimos
- princípios arquiteturais transversais
- padrões reutilizáveis que façam sentido além de um único projeto

---

## O que esta pasta não deve conter

Esta pasta não deve virar:

- documentação detalhada de um projeto específico
- tutorial completo de framework
- dumping de snippets
- repositório de decisões locais de projeto
- checklist infinito
- coleção de preferências sem critério claro

Se algo vale apenas para um único projeto, deve ficar no próprio projeto.

---

## Estrutura desta pasta
```text
10-padroes-tecnicos/  
  00-readme.md  
  stacks/  
  componentes/  
  quality-gates/  
  arquitetura/
```

---

## Papel de cada subpasta

### `stacks/`

Define padrões específicos da tecnologia usada.

A pergunta central aqui é:  
**“com que tecnologia isso está sendo construído?”**

Exemplos:

- Angular + TypeScript
- React + TypeScript
- Java + Spring
- Python + FastAPI
- PostgreSQL
- Redis

O foco aqui é a stack concreta:

- organização recomendada
- convenções da tecnologia
- estrutura de código
- testes
- validação
- build
- práticas específicas da stack

---

### `componentes/`

Define padrões do papel que uma peça exerce no sistema.

A pergunta central aqui é:  
**“que função isso cumpre no sistema?”**

Exemplos:

- frontend web
- backend API
- worker e jobs
- integrações
- biblioteca compartilhada
- banco de dados

O foco aqui é a responsabilidade do componente, independentemente da stack.

Exemplo prático:

- Angular, React e Next podem compartilhar o componente `frontend-web`
- Java, Python e Node podem compartilhar o componente `backend-api`

---

### `quality-gates/`

Define gates técnicos mínimos para avançar com segurança.

A pergunta central aqui é:  
**“o que precisa estar minimamente validado antes de seguir?”**

Exemplos:

- build mínimo
- lint/format
- testes mínimos
- observabilidade básica
- segurança mínima
- rollback conhecido
- impacto compreendido

Regra importante:  
quality gate deve ajudar a proteger, não engessar.

---

### `arquitetura/`

Define princípios e padrões técnicos transversais, não presos a uma stack específica.

A pergunta central aqui é:  
**“que princípios técnicos valem de forma mais ampla?”**

Exemplos:

- organização de código
- contratos e integrações
- modularização
- separação de responsabilidades
- versionamento de API
- tratamento de erro
- naming estrutural

---

## Diferença entre stacks e componentes

### Stack

Stack é a tecnologia concreta usada para construir algo.

Exemplos:

- Angular
- React
- Java + Spring
- Python + FastAPI

Pergunta:  
**“com que isso está sendo feito?”**

---

### Componente

Componente é o papel que aquela parte exerce no sistema.

Exemplos:

- frontend web
- backend API
- worker
- integrações

Pergunta:  
**“que papel isso exerce?”**

---

## Exemplo prático de uso

### Caso: frontend em Angular

- stack: `angular-typescript`
- componente: `frontend-web`

### Caso: API em Java

- stack: `java-spring`
- componente: `backend-api`

### Caso: frontend em React com API em Python

- stack do front: `react-typescript`
- stack do back: `python-fastapi`
- componente do front: `frontend-web`
- componente do back: `backend-api`

A separação existe para evitar misturar:

- regras específicas da tecnologia  
    com
- responsabilidades funcionais do componente

---

## Relação com skills

Skills podem usar padrões técnicos como apoio.

Regra prática:

- padrão técnico = referência estável
- skill = forma operacional de aplicar isso em uma tarefa

Ou seja:  
esta pasta não substitui skills, mas pode fundamentá-las.

---

## Relação com projetos reais

Se um padrão vale apenas para um projeto, ele não pertence aqui.

Esta pasta é para referências técnicas reutilizáveis.

Se a decisão for local, específica ou temporária, ela deve ficar:

- no projeto
- na spec
- na decisão técnica do projeto
- no documento local apropriado

---

## Regra de crescimento

Não começar com dezenas de stacks e componentes.

Criar apenas o que tiver uso real.

Sugestão de início enxuto:

- poucas stacks realmente usadas
- poucos componentes transversais
- um quality gate base
- alguns princípios arquiteturais gerais

Evitar:

- catálogo inflado
- padrões redundantes
- excesso de detalhe cedo demais
- documentação técnica ornamental

---

## Critério de bom uso

Esta pasta está sendo bem usada quando:

- padrões técnicos ficam mais fáceis de reutilizar
- decisões técnicas repetidas deixam de ser improvisadas
- múltiplos projetos conseguem aproveitar a mesma base
- agentes e skills ganham referência mais estável
- stack e componente deixam de ser confundidos

---

## Sinais de uso ruim

Há desvio quando:

- cada projeto reescreve tudo localmente sem necessidade
- a pasta vira coleção desordenada de preferências
- stack e componente são misturados
- quality gates viram burocracia excessiva
- padrões específicos de um projeto são promovidos cedo demais a padrão geral

---

## Regra final

Esta pasta existe para manter o ecossistema tecnicamente coerente sem transformar tudo em regra global.

Seu papel é simples:  
**oferecer referências técnicas reutilizáveis, estáveis e leves o suficiente para apoiar múltiplos projetos, stacks e agentes.**