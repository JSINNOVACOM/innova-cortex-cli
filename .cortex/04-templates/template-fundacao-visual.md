# Template - Fundação visual

## Objetivo
Registrar a fundação visual de um projeto com interface: a direção aprovada pelo dono, onde vive o sistema (tokens e componentes), os padrões de layout e os critérios de medida que toda tela deve seguir.

Este documento pertence ao projeto.

Ele é a referência que toda tela nova consulta antes de nascer, para que as telas do projeto sejam coerentes entre si e com a direção aprovada.

Relacionado a:
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)
- [skill-trilho-de-interface](../03-skills/skill-trilho-de-interface.md)
- [frontend-web](../10-padroes-tecnicos/componentes/frontend-web.md)
- [quality-gate-interface](../10-padroes-tecnicos/quality-gates/quality-gate-interface.md)
- [templates-readme](templates-readme.md)

---

## Papel deste documento no projeto
Este arquivo existe para que a direção visual não dependa de memória informal.

Usar este documento para:
- registrar qual direção o dono aprovou e onde está a maquete
- apontar onde vivem os tokens e componentes no código
- fixar os padrões de layout
- registrar extensões do sistema feitas por fatias
- registrar as versões das ferramentas do trilho

Cria no projeto:
- `docs/design/design-system.md`

---

## Regra de fronteira

Este documento registra decisões e referências. Os tokens e componentes vivem no código; as maquetes vivem em `docs/design/direcao/` e `docs/design/telas/`; as capturas de referência vivem em `docs/design/referencia/`.

Mudança de direção é decisão do dono. Este documento só muda de direção depois dessa aprovação.

---

## Metadados
- **Projeto:**
- **Documento:** design-system
- **Estado:** inicial | parcial | validado | pendente de revisão
- **Última atualização:**
- **Responsável:**

---

## 1. Brief do produto
- **PRODUCT.md:** caminho do arquivo gerado por `/impeccable init`
- **Fonte de domínio:** `docs/business/domain-overview.md`
- **Material oficial usado como base:** manual de marca, logo ou identidade existente, se houver

---

## 2. Direção aprovada
- **Maquete aprovada:** caminho em `docs/design/direcao/`
- **Data da aprovação:**
- **Resumo da direção:** composição, tipografia, paleta e tom, em poucas linhas
- **Direções descartadas e motivo:**

---

## 3. Sistema
- **Tokens:** caminho no código e convenção de nomes semânticos
- **Componentes:** caminho no código
- **Variantes e estados cobertos:**
- **Temas:** claro, escuro ou ambos

---

## 4. Padrões de layout
- **Grade e larguras de conteúdo:**
- **Densidade e espaçamento entre seções:**
- **Navegação e casca da aplicação:**
- **Padrões recorrentes de tela (lista, detalhe, formulário, painel):**

---

## 5. Critérios de medida
- **Larguras de referência:** 360, 390, 768 e 1440 px
- **Contraste:** AA
- **Alvos de toque:** pelo menos 44 px
- **Rolagem lateral:** nenhuma
- **Capturas de referência:** caminho em `docs/design/referencia/`

Critérios adicionais do projeto, se houver:

- 

---

## 6. Extensões do sistema
Registrar cada componente, variante ou token acrescentado por uma fatia.

| Data | Peça | Motivo | Fatia ou task |
|---|---|---|---|
| | | | |

---

## 7. Telas aprovadas
| Tela | Maquete | Data da aprovação |
|---|---|---|
| | | |

---

## 8. Ferramentas e versões
| Ferramenta | Versão fixada | Onde está instalada |
|---|---|---|
| Vercel `web-design-guidelines` | | |
| Taste `design-taste-frontend` | | |
| UI UX Pro Max | | |
| Impeccable | | |
| Playwright `playwright-cli` | | |

---

## 9. Exceções
Registrar dispensas do trilho aprovadas pelo dono, com motivo.

- 

---

## 10. Documentos relacionados no projeto
- `docs/business/domain-overview.md`
- `memory/project-context.md`
- `docs/context/current-status.md`
