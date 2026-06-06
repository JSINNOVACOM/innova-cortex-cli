# Tipo de trabalho: aprendizado simples

## Objetivo

Definir como o sistema deve registrar um aprendizado do projeto quando ocorrer falha, perda de contexto, implementação inadequada, quebra de padrão ou descoberta relevante durante o trabalho, garantindo que o aprendizado não se perca e que o registro aconteça no lugar certo, com nível de detalhe adequado.

Relacionado a:

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [agente-analista](../../02-agentes/agente-analista.md)
- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)
- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)
- [criterios-base](../criterios-de-entrada-e-saida/criterios-base.md)

---

## Princípio central

Aprendizado não registrado é aprendizado perdido.

Mas nem toda observação merece registro. Aprendizado simples é avaliação proporcional: registrar o que vale, no lugar certo, com o detalhe adequado.

A meta deste fluxo não é "documentar tudo".  
A meta é registrar o que é relevante, com clareza, e proporcionar continuidade.

---

## Onde o aprendizado vive

Aprendizados do projeto vivem em **`memory/learnings.md`** dentro do projeto.

Esse é o arquivo único de aprendizados do projeto, organizado em seções por tipo de aprendizado:

```text
memory/learnings.md
  ## Incidentes
  ## Padrões de falha observados
  ## Correções preventivas recomendadas
```

Essa estrutura preserva a distinção entre tipos de aprendizado (incidente pontual, padrão recorrente, correção estrutural) sem fragmentar em múltiplos arquivos para um projeto pequeno.

### Relação com outros arquivos do projeto

Quando o aprendizado for diretamente operacional, pode também aparecer em:

- `docs/context/current-status.md` — quando o aprendizado afeta a continuidade imediata do trabalho
- `docs/analysis/current-state-assessment.md` — quando o aprendizado revela algo sobre o estado atual
- `docs/analysis/gaps-and-unknowns.md` — quando o aprendizado abre uma nova lacuna ou hipótese

A fonte primária do aprendizado em si é `memory/learnings.md`. Os outros documentos podem referenciar.

---

## Quando este tipo de trabalho se aplica

Usar este fluxo quando:

- ocorreu uma falha durante a sessão que merece registro
- houve perda de contexto com causa identificável
- uma implementação foi feita de forma inadequada e é importante entender por quê
- um padrão foi quebrado, intencionalmente ou não
- houve uma descoberta relevante não óbvia que pode mudar a abordagem futura
- o agente percebeu que tomou uma decisão errada que não deve se repetir

---

## Quando este tipo de trabalho não se aplica

Não usar este fluxo como padrão quando:

- o aprendizado já está documentado em `memory/learnings.md` com o mesmo teor
- a descoberta é trivial ou diretamente derivável do código e da documentação existente
- o objetivo é criar algo novo (usar outro fluxo)
- o objetivo é revisar uma entrega (usar [review](review.md))
- o incidente já foi tratado como parte de outro fluxo e não gera aprendizado adicional

---

## Perguntas que este fluxo deve responder

Antes de considerar o fluxo bem executado, o sistema deve conseguir responder minimamente:

- o que exatamente aconteceu?
- isso é fato ou hipótese sobre a causa?
- qual foi o impacto percebido?
- em qual seção de `memory/learnings.md` este aprendizado se encaixa?
- existe alguma recomendação preventiva derivada disso?
- vale propor ao usuário antes de registrar?

---

## Agentes mais prováveis no fluxo

O agente mais comum para aprendizado simples é:

1. [agente-analista](../../02-agentes/agente-analista.md)

O [agente-analista](../../02-agentes/agente-analista.md) é mais indicado porque este fluxo exige separação entre fato e hipótese, leitura crítica do incidente e avaliação de impacto — competências centrais deste agente.

---

## Skills mais prováveis no fluxo

A skill mais comum para este tipo de trabalho é:

- [skill-revisar-documento](../../03-skills/skill-revisar-documento.md)

E uma skill na etapa de fechamento:

- [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md)

