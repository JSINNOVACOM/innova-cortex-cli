# Limites de atuação do agente

## Objetivo
Definir com clareza onde o agente pode agir livremente, onde depende de autorização, quais tipos de alteração pode realizar e o que não deve fazer.

Relacionado a:
- [Claude](../Claude.md)
- [00-regras-gerais](00-regras-gerais.md)
- [03-checklist-de-qualidade](03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](04-estrutura-documental-de-projetos.md)

---

## Regra principal

Dentro de `.cortex/`, o agente não possui o mesmo nível de autonomia para todos os arquivos.

Existem dois níveis de alteração:
- permitidos com solicitação explícita ou aprovação clara
- não alterar sem solicitação direta

Fora de `.cortex/`, no projeto em si, o agente só pode atuar com:
- solicitação explícita
- autorização clara
- aprovação específica do usuário

---

## Princípio de separação

O ambiente do projeto possui zonas diferentes de atuação.

O agente não deve tratar tudo como se fosse um único espaço homogêneo.

É obrigatório distinguir entre:
- governança Innova Cortex (`.cortex/`)
- documentação do projeto (`docs/`, `memory/`)
- código-fonte do projeto
- arquivos de configuração e ferramentas

---

## Matriz de atuação por área

### 1. Permitidos com solicitação explícita ou aprovação clara

O agente pode alterar quando a tarefa for explicitamente evoluir, revisar ou ajustar a governança.

Pode, quando autorizado:
- revisar agentes
- revisar skills
- revisar templates
- ajustar arquivos auxiliares de metodologia

Arquivos típicos desta categoria:
- `.cortex/02-agentes/*.md`
- `.cortex/03-skills/*.md`
- `.cortex/04-templates/*.md`

O agente não deve alterar esses arquivos como parte de rotina operacional comum.

---

### 2. Não alterar sem solicitação direta

O agente não deve alterar por conta própria arquivos de governança e constituição do harness.

Arquivos típicos desta categoria:
- `.cortex/Claude.md`
- `.cortex/01-regras/00-regras-gerais.md`
- `.cortex/01-regras/01-limites-de-atuacao.md`
- `.cortex/01-regras/03-checklist-de-qualidade.md`
- `.cortex/01-regras/04-estrutura-documental-de-projetos.md`

Nesses arquivos, o agente pode:
- ler
- usar como referência
- apontar inconsistências
- sugerir mudanças

Mas só deve alterar mediante solicitação direta do usuário.

---

### 3. Documentação do projeto

A documentação do projeto vive em `docs/` e `memory/`, fora de `.cortex/`.

O agente pode atuar nesses arquivos quando houver solicitação explícita, autorização clara ou comando específico do usuário.

Pode, quando autorizado:
- propor estrutura documental
- criar documentação de projeto
- preencher templates
- revisar documentos
- reorganizar documentação do projeto
- atualizar arquivos de acompanhamento do projeto
- consolidar materiais de descoberta, análise, status e handoff

Áreas típicas:
- `docs/as-is/`
- `docs/business/`
- `docs/analysis/`
- `docs/context/`
- `docs/traceability/`
- `docs/to-be/`
- `docs/specs/`
- `docs/decisions/`
- `memory/project-context.md`
- `memory/learnings.md`

O agente não deve assumir automaticamente que pode alterar qualquer arquivo do projeto sem comando claro.

---

### 4. Código-fonte do projeto

O agente pode atuar no código-fonte do projeto quando houver solicitação explícita do usuário.

Não deve:
- modificar código sem solicitação clara
- expandir escopo de uma alteração para "melhorias relacionadas" sem aprovação
- alterar configurações de build, dependências ou ferramentas sem aprovação

---

## Regra específica sobre documentos do projeto

O acompanhamento local do projeto deve acontecer no próprio projeto.

Especialmente em:
- `docs/context/current-status.md` (estado vivo, pendências, bloqueios)
- `docs/context/handoff.md` (passagem de contexto para retomada)

O agente não deve criar arquivos paralelos de acompanhamento fora dessa estrutura.

---

## Regra específica sobre registros do projeto

| Tipo de registro | Localização |
|---|---|
| Estado vivo + pendências | `docs/context/current-status.md` |
| Passagem de contexto | `docs/context/handoff.md` |
| Fatos confirmados | `docs/analysis/current-state-assessment.md` |
| Hipóteses em validação | `docs/analysis/gaps-and-unknowns.md` |
| Memória persistente do projeto | `memory/project-context.md` |
| Aprendizados | `memory/learnings.md` |

Cada projeto é autônomo. Não há memória ou pendências cross-projeto a partir desta governança.

---

## Tipos de ação permitidos

### O agente pode
- criar planos
- criar análises
- criar specs
- resumir materiais
- revisar documentos
- sugerir estruturas
- mapear contexto
- registrar fatos no `current-state-assessment.md` do projeto
- registrar hipóteses no `gaps-and-unknowns.md` do projeto
- registrar pendências no `current-status.md` do projeto
- atualizar `memory/project-context.md` com decisões duradouras
- registrar aprendizados em `memory/learnings.md` (mediante aprovação)

---

## O agente não pode
- editar conhecimento autoral do projeto sem autorização
- misturar hipótese e fato
- agir fora do escopo autorizado sem comando explícito
- tomar decisão crítica sem expor critérios
- apresentar conclusão frágil como se fosse definitiva
- assumir que pode alterar documentação ou código de projeto sem solicitação clara
- alterar arquivos de governança da `.cortex/` sem solicitação direta

---

## Atuação por tipo de tarefa

### Se for estruturação
Preferir:
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [skill-mapear-contexto](../03-skills/skill-mapear-contexto.md)

### Se for análise crítica
Preferir:
- [agente-analista](../02-agentes/agente-analista.md)
- [skill-revisar-documento](../03-skills/skill-revisar-documento.md)

### Se for plano de execução
Preferir:
- [agente-planejador](../02-agentes/agente-planejador.md)
- [skill-mapear-contexto](../03-skills/skill-mapear-contexto.md)

### Se for início de projeto
Preferir:
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
- [skill-iniciar-projeto](../03-skills/skill-iniciar-projeto.md)

---

## Em caso de dúvida

Quando houver dúvida sobre:
- permissão
- escopo
- autoria
- criticidade da ação
- se algo pertence à governança ou ao projeto
- se o arquivo é condicionado ou protegido

O agente deve:
1. parar de expandir escopo
2. preservar o conteúdo existente
3. registrar a dúvida no `docs/analysis/gaps-and-unknowns.md` do projeto
4. registrar bloqueios no `docs/context/current-status.md` do projeto
5. evitar agir sobre projeto específico sem autorização clara
6. evitar alterar arquivos de governança sem solicitação direta

---

## Regra de segurança operacional

Na dúvida:
- preservar
- não sobrescrever
- não assumir
- não inventar
- não misturar governança com contexto de projeto
- não alterar conteúdo do projeto sem autorização explícita
- não alterar arquivos de governança sem solicitação direta
