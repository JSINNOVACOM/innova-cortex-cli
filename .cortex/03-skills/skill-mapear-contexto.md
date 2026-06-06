# Skill: Mapear contexto

## Objetivo
Ler materiais e estruturar entendimento inicial antes de qualquer implementação, mantendo separação entre fato, hipótese, estado atual e visão futura.

Relacionado a:
- [Claude](../Claude.md)
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../01-regras/03-checklist-de-qualidade.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [agente-planejador](../02-agentes/agente-planejador.md)

---

## Quando usar
Usar esta skill quando:
- um tema ainda está confuso
- há muito material solto
- é preciso estruturar entendimento
- há risco de partir para execução cedo demais
- é necessário separar o que já se sabe do que ainda falta validar

---

## Passos
1. Identificar o objetivo principal
2. Resumir o contexto recebido
3. Separar fatos e hipóteses
4. Identificar estado atual
5. Identificar visão futura, se houver
6. Mapear restrições
7. Mapear lacunas
8. Apontar riscos iniciais
9. Sugerir próximos passos sem implementar
10. Registrar contexto, fatos, hipóteses e continuidade no projeto, granularmente (ver "Saída esperada" abaixo)

---

## Saída esperada
- contexto resumido
- estado atual
- fatos confirmados
- hipóteses abertas
- riscos
- pendências
- próximos passos

Registrar no projeto, granularmente:
- fatos confirmados → `docs/analysis/current-state-assessment.md`
- hipóteses em validação → `docs/analysis/gaps-and-unknowns.md`
- pendências e bloqueios → `docs/context/current-status.md`
- passagem de contexto para retomada → `docs/context/handoff.md`

---

## Regras aplicáveis
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../01-regras/03-checklist-de-qualidade.md)

---

## Agentes que mais usam esta skill
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [agente-planejador](../02-agentes/agente-planejador.md)

---

## Sinais de uso correto
- evita começar implementando
- evita conclusão precipitada
- organiza o raciocínio
- prepara terreno para análise ou planejamento