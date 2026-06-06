# Templates de projetos

## Objetivo
Explicar como usar os templates mínimos de documentação de projeto dentro do sistema da IA.

Relacionado a:
- [Claude](../Claude.md)
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
- [skill-iniciar-projeto](../03-skills/skill-iniciar-projeto.md)
- [skill-validar-encerramento](../03-skills/skill-validar-encerramento.md)
- [template-system-overview](template-system-overview.md)
- [template-domain-overview](template-domain-overview.md)
- [template-current-state-assessment](template-current-state-assessment.md)
- [template-gaps-and-unknowns](template-gaps-and-unknowns.md)
- [template-current-status](template-current-status.md)
- [template-handoff](template-handoff.md)
- [template-padrao-tecnico](template-padrao-tecnico.md)
- [template-claude-md-local](template-claude-md-local.md)

---

## Convenção de placeholders

Quando um template precisa de um valor a ser substituído pelo adopter, o placeholder deve aparecer no formato:

```markdown
{{NOME_DO_PLACEHOLDER}} <!-- TODO: descrição do que substituir -->
```

O par `{{...}}` + `<!-- TODO: ... -->` cumpre três funções:
- visibilidade ao operador (TODO aparece em qualquer renderizador);
- pesquisabilidade por regex (`{{[A-Z_]+}}` ou `<!-- TODO`);
- documentação inline do que substituir.

A skill [skill-validar-encerramento](../03-skills/skill-validar-encerramento.md) roda ao final dos workflows que produzem docs e detecta placeholders pendentes nesse formato. Templates novos devem seguir essa convenção.

Campos de **metadados** em branco (ex: `- **Projeto:**` no início dos templates) não são placeholders no sentido estrito — são campos de valor a preencher. Não precisam de marcação `{{...}}` nem de `<!-- TODO -->`, mas o adopter deve completá-los.

---

## Princípio central
Os templates existem para evitar improviso estrutural.

Eles não substituem análise.  
Eles não substituem pensamento crítico.  
Eles não devem ser preenchidos com texto genérico apenas para “completar documento”.

O papel dos templates é:
- acelerar organização
- padronizar estrutura
- preservar continuidade
- reduzir ambiguidade
- facilitar retomada entre sessões, pessoas ou agentes

---

## Onde esses templates são usados
Esses templates não pertencem ao projeto em si.  
Eles pertencem à governança Innova Cortex (`.cortex/04-templates/`).

Eles servem como modelos para criação dos documentos dentro de projetos reais.

### Exemplo
O template:
- [template-system-overview](template-system-overview.md)

Serve para criar no projeto:
- `docs/as-is/system-overview.md`

---

## Estrutura mínima suportada
Os templates mínimos desta pasta suportam a criação dos 6 documentos iniciais:

- `docs/as-is/system-overview.md`
- `docs/business/domain-overview.md`
- `docs/analysis/current-state-assessment.md`
- `docs/analysis/gaps-and-unknowns.md`
- `docs/context/current-status.md`
- `docs/context/handoff.md`

---

## Mapa de templates

### 1. [template-system-overview](template-system-overview.md)
Usar para:
- visão inicial do projeto
- propósito aparente
- áreas principais
- limites percebidos
- dúvidas estruturais

Cria no projeto:
- `docs/as-is/system-overview.md`

---

### 2. [template-domain-overview](template-domain-overview.md)
Usar para:
- visão de domínio
- problema de negócio
- atores
- conceitos centrais
- objetivos percebidos

Cria no projeto:
- `docs/business/domain-overview.md`

---

### 3. [template-current-state-assessment](template-current-state-assessment.md)
Usar para:
- avaliação crítica do estado atual
- clareza percebida
- fragilidades
- maturidade
- dependência de conhecimento informal

Cria no projeto:
- `docs/analysis/current-state-assessment.md`

---

### 4. [template-gaps-and-unknowns](template-gaps-and-unknowns.md)
Usar para:
- lacunas prioritárias
- dúvidas em aberto
- bloqueios
- hipóteses em validação
- ordem de investigação

Cria no projeto:
- `docs/analysis/gaps-and-unknowns.md`

---

### 5. [template-current-status](template-current-status.md)
Usar para:
- registrar o ponto atual do trabalho
- prioridades do momento
- o que já foi feito
- o que está em andamento
- próxima ação recomendada

Cria no projeto:
- `docs/context/current-status.md`

---

### 6. [template-handoff](template-handoff.md)
Usar para:
- passagem de contexto
- retomada entre sessões
- próximos passos imediatos
- alertas
- pontos ainda não validados

