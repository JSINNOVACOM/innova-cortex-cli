# Componente: frontend web

## Objetivo
Definir responsabilidades, limites e padrões gerais para componentes de frontend web, independentemente da stack usada.

Relacionado a:
- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)

---

## Princípio central
Frontend web é um **tipo de componente**, não uma stack.

Este arquivo existe para orientar o papel do frontend no sistema, sem misturar isso com decisões específicas de Angular, React, Next ou outra tecnologia.

A pergunta central aqui é:
**“o que cabe a um frontend web fazer dentro do sistema?”**

---

## O que este componente representa
`frontend-web` representa a camada de interface web com a qual o usuário interage.

Ele normalmente é responsável por:
- experiência de navegação
- renderização da interface
- captura de interação do usuário
- comunicação com backend
- apresentação de dados
- tratamento de estado de interface
- feedback visual de sucesso, erro e carregamento

---

## O que entra aqui
Este arquivo deve conter padrões e responsabilidades como:

- papel do frontend dentro da solução
- o que deve ou não ficar no cliente
- relação com autenticação e autorização no front
- navegação e roteamento do usuário
- boas práticas de tratamento de erro visual
- acessibilidade
- responsividade
- performance percebida
- observabilidade no cliente
- consumo de API

---

## O que não entra aqui
Este arquivo não deve virar:

- guia específico de Angular
- guia específico de React
- guia específico de Next
- convenção detalhada de hooks, módulos ou providers
- tutorial de framework
- dump de componentes de UI

Essas coisas pertencem às stacks específicas.

---

## Responsabilidades do frontend web

### 1. Apresentação e interação
O frontend deve:
- apresentar informações de forma clara
- responder adequadamente à interação do usuário
- manter consistência visual e funcional
- tornar o fluxo de uso compreensível

---

### 2. Estado de interface
O frontend deve gerenciar adequadamente:
- loading
- erro
- sucesso
- estado de tela
- navegação entre páginas ou áreas
- filtros, ordenações e interações locais de UI

Nem todo estado precisa virar estado global.

---

### 3. Comunicação com backend
O frontend deve:
- consumir contratos de forma coerente
- tratar falhas de integração sem colapsar a experiência
- evitar acoplamento excessivo à implementação interna do backend
- lidar com respostas inesperadas de forma controlada

---

### 4. Segurança no cliente
O frontend não deve assumir responsabilidade de segurança que pertence ao backend.

O frontend pode:
- controlar visibilidade de interface
- esconder ações indisponíveis
- sinalizar sessão expirada
- tratar autenticação e renovação de sessão no cliente, quando aplicável

Mas não deve:
- confiar que restrição visual substitui autorização real
- tratar lógica crítica de segurança como responsabilidade exclusiva da UI

---

### 5. Acessibilidade e usabilidade
O frontend deve buscar minimamente:
- legibilidade
- navegação compreensível
- foco visível
- feedback claro de erro
- uso adequado de elementos interativos
- experiência razoável em diferentes tamanhos de tela

---

### 6. Observabilidade no cliente
Quando fizer sentido, o frontend deve oferecer pelo menos:
- logs úteis em desenvolvimento
- sinalização de erro ao usuário
- rastreabilidade mínima de falhas relevantes
- apoio à investigação de problemas reais de uso

---

## Limites do frontend web
O frontend não deve concentrar:
- regra de negócio crítica que deveria estar protegida no backend
- validação de segurança como fonte única de verdade
- dependência excessiva de detalhes internos de serviços
- decisões técnicas que tornem a interface impossível de manter

Regra prática:
- UX, interação e estado de tela → normalmente no frontend
- regra crítica, segurança real, persistência e decisão final → normalmente fora do frontend

---

## Relação com stacks
Este componente pode ser implementado com stacks diferentes, por exemplo:
- Angular + TypeScript
- React + TypeScript
- Next.js
- Vue

As regras específicas de cada uma devem viver em:
- `10-padroes-tecnicos/stacks/`

Este arquivo continua focado no papel do componente.

---

## Qualidade mínima esperada
Um frontend web minimamente saudável deve buscar:
- clareza de navegação
- erro tratado de forma visível
- carregamento tratado de forma coerente
- consumo de API previsível
- estrutura compreensível
- experiência minimamente responsiva
- acessibilidade mínima razoável

---

## Perguntas úteis para este componente
Ao trabalhar com frontend web, vale responder:

- o que realmente precisa ficar no cliente?
- o que depende do backend?
- o erro está compreensível para o usuário?
- a tela continua utilizável quando a API falha?
- o fluxo está claro?
- o estado de loading/sucesso/erro está bem tratado?
- a interface está acessível o suficiente para o contexto?

---

## Sinais de bom uso
Este componente está sendo bem tratado quando:

- a interface é compreensível
- o front não tenta absorver responsabilidade indevida
- há boa separação entre UI e regra crítica
- a navegação faz sentido
- erros e carregamentos são tratados com clareza
- a stack específica consegue ser trocada sem reescrever o conceito de componente

---

## Sinais de uso ruim
Há desvio quando:

- lógica crítica de negócio migra para a UI sem necessidade
- o frontend depende fortemente de detalhes internos do backend
- loading e erro são tratados de forma improvisada
- acessibilidade é ignorada por completo
- a interface fica difícil de entender ou manter
- regras específicas de framework começam a contaminar este arquivo

---

## Regra final
`frontend-web` existe para definir o papel da interface web no sistema.

Seu papel é simples:
**organizar como a camada de interface deve se comportar, sem depender de uma tecnologia específica para existir.**
