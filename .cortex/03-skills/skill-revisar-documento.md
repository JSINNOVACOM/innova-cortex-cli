# Skill: Revisar documento

## Objetivo
Avaliar qualidade estrutural, lógica e informacional de um documento, identificando clareza, lacunas, ambiguidades, inconsistências e oportunidades de melhoria.

Relacionado a:
- [Claude](../Claude.md)
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../01-regras/03-checklist-de-qualidade.md)
- [agente-analista](../02-agentes/agente-analista.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
---

## Quando usar
Usar esta skill quando:
- houver documento para revisar
- for necessário validar consistência
- existir risco de ambiguidade
- for preciso transformar material solto em parecer útil
- houver necessidade de leitura crítica

---

## O que verificar
- clareza do objetivo
- coerência estrutural
- separação entre fato e hipótese
- separação entre atual e futuro
- contradições
- redundâncias
- lacunas
- utilidade prática
- rastreabilidade
- riscos interpretativos

---

## Passos
1. Ler o material
2. Identificar objetivo do documento
3. Verificar estrutura
4. Separar fatos, inferências e hipóteses
5. Identificar problemas de coerência
6. Identificar lacunas
7. Sugerir melhorias
8. Registrar achados, hipóteses e continuidade no projeto, granularmente (ver "Saída esperada" abaixo)

---

## Saída esperada
- resumo do documento
- pontos fortes
- problemas encontrados
- lacunas
- riscos
- melhorias recomendadas
- itens que precisam de validação

Registrar no projeto, granularmente:
- fatos confirmados na revisão → `docs/analysis/current-state-assessment.md`
- hipóteses ou lacunas identificadas → `docs/analysis/gaps-and-unknowns.md`
- pendências e bloqueios → `docs/context/current-status.md`
- passagem de contexto para retomada → `docs/context/handoff.md`
- aprendizados sobre falhas ou padrões → `memory/learnings.md`

---

## Regras aplicáveis
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../01-regras/03-checklist-de-qualidade.md)

---

## Agentes que mais usam esta skill
- [agente-analista](../02-agentes/agente-analista.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)

---

## Sinais de uso correto
- reduz ambiguidade
- aumenta confiabilidade
- evita leitura superficial
- evita aceitar documento fraco apenas porque parece bem escrito