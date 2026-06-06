# Domain Overview — innova-cortex-cli

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** domain-overview
- **Estado:** inicial
- **Última atualização:** 2026-06-05
- **Responsável:** Jonathan

---

## 1. Visão de domínio

Ferramenta de tooling/distribuição para o ecossistema **Innova Cortex** — um harness de governança de trabalho com agentes. O domínio é a **adoção e manutenção da camada de governança** (`.cortex/`) em projetos de terceiros (adopters), separando claramente *ferramenta* (este CLI) de *conteúdo* (o repo de governança).

---

## 2. Problema que o projeto aparenta resolver

A adoção manual da governança (`git clone` + `cp -r`) gera fricção e erros: arrasta arquivos que não são governança (`examples/`, LICENSE, README), exige substituição manual de placeholders, e não deixa rastro de qual versão está instalada — impossibilitando saber se uma Decisão N está ativa no projeto X.

---

## 3. Objetivos de negócio aparentes

- Tornar a adoção do Innova Cortex trivial e confiável (`npx innova-cortex init`).
- Dar **rastreabilidade** de versão da governança instalada.
- Permitir **atualização controlada** sem destruir customizações locais.
- Reduzir suporte e divergência entre projetos do mesmo adopter.

---

## 4. Atores envolvidos

- **Adopter** — quem roda o CLI para instalar/atualizar a governança no próprio projeto.
- **Mantenedor do Innova Cortex** — evolui o conteúdo da governança (repo separado) e o CLI.
- **Agente (Claude/harness)** — consumidor final da governança instalada.

---

## 5. Conceitos centrais do domínio

- **`.cortex/`** — núcleo de governança instalado no projeto do adopter.
- **`.cortex/VERSION`** — manifesto YAML com `source`/`ref`/`commit`/`installed_at`/`cli_version`.
- **Núcleo (`INCLUDE_DIRS`)** — o que de fato deve ser copiado, vs. o que fica de fora (`EXCLUDE_PATTERNS`).
- **Layout** — raiz legada vs. subdir `cortex/` (desde OSS v0.2.2).
- **Customização local** — alterações do adopter que o `update` deve preservar.

---

## 6. Fluxos ou operações principais percebidas

- **Instalar:** `init [--from <git-url>] [--ref <tag-or-commit>] [path]`.
- **Diagnosticar:** `doctor` (local vs. remoto + arquivos modificados).
- **Atualizar:** `update` (conservador default; `--dry-run`; agressivo opt-in).

---

## 7. Regras de negócio percebidas

### Confirmadas
- Copiar **só o núcleo**, a partir da raiz `cortex/` do repo (REGRA-01 / DEC-04).
- `VERSION` em YAML, versionado no Git do adopter (DEC-05).
- `update` conservador por default; agressivo é opt-in (DEC-06).
- Multiplataforma é premissa dura; paths via API portável, sem shell embutido, sem `chmod` (REGRA-10/11).

### Inferidas
- `init` aborta se `.cortex/` já existe (não sobrescreve silenciosamente — REGRA-07).
- Escrita atômica via staging temporário (REGRA-08/09).

---

## 8. Pontos ainda não compreendidos

- Detalhes do merge no `update` para arquivos modificados dos dois lados.
- Política de descoberta da `ref` default quando o usuário não passa `--ref`.

---

## 9. Confirmado
- Separação ferramenta × conteúdo (DEC-07).
- Numeração do CLI desacoplada do conteúdo; usar rótulos "CLI — `init`" / "CLI — `doctor`/`update`" (DEC-08).

---

## 10. Hipóteses
- A maioria dos adopters roda `init` sem `--from`/`--ref`, dependendo de defaults sensatos.

---

## 11. Dúvidas em aberto
- A lista-fonte `INCLUDE_DIRS` será embutida no CLI ou lida do repo de conteúdo?

---

## 12. Documentos relacionados no projeto
- `docs/as-is/system-overview.md`
- `docs/analysis/current-state-assessment.md`
- `docs/analysis/gaps-and-unknowns.md`
- `docs/context/current-status.md`
- `docs/context/handoff.md`
