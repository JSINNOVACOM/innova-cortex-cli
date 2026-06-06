# Stack: React + TypeScript

## Objetivo

Definir padrões técnicos iniciais para projetos que utilizem React com TypeScript, mantendo consistência, previsibilidade e boa separação de responsabilidades.

**Relacionado a:**

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)

## Princípio central

Este arquivo trata da stack concreta React + TypeScript. Ele não define o papel do componente no sistema.

Ele define como essa stack deve ser usada de forma consistente. A pergunta central aqui é: “como construir com React + TypeScript de forma organizada e sustentável?”

## O que esta stack representa

Esta stack é adequada para aplicações web em que React é usado como base de interface e TypeScript como camada de tipagem e segurança estrutural. Ela normalmente envolve:

- componentes de interface
- composição por features ou domínios
- uso de hooks
- consumo de APIs
- roteamento
- estado local e, quando necessário, estado compartilhado
- testes de interface e comportamento

## O que entra aqui

Este arquivo deve conter convenções como:

- organização de pastas
- padrão de componentes
- uso de hooks
- tipagem
- separação entre UI e lógica (Design System e State Management)
- consumo de API
- tratamento de estado
- testes
- build
- qualidade mínima da stack

## O que não entra aqui

Este arquivo não deve virar:

- guia genérico de frontend web
- tutorial completo de React
- catálogo de snippets
- padrão de um único projeto promovido cedo demais a padrão geral
- regra de negócio de produto

O papel do componente continua em: [10-padroes-tecnicos/componentes/frontend-web.md](../componentes/frontend-web.md)

## Princípios de uso da stack

### 1. TypeScript como padrão real

TypeScript não deve ser usado apenas de forma decorativa. Preferir:

- **Tipagem de Contratos:** Tratar respostas de API como território não confiável, tipando retornos e usando validação (ex: Zod) na borda da app.
    
- **Discriminated Unions:** Usar uniões para estados de componentes (ex: `type State = Loading | Success | Error`).
    
- **Tipagem explícita** quando relevante e tipos reaproveitáveis.
    
- **Evitar any** sem justificativa e reduzir inferência confusa em partes críticas.
    

### 2. Separar UI de lógica

Componentes não devem concentrar tudo ao mesmo tempo. Buscar separar, quando fizer sentido:

- apresentação (view pura)
- regras de exibição
- orquestração de chamadas
- transformação de dados
- **Separação de Estado:** Diferenciar claramente _Server State_ (dados da API) de _UI State_ (estado local de interface).

### 3. Uso Disciplinado do Design System

Caso o projeto utilize uma biblioteca padrão de componentes (Design System):

- **Consumo sobre Invenção:** Sempre verificar se o componente já existe na biblioteca antes de criar um novo.
    
- **Extensão de Props:** Ao criar componentes que envolvem o DS, sempre estender as interfaces originais da biblioteca.
    
- **Uso de Tokens:** Respeitar estritamente os tokens de design (cores, espaçamentos) da biblioteca, evitando valores "hardcoded".
    

### 4. Hooks com responsabilidade clara

Hooks devem existir para encapsular comportamento ou estado reutilizável.

- **Data Hooks:** Especializados em abstrair a busca e mutação de dados.
- **Logic Hooks:** Especializados em gerenciar fluxos complexos de UI ou regras locais.
- Pergunta útil: “este hook deixa a leitura mais clara ou só moveu a complexidade de lugar?”

### 5. Organização orientada a compreensão (Colocation)

A organização deve favorecer a leitura e a localidade da informação. Preferir:

- **Regra da Proximidade:** Manter testes, estilos e tipos específicos junto ao arquivo do componente (Colocation).
    
- **Estrutura por Features:** Isolar componentes que pertencem a apenas um domínio dentro de sua respectiva pasta de feature.
    
- Tornar claro o que é componente global, hook, integração ou utilitário.
    

### 6. Consumo de API com previsibilidade

A stack deve tratar integração com backend de forma disciplinada.

- Padronizar forma de chamada e centralizar em services ou hooks.
- Tratar loading, erro e sucesso com consistência.
- Reduzir acoplamento da UI ao detalhe bruto da API.

### 7. Estado com proporcionalidade

Nem todo dado precisa de estado global.

- Preferir estado local quando suficiente.
- Utilizar ferramentas de cache para dados de servidor (ex: React Query) para evitar inflar o estado global da aplicação.
- Pergunta útil: “este estado realmente precisa ser global?”
    

---

## Organização recomendada

A estrutura pode variar, mas deve deixar claro pelo menos:

- **src/components:** Componentes genéricos e globais.
- **src/features:** Módulos isolados por domínio (com seus próprios hooks e tipos).
- **src/hooks:** Hooks globais e utilitários de comportamento.
- **src/services:** Integrações e configurações de API.
- **src/types:** Tipagem global e contratos compartilhados.

---

## Qualidade mínima esperada

Uma base React + TypeScript minimamente saudável deve buscar:

- tipagem coerente e sem buracos de segurança (any)
- componentes legíveis e preferencialmente baseados no Design System
- hooks compreensíveis
- tratamento claro de loading e erro
- resiliência através de Error Boundaries por feature

## Testes

O nível de teste depende do contexto, mas a stack deve pelo menos permitir:

- testes de comportamento relevante (interação do usuário)
- validação de fluxos principais e integração com serviços
- suporte a evolução sem regressão cega
- Não transformar teste em ritual vazio.

---

## Relação com o componente

Esta stack normalmente se relaciona com: [10-padroes-tecnicos/componentes/frontend-web.md](../componentes/frontend-web.md)

**Regra prática:**

- `frontend-web` define o papel da interface
- `react-typescript` define como essa tecnologia deve ser usada

## Relação com quality gates

Esta stack deve conseguir atender, no mínimo, o: [10-padroes-tecnicos/quality-gates/quality-gate-base.md](../quality-gates/quality-gate-base.md)

---

## Sinais de bom uso

- TypeScript aumenta a previsibilidade e facilita o refactoring.
- Componentes são montados majoritariamente por composição de peças do Design System.
- A lógica de negócio está isolada da lógica de renderização.
- A estrutura continua sustentável para crescer.

## Sinais de uso ruim

- Criação de componentes que ignoram ou duplicam o Design System.
- Componentes viram blocos enormes com fetch e renderização misturados.
- Uso excessivo de `any` ou tipos "mentirosos" para satisfazer o compilador.
- O projeto depende mais do framework do que da clareza.

## Regra final

`react-typescript` existe para orientar o uso consistente da stack, não para impor burocracia. Seu papel é simples: ajudar a construir interfaces React com TypeScript de forma clara, tipada e sustentável.