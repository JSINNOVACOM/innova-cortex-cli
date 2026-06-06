# Estrutura documental de projetos

## Objetivo

Definir com clareza:

- a estrutura da governança Innova Cortex dentro de um projeto
- a estrutura documental do projeto em si
- os critérios para criação e evolução da pasta `docs/` em cada projeto

Relacionado a:
- [Claude](../Claude.md)
- [00-regras-gerais](00-regras-gerais.md)
- [01-limites-de-atuacao](01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](03-checklist-de-qualidade.md)
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [agente-analista](../02-agentes/agente-analista.md)
- [agente-planejador](../02-agentes/agente-planejador.md)
- [skill-iniciar-projeto](../03-skills/skill-iniciar-projeto.md)
- [skill-mapear-contexto](../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../03-skills/skill-revisar-documento.md)

---

## Convenção de path neste documento

Este documento usa `.cortex/` como o path da governança Innova Cortex dentro do projeto (modelo de instalação padrão — governança copiada para uma pasta interna do projeto, com path relativo).

Se sua instalação usa outra localização (ex.: governança vivendo num diretório externo de notas pessoais), substitua mentalmente. As regras valem da mesma forma.

---

## Princípio central

A governança Innova Cortex e a documentação do projeto não são a mesma coisa.

A primeira existe para orientar como o agente trabalha.

A segunda existe para registrar, organizar, analisar e evoluir um projeto específico.

Misturar essas duas camadas gera:
- duplicidade de informação
- acoplamento indevido
- dificuldade de manutenção
- navegação desnecessária
- aumento de contexto sem ganho real

---

## Camada 1: governança Innova Cortex

A pasta `.cortex/` é o ambiente de governança do harness dentro do projeto.

Ela guarda:
- regras gerais (`01-regras/`)
- agentes (`02-agentes/`)
- skills (`03-skills/`)
- templates (`04-templates/`)
- orquestração (`08-orquestracao/`)
- padrões técnicos (`10-padroes-tecnicos/`)
- arquivo central de orientação (`Claude.md`)

Exemplo:

```text
meu-projeto/
├── .cortex/
│   ├── Claude.md
│   ├── 01-regras/
│   ├── 02-agentes/
│   ├── 03-skills/
│   ├── 04-templates/
│   ├── 08-orquestracao/
│   └── 10-padroes-tecnicos/
├── CLAUDE.md
├── docs/
└── memory/
```

### O que esta camada faz

Esta camada existe para:
- orientar a atuação do agente
- preservar consistência operacional
- reduzir improviso estrutural
- registrar convenções e decisões do harness
- apoiar continuidade entre sessões e revisões

### O que esta camada não faz

Esta camada não existe para:
- substituir a documentação real do projeto
- centralizar contexto detalhado de projeto
- virar repositório principal de análises, planos ou entregas de projeto
- concentrar handoff e status do projeto em arquivos da governança

---

## Camada 2: documentação do projeto

A documentação real do projeto deve viver no próprio projeto.

Ela deve ser criada, evoluída e mantida perto do contexto real de trabalho.

### Princípio de localização

Se a informação pertence a um projeto específico, ela deve ficar no próprio projeto.

Especialmente quando envolver:
- entendimento do sistema atual
- visão de domínio
- avaliação do estado atual
- lacunas
- status vivo
- handoff
- rastreabilidade
- especificações
- decisões locais
- planos de execução do projeto
- entregas e artefatos produzidos para aquele projeto

### Estrutura mínima recomendada

Todo projeto deve começar, no mínimo, com esta base:

```text
docs/
  as-is/
    system-overview.md
  business/
    domain-overview.md
  analysis/
    current-state-assessment.md
    gaps-and-unknowns.md
  context/
    current-status.md
    handoff.md
memory/
  project-context.md
```

### Papel de cada documento mínimo

#### `docs/as-is/system-overview.md`
Registrar visão inicial do sistema, projeto ou solução no estado atual.

#### `docs/business/domain-overview.md`
Registrar entendimento inicial de domínio, negócio, atores, conceitos e regras percebidas.

#### `docs/analysis/current-state-assessment.md`
Registrar avaliação crítica do estado atual do projeto.

Inclui também os **fatos confirmados** sobre o estado atual — substituindo o papel de uma "memória de fatos" externa.

#### `docs/analysis/gaps-and-unknowns.md`
Registrar lacunas, dúvidas em aberto, **hipóteses em validação** e bloqueios para avanço seguro.

Inclui também as hipóteses ainda não confirmadas — substituindo o papel de uma "lista de hipóteses" externa.