---

## Fluxo recomendado

### Etapa 1: identificação do incidente ou descoberta

Objetivo:  
nomear com clareza o que aconteceu antes de qualquer análise.

Deve produzir:

- descrição objetiva do evento (o que ocorreu, quando, em qual contexto)
- tipo do evento: falha técnica, falha de fluxo, falha de contexto, falha de harness ou descoberta positiva
- referência ao fluxo ou etapa em que ocorreu, quando aplicável

---

### Etapa 2: separação entre fato e hipótese

Objetivo:  
distinguir o que é observado do que é interpretação sobre a causa.

Deve produzir:

- fatos observados: o que aconteceu de forma verificável
- hipótese sobre a causa: por que isso provavelmente ocorreu
- dúvidas ainda abertas sobre a causa

Misturar fato e hipótese nesta etapa compromete a qualidade do aprendizado e pode gerar recomendação preventiva equivocada.

---

### Etapa 3: avaliação de impacto

Objetivo:  
entender o que foi afetado e a gravidade do incidente.

Deve responder:

- o impacto foi localizado nesta sessão ou afetou o projeto mais amplamente?
- houve perda de trabalho, de contexto ou de qualidade de entrega?
- o impacto tende a se repetir sem ação corretiva?

---

### Etapa 4: decisão de registro

Objetivo:  
decidir se este aprendizado merece registro e em qual seção.

Critérios:

**Vale registrar quando:**
- o aprendizado tem potencial de repetição
- a causa é identificável e a prevenção é possível
- o incidente revelou algo não óbvio sobre o projeto, o agente ou o fluxo
- a recomendação preventiva derivada tem base em evidência

**Não vale registrar quando:**
- o evento é trivial e diretamente derivável de documentação existente
- a causa foi um descuido pontual sem padrão associado
- já existe registro com o mesmo teor

**Em qual seção de `memory/learnings.md` registrar:**

| Seção | Quando usar |
|---|---|
| `## Incidentes` | Erros pontuais com causa e efeito identificados |
| `## Padrões de falha observados` | Padrões que se repetem ou têm potencial claro de repetição |
| `## Correções preventivas recomendadas` | Ajustes estruturais recomendados com base no incidente |

Antes do registro, **propor ao usuário** o que será gravado e em qual seção. O sistema não deve registrar automaticamente sem aprovação explícita.

---

### Etapa 5: registro no lugar adequado

Objetivo:  
registrar o aprendizado em `memory/learnings.md`, na seção definida na etapa anterior, após aprovação do usuário.

Estrutura sugerida para cada entrada:

```markdown
### [Data] Título curto do aprendizado
- **Tipo:** falha técnica / fluxo / contexto / harness / descoberta positiva
- **O que aconteceu:** descrição objetiva
- **Causa provável:** hipótese sobre a causa
- **Impacto:** o que foi afetado
- **Recomendação preventiva:** ação para evitar repetição (se houver)
- **Referência:** fluxo, etapa, sessão, arquivo afetado (quando aplicável)
```

Se o aprendizado também afeta a continuidade imediata, atualizar `docs/context/current-status.md` ou `docs/analysis/*` conforme apropriado, **referenciando** a entrada em `memory/learnings.md`.

---

### Etapa 6: recomendação preventiva

Objetivo:  
produzir, quando houver base suficiente, uma recomendação objetiva para evitar a repetição.

Deve produzir:

- recomendação clara e acionável
- em qual etapa ou contexto ela se aplica
- se ela exige ajuste no projeto ou apenas mudança de abordagem

Se não houver base suficiente para recomendação, registrar apenas o incidente e a hipótese. Não fabricar recomendação sem evidência.

---

### Etapa 7: validação de fechamento (OBRIGATÓRIA)

**Status:** hard-required. Workflow NÃO pode ser declarado concluído sem este passo.

Objetivo:  
garantir que o registro do aprendizado em `memory/learnings.md` e as referências eventuais em `docs/` não contêm pendências silenciosas.

