# Componente: backend API

## Objetivo
Definir responsabilidades, limites e padrões gerais para componentes de backend API, independentemente da stack usada.

Relacionado a:
- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)
- [quality-gate-base](../quality-gates/quality-gate-base.md)

---

## Princípio central
Backend API é um **tipo de componente**, não uma stack.

Este arquivo existe para orientar o papel do backend no sistema, sem misturar isso com decisões específicas de Java, Spring, Node, Python, FastAPI ou outra tecnologia.

A pergunta central aqui é:
**“o que cabe a um backend API fazer dentro do sistema?”**

---

## O que este componente representa
`backend-api` representa a camada responsável por expor capacidades do sistema por meio de contratos consumíveis por outros componentes, clientes ou integrações.

Ele normalmente é responsável por:
- expor operações e dados de forma controlada
- aplicar regras de negócio ou orquestração compatíveis com seu papel
- proteger acesso e integridade do sistema
- integrar dependências externas quando necessário
- persistir ou consultar dados, diretamente ou por camadas internas
- tratar erro de forma previsível
- oferecer rastreabilidade mínima da execução

---

## O que entra aqui
Este arquivo deve conter padrões e responsabilidades como:
- papel do backend dentro da solução
- exposição de contratos
- organização de entradas e saídas
- validação e proteção do fluxo
- tratamento de erro
- integração com outros sistemas
- observabilidade mínima
- limites de responsabilidade da API
- relação com persistência e domínio

---

## O que não entra aqui
Este arquivo não deve virar:
- guia específico de Spring
- guia específico de FastAPI
- guia específico de Express
- tutorial de ORM
- catálogo de endpoints de um projeto
- regra de negócio local promovida cedo demais a padrão geral

Essas coisas pertencem às stacks específicas ou aos projetos.

---

## Responsabilidades do backend API

### 1. Expor contratos claros
O backend deve oferecer contratos compreensíveis e previsíveis para quem o consome.

Buscar:
- entradas claras
- saídas coerentes
- respostas estáveis o suficiente para o contexto
- tratamento explícito de casos de erro

Evitar:
- contrato implícito demais
- retorno inconsistente entre operações semelhantes
- comportamento que só pode ser entendido lendo implementação interna

---

### 2. Orquestrar fluxos sem confundir responsabilidades
O backend pode coordenar chamadas, validações, persistência e integração.

Mas deve evitar concentrar tudo de forma opaca.

Buscar separar, quando fizer sentido:
- entrada da requisição
- validação de dados
- regra ou decisão relevante
- integração externa
- persistência
- transformação de resposta

Pergunta útil:
**“esta API está orquestrando bem ou absorvendo responsabilidades demais?”**

---

### 3. Proteger a integridade do sistema
O backend não deve assumir que o cliente garantirá integridade, autorização ou consistência crítica.

O backend deve, quando aplicável:
- validar entradas relevantes
- aplicar autorização real
- impedir transições inválidas
- proteger regras críticas
- evitar persistência incoerente por confiança indevida no cliente

Regra prática:
segurança real, integridade e decisão final não devem depender apenas do frontend.

---

### 4. Tratar erro de forma previsível
Falha não deve produzir comportamento arbitrário.

Buscar:
- tratamento coerente de erro
- distinção razoável entre erro de cliente, erro de negócio e erro técnico
- mensagens úteis para consumo e suporte ao diagnóstico
- logs adequados sem expor informação indevida

Evitar:
- erro genérico para tudo
- exceções vazando sem controle
- respostas contraditórias entre cenários similares

---

### 5. Integrar dependências externas com disciplina
Quando a API depende de outros serviços, filas, bancos ou sistemas terceiros, isso deve ser tratado com previsibilidade.

Buscar:
- isolamento de detalhes de integração
- tratamento claro de indisponibilidade
- contratos internos compreensíveis
- proteção contra acoplamento excessivo ao sistema externo

Evitar:
- espalhar detalhes de integração pela aplicação
- depender de comportamento acidental do sistema externo
- ausência total de estratégia para falhas remotas

---

### 6. Manter observabilidade mínima
Um backend API minimamente saudável deve permitir investigar comportamento relevante.

Buscar, quando aplicável:
- logs úteis
- correlação mínima de requisições ou fluxos
- sinalização de falhas
- apoio a diagnóstico de erro real

Observabilidade não precisa nascer sofisticada.
Mas não deve ser completamente ignorada em fluxos importantes.

---

### 7. Manter fronteiras razoáveis com persistência e domínio
O backend não deve virar mero pass-through sem responsabilidade, nem concentrar acoplamento estrutural absurdo ao banco.

Buscar:
- fronteiras compreensíveis
- transformação controlada de dados
- proteção de regra relevante
- clareza entre contrato externo e modelo interno

Evitar:
- resposta pública moldada diretamente por detalhe acidental de tabela
- operação crítica dependente de estrutura interna exposta sem mediação
- mistura total entre modelo de transporte, modelo interno e persistência

---

## Limites do backend API
O backend API não deve concentrar sem critério:
- interface de usuário
- regra visual
- conhecimento excessivo de detalhes internos do cliente
- lógica transversal espalhada sem dono claro
- acoplamento estrutural desnecessário com tudo ao mesmo tempo

Regra prática:
- contrato, proteção, orquestração e integridade → normalmente no backend
- experiência visual e interação direta com usuário → normalmente fora do backend

---

## Relação com stacks
Este componente pode ser implementado com stacks diferentes, por exemplo:
- Java + Spring
- Node.js
- Python + FastAPI
- Go

As regras específicas de cada uma devem viver em:
- `10-padroes-tecnicos/stacks/`

Este arquivo continua focado no papel do componente.

---

## Qualidade mínima esperada
Um backend API minimamente saudável deve buscar:
- contrato compreensível
- tratamento coerente de erro
- validação compatível com o contexto
- integridade mínima do fluxo
- observabilidade razoável
- estrutura legível
- impacto de mudança minimamente entendível

---

## Perguntas úteis para este componente
Ao trabalhar com backend API, vale responder:
- o contrato está claro para quem consome?
- a API está protegendo a integridade do sistema?
- os erros estão previsíveis e úteis?
- o backend está assumindo responsabilidade indevida de outras camadas?
- a integração com dependências externas está disciplinada?
- a observabilidade mínima existe?

---

## Sinais de bom uso
Este componente está sendo bem tratado quando:
- contratos são mais previsíveis
- regras críticas não ficam delegadas ao cliente
- integrações são tratadas com mais clareza
- erros ficam mais coerentes
- a estrutura continua sustentável
- a stack específica pode variar sem mudar o conceito do componente

---

## Sinais de uso ruim
Há desvio quando:
- a API só repassa tudo sem critério
- contratos mudam por detalhe interno sem necessidade
- regra crítica fica exposta ao cliente
- tratamento de erro é improvisado
- integração externa contamina toda a aplicação
- o backend vira bloco monolítico sem fronteiras mínimas

---

## Regra final
`backend-api` existe para definir o papel da camada de API no sistema.

Seu papel é simples:
**organizar como a camada de backend deve expor, proteger e sustentar capacidades do sistema com clareza e previsibilidade.**