#### `docs/context/current-status.md`
Registrar o estado vivo do trabalho naquele projeto, incluindo as **pendências e bloqueios atuais**.

Substitui o papel de uma "lista de pendências" externa.

#### `docs/context/handoff.md`
Registrar o ponto de parada e a passagem de contexto para retomada futura.

#### `memory/project-context.md`
Registrar a **memória persistente do projeto** — decisões duradouras, restrições conhecidas, pessoas-chave, o que evitar nas próximas sessões.

Substitui o papel de uma "memória operacional" externa.

---

## Memória e registros do projeto

A memória, os fatos confirmados, as hipóteses e as pendências do projeto vivem **no próprio projeto**, granularmente distribuídas por finalidade.

| Tipo de registro | Onde fica |
|---|---|
| Memória persistente do projeto | `memory/project-context.md` |
| Fatos confirmados | `docs/analysis/current-state-assessment.md` |
| Hipóteses em validação | `docs/analysis/gaps-and-unknowns.md` |
| Pendências e bloqueios | `docs/context/current-status.md` |

### Princípio

Não existe "memória global" ou "lista de pendências global" a partir desta governança publicada. Cada projeto é autônomo.

Se você usa o harness em múltiplos projetos e quer memória cross-projeto, isso é função planejada para versões futuras (CLI), não responsabilidade desta camada.

### Regra prática

- registro pertence ao projeto → vive no projeto, no documento granular adequado
- nada deve "vazar" para fora do projeto a menos que você tome essa decisão explicitamente

---

## Continuidade do projeto

A continuidade do projeto deve acontecer no próprio projeto.

Os dois arquivos centrais para isso são:
- `docs/context/current-status.md`
- `docs/context/handoff.md`

### Diferença entre eles

#### `docs/context/current-status.md`

Registra:
- onde o projeto está agora
- o que já foi levantado
- o que está em andamento
- o que ainda falta
- prioridades
- bloqueios e pendências
- próxima ação recomendada

#### `docs/context/handoff.md`

Registra:
- onde o trabalho parou
- última frente analisada
- o que já está pronto
- o que ainda precisa acontecer
- próximos passos imediatos
- alertas para retomada

### Regra de uso

Esses dois arquivos devem concentrar a continuidade do projeto.

Não existe arquivo externo paralelo de continuidade. A fonte é única e local.

---

## Portabilidade dos documentos

A documentação do projeto deve ser portável e legível em qualquer ambiente — IDE, GitHub, diff de PR, ferramenta de edição genérica.

### Regras práticas

- usar **Markdown padrão** em todos os arquivos
- usar **caminhos textuais relativos** para referenciar outros arquivos do projeto (ex.: `docs/context/handoff.md`)
- evitar dependência de qualquer ferramenta de edição específica para que o documento faça sentido

### Motivo

Isso reduz:
- acoplamento a uma ferramenta específica
- perda de portabilidade
- dependência de ambiente pessoal para entendimento da documentação

---

## Proteção mínima com `.gitignore`

Todo projeto inicializado com apoio do Innova Cortex deve conter um `.gitignore` mínimo antes do primeiro `git add`.

### O que entra no Git por padrão

- `.cortex/` — versionar (todos os colaboradores precisam da governança)
- `CLAUDE.md` — versionar (ponte entre projeto e governança; sem segredos, gerado a partir de template público)
- código-fonte do projeto

### O que fica fora do Git por padrão

```text
.claude/
tasks/
node_modules/
logs/
AGENTS.md
*.pyc
__pycache__/
.DS_Store
```

### Decisão do adopter (default ignorado, pode versionar caso a caso)

```text
docs/
memory/
```

A pasta `docs/` fica fora do Git por padrão **porque pode conter regras de negócio internas, descobertas sensíveis ou contexto local que ainda não deve ser exposto**.

A pasta `memory/` fica fora do Git por padrão **porque registra estado vivo de sessões e pode conter contexto pessoal/operacional**.

Se algum documento específico precisar ser versionado, isso deve ser decisão explícita do projeto — adicionar regra negativa no `.gitignore` (ex.: `!docs/business/domain-overview.md`) ou mover o arquivo para fora dessas pastas.

Outros itens devem ser adicionados conforme stack, build, cache, ambiente local e dependências.

### Aplicação automática via skill