Aplicar [skill-validar-encerramento](../../03-skills/skill-validar-encerramento.md) sobre os arquivos editados pelo fluxo (`memory/learnings.md` e qualquer `docs/*` referenciado). A skill verifica:

- **Check 1:** placeholders pendentes (`{{...}}`, `<!-- TODO: ... -->`);
- **Check 2:** referências a arquivos que não existem;
- **Check 3:** EOF/newline final;
- **Check 4:** seções vazias com cabeçalho;
- **Check 6:** wikilinks fantasma (lista negra em `03-skills/wikilinks-fantasma.txt`).

(Check 5 — `.gitignore` mínimo — roda apenas em Init Project e Setup Project, não nesta etapa.)

O relatório consolidado deve ser apresentado ao usuário **mesmo se zero problemas encontrados** (output mínimo obrigatório). Caso o aprendizado referencie um arquivo que não foi criado (ex: linkar uma análise futura), decidir entre criar agora, remover a referência ou substituir.

---

## Saída mínima aceitável

Este fluxo só deve ser considerado minimamente concluído quando existir:

- descrição objetiva do incidente ou descoberta
- separação entre fato e hipótese
- avaliação de impacto
- decisão de registro (registrar ou não, e em qual seção)
- registro em `memory/learnings.md`, quando aplicável
- recomendação preventiva, quando houver base para isso
- validação de fechamento executada (Checks 1, 2, 3, 4, 6 da skill)
- ⚠ Workflow não é considerado concluído sem relatório da skill (mesmo se vazio).

Sem isso, o incidente foi percebido mas não processado.

---

## Critérios de entrada

Este fluxo pode começar quando houver pelo menos:

- um incidente, falha ou descoberta identificável
- contexto mínimo para descrever o que aconteceu
- clareza de que o evento merece registro (não é trivial nem já está documentado)

---

## Critérios de saída

Este fluxo pode ser encerrado quando:

- o aprendizado estiver registrado em `memory/learnings.md` (ou tiver sido decidido conscientemente não registrar)
- o usuário tiver sido consultado e tiver aprovado o registro

Encerrar este fluxo não significa que o problema está resolvido.  
Significa que o aprendizado está registrado e não será perdido.

---

## Sinais de uso correto

Este fluxo está sendo bem usado quando:

- fato e hipótese são separados antes de qualquer recomendação
- o registro só acontece após aprovação do usuário
- a recomendação preventiva tem base em evidência, não em suposição
- o registro é proporcional à relevância do incidente
- aprendizados ficam organizados por seção em `memory/learnings.md`

---

## Sinais de uso ruim

Há desvio quando:

- o sistema registra automaticamente em `memory/learnings.md` sem aprovação
- hipótese é tratada como fato na descrição do incidente
- a recomendação preventiva é produzida sem evidência suficiente
- o fluxo é usado para registrar eventos triviais que não geram aprendizado real
- o registro fica fora do `memory/learnings.md` sem motivo claro

---

## Relação com projetos reais

A fonte primária do aprendizado vive em:

- `memory/learnings.md` (com seções: Incidentes, Padrões de falha observados, Correções preventivas recomendadas)

Quando o aprendizado afeta diretamente a continuidade ou o entendimento atual do projeto, atualizar também:

- `docs/context/current-status.md` (continuidade imediata)
- `docs/analysis/current-state-assessment.md` (estado atual)
- `docs/analysis/gaps-and-unknowns.md` (lacuna ou hipótese aberta)

Sempre referenciando a entrada em `memory/learnings.md`, sem duplicar.

Este arquivo de orquestração não substitui esses documentos.  
Ele apenas define como conduzir bem o registro de aprendizado.

---

## Regra final

Aprendizado simples deve sair do estado de incidente percebido e chegar ao estado de registro claro em `memory/learnings.md`, com escopo decidido e recomendação preventiva quando houver base.

A prioridade é simples:  
**identificar, separar fato de hipótese, avaliar impacto, decidir registro, registrar com aprovação e só então recomendar.**