Cria no projeto:
- `docs/context/handoff.md`

---

### 7. [template-padrao-tecnico](template-padrao-tecnico.md)
Usar para:
- criar um padrão técnico novo (stack, componente, quality-gate específico)
- preservar a convenção de wikilinks limpa (sem refs fantasma a `memoria-operacional (registro interno, não publicado no OSS)`, `pendencias (registro interno, não publicado no OSS)`, `hipoteses-abertas (registro interno, não publicado no OSS)`, `fatos-confirmados (registro interno, não publicado no OSS)`)
- ter um ponto de partida com bloco "Relacionado a" já correto e estrutura de seções uniforme

Cria no `.cortex/`:
- `10-padroes-tecnicos/stacks/<nome>.md` (ou subpasta equivalente)

---

## Convenção de wikilinks em padrões técnicos

Padrões técnicos criados pelo adopter (em `10-padroes-tecnicos/`) **NÃO devem usar** os 4 wikilinks abaixo — pertencem à governança privada do autor original e não resolvem em instalações OSS:

- `memoria-operacional (registro interno, não publicado no OSS)`
- `pendencias (registro interno, não publicado no OSS)`
- `hipoteses-abertas (registro interno, não publicado no OSS)`
- `fatos-confirmados (registro interno, não publicado no OSS)`

A lista oficial de wikilinks proibidos está em `03-skills/wikilinks-fantasma.txt`. A skill [skill-validar-encerramento](../03-skills/skill-validar-encerramento.md) (Check 6) alerta automaticamente se algum desses aparecer em arquivos produzidos pelo workflow.

Wikilinks recomendados em padrões técnicos:

- `[Claude](../Claude.md)`
- `[00-regras-gerais](../01-regras/00-regras-gerais.md)`
- `[03-checklist-de-qualidade](../01-regras/03-checklist-de-qualidade.md)`
- `[quality-gate-base](../10-padroes-tecnicos/quality-gates/quality-gate-base.md)`
- Outros padrões em `10-padroes-tecnicos/` (se aplicável)

---

## Como usar corretamente

### 1. Começar pelo contexto
Antes de usar qualquer template:
- entender o mínimo do projeto
- separar confirmado, hipótese e dúvida
- evitar preencher campos sem base real

Usar apoio de:
- [skill-mapear-contexto](../03-skills/skill-mapear-contexto.md)
- [skill-iniciar-projeto](../03-skills/skill-iniciar-projeto.md)

---

### 2. Criar apenas o necessário
Nem todo projeto precisa crescer tudo de uma vez.

Começar pelo núcleo mínimo.  
Expandir depois, se necessário.

Ver:
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)

---

### 3. Escrever com utilidade operacional
Evitar:
- texto genérico
- frase bonita sem função
- repetição vazia
- preenchimento artificial

Preferir:
- clareza
- síntese
- pontos verificáveis
- continuidade

---

### 4. Marcar incertezas
Sempre que possível, diferenciar:
- **Confirmado**
- **Hipótese**
- **Dúvida em aberto**

Se a informação não estiver firme, não escrever como fato.

---

### 5. Revisar ao longo do tempo
Os templates não produzem documentos “prontos para sempre”.

Os documentos do projeto devem evoluir de:
- inicial
- parcial
- validado
- pendente de revisão

---

## Fluxo recomendado de uso

1. usar [skill-iniciar-projeto](../03-skills/skill-iniciar-projeto.md)
2. consultar [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)
3. selecionar os templates corretos
4. criar os 6 arquivos mínimos no projeto
5. preencher de forma mínima e útil
6. registrar lacunas, status atual e handoff no projeto
7. só depois expandir documentação complementar

---

## O que evitar
Evitar:
- usar template sem contexto mínimo
- copiar e colar sem pensar
- preencher todos os campos com suposição
- abrir documentação demais cedo demais
- transformar template em burocracia
- usar template como substituto de análise

---

## Critério de bom uso
Os templates foram bem usados quando:
- o projeto ficou mais compreensível
- a continuidade ficou mais fácil
- as lacunas ficaram visíveis
- a próxima pessoa sabe por onde seguir
- a documentação passou a ter utilidade prática

---

## Links relacionados
- [agente-inicializacao-projeto](../02-agentes/agente-inicializacao-projeto.md)
- [skill-iniciar-projeto](../03-skills/skill-iniciar-projeto.md)
- [skill-mapear-contexto](../03-skills/skill-mapear-contexto.md)
- [skill-revisar-documento](../03-skills/skill-revisar-documento.md)
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)