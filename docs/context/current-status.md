# Current Status — innova-cortex-cli

## Metadados
- **Projeto:** innova-cortex-cli
- **Documento:** current-status
- **Estado:** em desenvolvimento
- **Última atualização:** 2026-06-06
- **Responsável:** Jonathan

---

## 1. Resumo do momento atual

Init Project concluído; **TASK-01, TASK-02, base da TASK-03 e TASK-04 entregues e validadas**. CLI executa o pipeline `parse → (help/version) → dispatch → render` (CRIT-20/21, REGRA-11). TASK-04: clone temporário shallow com **cleanup garantido inclusive em falha** (`withTempClone` em `src/core/clone.js`), sobre `util/git.js` (assertGitAvailable→GIT_MISSING / cloneShallow→SOURCE_UNREACHABLE) e `util/fs.js` (makeTempDir/removeDir portáveis). Verificado: erro real do git mapeado e zero temp dirs órfãos. `node --test` verde (30/30). Próximo movimento: TASK-05 (detecção de layout + cópia do núcleo).

---

## 2. O que já foi levantado

- Spec canônica do CLI (8 docs em `docs/spec/`).
- Governança `.cortex/` instalada (bootstrap manual — o CLI ainda não existe).
- Decisões DEC-01 a DEC-10 fechadas; DEC-09 fechada nesta sessão (2026-06-05).
- Mapa de dependências de tasks (TASK-00 → TASK-01 → ...).

---

## 3. O que está em andamento

- Nada em andamento — TASK-02 fechada. Aguardando início da TASK-04.

---

## 4. O que ainda falta

- TASK-03 (restante): `util/git.js` ganha `lsRemote` quando o `doctor` precisar (TASK-13); `util/fs.js` ganha cópia de árvore/leitura/escrita na TASK-05+.
- TASK-05..12: cópia do núcleo → CLAUDE.md → estrutura mínima → VERSION → escrita atômica → testes multiplataforma → publicação.
- TASK-13..16: `doctor`/`update` + publicação.

---

## 5. Prioridades do momento

1. TASK-05: detecção de layout (`cortex/` vs. raiz legada) + cópia do núcleo aplicando INCLUDE/EXCLUDE (CRIT-01/12, REGRA-01) — exige expandir `util/fs.js` (copyTree) + `SourceLayout`.
2. TASK-06/07: materialização do CLAUDE.md (template + placeholders) + estrutura mínima do projeto.
3. Estabelecer CI multiplataforma cedo (mitiga Lacuna 1).

---

## 6. Bloqueios atuais

- Nenhum bloqueio para iniciar a TASK-01.
- **Pendência aceita:** spec ainda usa rótulos internos "v0.2/v0.3"; DEC-08 aposentou esses rótulos públicos ("CLI — `init`" / "CLI — `doctor`/`update`"). Não corrigir a spec aqui (canônica no vault — DEC-10); apenas usar a nomenclatura nova no projeto.
- **Resolvida (2026-06-05):** a referência forward a `bin/cli.js` foi criada pela TASK-01 — não há mais pendência de Check 2.

### Exceção à regra P11.1 — versionamento (decidida 2026-06-05)

Projeto solo, fonte única nesta máquina. **Decisão do autor:** versionar **tudo como backup** — `.cortex/`, código, `docs/` e `memory/` entram no git. É exceção explícita à P11.1 (que ignora `docs/` e `memory/` por default), permitida pela governança como decisão local aprovada. Único material fora do git: `docs/spec/` (canônica no vault — DEC-10).

**Motivo:** nada deste repo vaza para o adopter — `npx innova-cortex` baixa do npm só `bin/`+`src/`; a governança que o usuário recebe vem do **repo de conteúdo separado** (`JSINNOVACOM/innova-cortex`), clonado em runtime (DEC-07). Logo, versionar docs/memory aqui é só backup pessoal, sem impacto no usuário final.

**Consequência operacional:** como o `.gitignore` agora ignora apenas `docs/spec/` (não `docs/` inteira), qualquer nova subpasta em `docs/` passa a ser versionada por default. Se algum dia surgir doc sensível, ignorar explicitamente.

---

## 7. Próxima ação recomendada

Acionar **Create Feature → TASK-05** (detecção de layout + cópia do núcleo). Building blocks da TASK-04 prontos para consumo: `withTempClone` entrega o diretório do clone; falta o `copyTree` em `util/fs.js` + o módulo `SourceLayout` (INCLUDE_DIRS/INCLUDE_FILES_AT_ROOT/EXCLUDE_PATTERNS — REGRA-01).

---

## 8. Riscos de continuidade

- Validação Windows nativa pendente (gate de release).
- Zero deps exige reimplementar pequenos utilitários — cobrir com testes.

---

## Registro de decisão — DEC-09 (fechada 2026-06-05)

- **Runtime:** Node **≥ 20 LTS** (Node 18 EOL desde abr/2025; min 20 cobre 20/22/24).
- **Módulos:** ESM (`"type": "module"`).
- **Dependências de runtime:** **zero**. Stdlib: `node:util` (`parseArgs`), `node:child_process` (git), `node:fs/promises` (fs). Testes via `node:test`. YAML do `VERSION` escrito à mão (flat).
- **Motivo:** alinhado à "preferência por mínimo de deps" da spec e à premissa multiplataforma (DEC-02).

---

## 9. Documentos relacionados no projeto
- `docs/as-is/system-overview.md`
- `docs/business/domain-overview.md`
- `docs/analysis/current-state-assessment.md`
- `docs/analysis/gaps-and-unknowns.md`
- `docs/context/handoff.md`
- `memory/project-context.md`
