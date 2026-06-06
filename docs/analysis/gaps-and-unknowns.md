# Gaps and Unknowns — innova-cortex-cli

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** gaps-and-unknowns
- **Estado:** inicial
- **Última atualização:** 2026-06-05
- **Responsável:** Jonathan

---

## 1. Resumo das lacunas

Requisitos estão claros; as incertezas restantes são de **implementação e validação**, não de escopo. Concentram-se em: validação multiplataforma real, estratégia de merge do `update`, e detalhes da lista-fonte de cópia.

---

## 2. Lacunas prioritárias

### Lacuna 1 — Validação no Windows nativo
- **Descrição:** o gate de release (TASK-11/CRIT-10) exige rodar limpo no Windows nativo; ambiente de dev é WSL.
- **Por que isso importa:** é exatamente onde o `cp -r` quebrava; falha aqui invalida a proposta.
- **O que bloqueia:** publicação da entrega `init`.
- **Como investigar:** montar CI com matriz Linux+Windows desde cedo; testar paths, EOL, ausência de `chmod`.
- **Prioridade:** alta

### Lacuna 2 — Estratégia de merge do `update`
- **Descrição:** como preservar customização local quando arquivo mudou nos dois lados (conservador default vs. agressivo).
- **Por que isso importa:** risco de destruir trabalho do adopter.
- **O que bloqueia:** entrega `doctor`/`update` (TASK-14).
- **Como investigar:** definir contrato de diff/merge (por hash) e cenários de teste com customização preservada.
- **Prioridade:** média (só relevante após `init`)

### Lacuna 3 — Origem da lista-fonte `INCLUDE_DIRS`
- **Descrição:** lista embutida no CLI ou lida do repo de conteúdo? Afeta CRIT-21 (doc gerada da lista-fonte).
- **Por que isso importa:** define acoplamento ferramenta × conteúdo.
- **O que bloqueia:** TASK-05 (cópia do núcleo) e TASK-12 (doc gerada).
- **Como investigar:** decidir em Create Feature da TASK-05, à luz da DEC-04.
- **Prioridade:** média

---

## 3. Dúvidas em aberto
- `ref` default quando o usuário não passa `--ref` (última tag? `HEAD`?).
- Comportamento do `doctor` quando offline / sem acesso ao remoto.

---

## 4. Hipóteses em validação
- `util.parseArgs` cobre o parse sem lib externa.
- Escrita manual do YAML do VERSION é segura (formato flat).
- Detecção de layout legado vs. `cortex/` cobre todas as refs suportadas.

---

## 5. Bloqueios atuais para avanço seguro
- Nenhum bloqueio para iniciar a TASK-01 (bootstrap). As lacunas acima são de fases posteriores.

---

## 6. Ordem sugerida de investigação
1. CI multiplataforma cedo (Lacuna 1).
2. Origem da lista-fonte (Lacuna 3), na TASK-05.
3. Estratégia de merge do `update` (Lacuna 2), na fase `doctor`/`update`.

---

## 7. Confirmado
- Escopo está fechado pela spec; lacunas são de execução/validação.

---

## 8. Documentos relacionados no projeto
- `docs/as-is/system-overview.md`
- `docs/business/domain-overview.md`
- `docs/analysis/current-state-assessment.md`
- `docs/context/current-status.md`
- `docs/context/handoff.md`