A skill [skill-validar-encerramento](../03-skills/skill-validar-encerramento.md) (Check 5) aplica esta regra automaticamente no fechamento de Init Project e Setup Project: verifica se o `.gitignore` do projeto contém as 10 entradas mínimas listadas acima e oferece anexar as faltantes de forma idempotente. Detalhes em `03-skills/skill-validar-encerramento.md` e na Decisão 08 (`11-evolucao-do-sistema/02-decisoes/skill-cobre-gitignore-minimo.md`).

---

## Critérios para expandir a pasta `docs/`

A estrutura mínima não deve crescer por burocracia.

Ela só deve ser expandida quando houver necessidade real.

### Sinais de que vale expandir

- o projeto cresceu em complexidade
- há necessidade de rastreabilidade adicional
- surgiram specs relevantes
- existe visão futura suficiente para documentar `to-be`
- há necessidade de separar fluxos, integrações, decisões ou requisitos
- a continuidade começou a ficar difícil com a estrutura mínima

### Pastas possíveis de evolução

Quando fizer sentido, o projeto pode evoluir com áreas como:

```text
docs/
  as-is/
  business/
  analysis/
  context/
  traceability/
  to-be/
  specs/
  decisions/
  integrations/
```

### Regra de crescimento

Criar nova pasta ou novo documento apenas quando houver função operacional clara.

Evitar:
- estrutura vazia
- nomenclatura bonita sem uso real
- expansão por antecipação
- documentação ornamental

---

## Critérios para não duplicar informação

Antes de criar novo documento, sempre avaliar:

- isso realmente precisa existir separado?
- já existe um arquivo mais adequado para isso?
- estou criando contexto útil ou apenas espalhando informação?
- esta nova nota reduz confusão ou aumenta a navegação?

### Regra prática

Se a resposta não for clara, preferir:
- consolidar
- apontar
- resumir
- adiar criação

Evitar duplicar:
- status
- handoff
- planos detalhados
- análises detalhadas
- decisões locais de projeto
- entregas principais

---

## Relação entre agentes, skills e documentação do projeto

Os agentes e skills da governança existem para apoiar a criação, leitura, revisão e evolução da documentação do projeto.

Eles não substituem o projeto como local de verdade documental.

### Exemplo de relação correta

- o agente ajuda a estruturar
- a skill ajuda a mapear
- o template ajuda a padronizar
- o conteúdo final vive no projeto

### Exemplo de relação incorreta

- o agente produz análise detalhada
- o conteúdo principal fica na governança
- o projeto passa a depender de arquivos da governança para funcionar

---

## Fluxo recomendado para início de projeto

1. identificar que o projeto ainda tem pouco contexto consolidado
2. usar [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
3. usar [skill-iniciar-projeto](../03-skills/skill-iniciar-projeto.md)
4. criar a estrutura mínima no próprio projeto (`docs/` + `memory/`)
5. preencher os documentos iniciais com base real
6. registrar continuidade em:
   - `docs/context/current-status.md`
   - `docs/context/handoff.md`
7. registrar memória persistente em:
   - `memory/project-context.md`

---

## Sinais de boa aplicação desta regra

A estrutura está sendo bem usada quando:
- a governança Innova Cortex permanece leve e focada em orientar o agente
- a documentação real do projeto está no próprio projeto
- a navegação ficou mais fácil sem duplicação
- a fonte principal de cada informação está clara
- status, handoff, memória e pendências do projeto vivem no projeto, distribuídos por finalidade
- a documentação consegue ser retomada sem contexto informal excessivo

---

## Sinais de má aplicação desta regra

Há desvio quando:
- a governança começa a armazenar conteúdo principal de projeto
- existem múltiplas versões do mesmo plano ou análise
- arquivos de memória ou pendências do projeto migram para fora do projeto
- a estrutura cresce mais rápido do que a utilidade real
- documentação é criada por antecipação sem função operacional

---

## Regra final

A governança Innova Cortex deve apoiar o trabalho sobre projetos, mas não absorver os projetos para dentro de si.

A regra principal é simples:

- governança vive em `.cortex/` dentro do projeto
- documentação real do projeto vive no projeto (`docs/`, `memory/`)
- a fonte principal de verdade deve continuar clara e única

---

## Relações principais

Ver também:

- [Claude](../Claude.md)
- [00-regras-gerais](00-regras-gerais.md)
- [01-limites-de-atuacao](01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](03-checklist-de-qualidade.md)
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [agente-analista](../02-agentes/agente-analista.md)
- [agente-planejador](../02-agentes/agente-planejador.md)
- [skill-iniciar-projeto](../03-skills/skill-iniciar-projeto.md)
- [skill-mapear-contexto](../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../03-skills/skill-revisar-documento.md)
