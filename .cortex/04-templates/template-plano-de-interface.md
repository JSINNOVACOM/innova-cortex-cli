# Template - Plano de interface

## Objetivo
Planejar a modernização da interface de um projeto que já tem telas: criar a fundação visual e alinhar as telas existentes a ela, em etapas, com o papel de cada ferramenta definido por etapa.

Este documento pertence ao projeto.

Relacionado a:
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)
- [skill-trilho-de-interface](../03-skills/skill-trilho-de-interface.md)
- [refatoracao](../08-orquestracao/tipos-de-trabalho/refatoracao.md)
- [quality-gate-interface](../10-padroes-tecnicos/quality-gates/quality-gate-interface.md)
- [template-fundacao-visual](template-fundacao-visual.md)
- [templates-readme](templates-readme.md)

---

## Papel deste documento no projeto
Este arquivo existe para que a modernização siga uma ordem que não quebre o que funciona: primeiro a base invisível, depois as peças, depois as telas, e por fim a auditoria.

Cria no projeto:
- `docs/design/plano-de-interface.md`

O andamento da execução vive em `docs/context/current-status.md` e `docs/context/handoff.md`, não aqui.

---

## Metadados
- **Projeto:**
- **Documento:** plano-de-interface
- **Estado:** inicial | parcial | validado | pendente de revisão
- **Data da aprovação do plano:**
- **Responsável:**

---

## 1. Escopo
- **Telas no escopo:**
- **Telas fora do escopo:**
- **Material oficial existente (marca, logo):**
- **Larguras e temas a cobrir:** 360, 390, 768 e 1440 px; claro e escuro

---

## 2. Etapas e papel de cada ferramenta
Ajustar as etapas ao projeto. Células vazias significam que a ferramenta não atua naquela etapa.

| Etapa | Vercel | Taste | UI UX Pro Max | Impeccable | Playwright |
|---|---|---|---|---|---|
| 0. Decisões e preparação | | | | `init`: `PRODUCT.md` | Capturas de referência e pessoas de teste |
| 1. Fundação sem mudança visível | Requisitos universais | | Estrutura dos tokens semânticos | | Antes e depois iguais |
| 2. Peças comuns (botões, campos) | Revisão de cada peça | | Peças, variantes e estados | | Antes e depois iguais |
| 3. Casca da aplicação (navegação, barra) | Barra, retorno, teclado | | Casca com os tokens | | Cenários de navegação |
| 4. Identidade | Diagnóstico das telas | Direção, aprovada pelo dono | Tokens da identidade | `critique` e `polish` contra o `PRODUCT.md` | Jornadas e regressão |
| 5. Telas, por área | Diagnóstico das jornadas | Maquete de cada tela dentro da direção | Extensões do sistema | `critique`, `audit` e `polish` | Jornadas, contraste AA e regressão |
| 6. Auditoria final | Revisão em todas as camadas | | | `audit` por área | Conjunto completo, todas as larguras e temas |

---

## 3. Ordem dentro das etapas com tela
Nas etapas 4 e 5, cada fatia segue os passos do momento B da [skill-trilho-de-interface](../03-skills/skill-trilho-de-interface.md):

1. diagnóstico da tela atual, com Playwright e Vercel
2. maquete dentro da direção, aprovada pelo dono
3. extensão do sistema, quando faltar peça
4. implementação reproduzindo a composição da maquete
5. validação: typecheck, lint, testes e build, e o Playwright comparando com a maquete
6. auditoria com o Impeccable; o que mudaria a direção volta como proposta
7. percurso do dono no navegador, e só então o commit

---

## 4. Critério de conclusão por etapa
| Etapa | Critério de conclusão |
|---|---|
| 0 | |
| 1 | |
| 2 | |
| 3 | |
| 4 | |
| 5 | |
| 6 | |

---

## 5. Riscos e decisões em aberto
- 

---

## 6. Documentos relacionados no projeto
- `docs/design/design-system.md`
- `docs/context/current-status.md`
- `docs/context/handoff.md`
