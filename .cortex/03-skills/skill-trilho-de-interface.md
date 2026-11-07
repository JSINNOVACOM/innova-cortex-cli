# Skill: Trilho de interface

## Objetivo
Garantir que toda tela de um projeto nasça coerente com a direção visual aprovada pelo dono, com layout que faça sentido dentro do sistema do projeto, e que essa coerência seja provada com medida, não com impressão.

O trilho combina cinco ferramentas de terceiros, cada uma com um papel só, e define quando cada uma entra: antes da primeira tela (fundação visual), a cada tela nova (nascimento de tela) e na modernização de telas que já existem.

Relacionado a:
- [Claude](../Claude.md)
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-arquiteto](../02-agentes/agente-arquiteto.md)
- [agente-planejador](../02-agentes/agente-planejador.md)
- [skill-validar-encerramento](skill-validar-encerramento.md)
- [skill-detectar-workflow-relevante](skill-detectar-workflow-relevante.md)
- [template-fundacao-visual](../04-templates/template-fundacao-visual.md)
- [template-plano-de-interface](../04-templates/template-plano-de-interface.md)
- [setup-project](../08-orquestracao/tipos-de-trabalho/setup-project.md)
- [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md)
- [create-feature](../08-orquestracao/tipos-de-trabalho/create-feature.md)
- [review](../08-orquestracao/tipos-de-trabalho/review.md)
- [refatoracao](../08-orquestracao/tipos-de-trabalho/refatoracao.md)
- [frontend-web](../10-padroes-tecnicos/componentes/frontend-web.md)
- [quality-gate-interface](../10-padroes-tecnicos/quality-gates/quality-gate-interface.md)

---

## Quando usar
Usar esta skill quando:
- o projeto tem interface e ainda não tem fundação visual registrada em `docs/design/`
- uma fatia de trabalho cria ou muda uma tela
- uma spec ou task descreve uma tela nova
- telas existentes precisam ser modernizadas ou alinhadas a uma identidade
- um review precisa avaliar interface

Não usar quando:
- o projeto não tem interface (API, CLI, worker, biblioteca)
- a mudança não toca o que o usuário vê nem como interage
- o projeto é uma POC descartável e o dono dispensou o trilho de forma explícita

O gatilho é **"a fatia cria ou muda uma tela"**. O trilho não é obrigatório para todo projeto.

---

## Princípio central
Tela não nasce do zero, nasce da fundação.

A coerência visual de um projeto não vem de auditar cada tela no fim. Ela vem de toda tela ser composta a partir da mesma direção aprovada, dos mesmos tokens, dos mesmos componentes e dos mesmos padrões de layout. As ferramentas entram **antes do código**, para gerar e garantir coerência, e depois do código, para provar que ela se manteve.

A direção visual é decisão do dono. O agente propõe, o dono aprova.

---

## Ferramentas e papéis
Cada ferramenta responde a uma pergunta diferente, e nenhuma substitui a outra.

| Ferramenta | Pergunta que responde | O que entrega |
|---|---|---|
| **Vercel** (`web-design-guidelines`) | O código segue as regras de interface? | Lista de falhas no código: teclado, foco, rótulos, formulários, acessibilidade |
| **Taste** (`design-taste-frontend`) | Qual direção visual? | Direções com variações (composição, tipografia, paleta) em maquete HTML, para o dono escolher |
| **UI UX Pro Max** (`ui-ux-pro-max`) | Como a direção vira sistema? | Tokens de cor, tamanhos e espaçamentos, e componentes com variantes e estados |
| **Impeccable** (`impeccable`) | O resultado está à altura do brief? | `init` gera o `PRODUCT.md`; `critique`, `audit` e `polish` revisam; `detect` acha defeitos na página rodando |
| **Playwright** (`playwright-cli` e os testes do projeto) | A tela real bate com a referência? | Capturas em computador e celular, claro e escuro; medidas de contraste, alvos de 44 px e rolagem lateral |

**Regra de convivência:** a Taste propõe, o dono aprova; as outras revisam e medem dentro da direção aprovada. Um achado que mudaria a direção volta ao dono como proposta, e não é aplicado direto.

---

## Momento A: fundação visual
Acontece uma vez por projeto, antes da primeira tela. Normalmente dentro do [setup-project](../08-orquestracao/tipos-de-trabalho/setup-project.md), na etapa condicional de projeto com interface.

### Passos
1. **Brief do produto.** Rodar `/impeccable init` para gerar o `PRODUCT.md`, alimentado por `docs/business/domain-overview.md` e `memory/project-context.md`. O `PRODUCT.md` é derivado: em conflito sobre domínio, vale o `domain-overview.md`; o `PRODUCT.md` é a fonte do brief visual (público, tom, intenção).
2. **Material oficial primeiro.** Se o projeto tem manual de marca, logo ou identidade existente, ele é a base da direção. A Taste trabalha em volta dele, não por cima.
3. **Direção visual.** A Taste propõe direções com variações em maquete HTML. O dono escolhe uma. A maquete escolhida vai para `docs/design/direcao/`.
4. **Sistema.** O UI UX Pro Max transforma a direção aprovada em tokens semânticos e componentes com variantes e estados, no código do projeto. Os padrões de layout (grade, larguras de conteúdo, densidade, espaçamento entre seções) são definidos aqui também.
5. **Registro.** Criar `docs/design/design-system.md` a partir do [template-fundacao-visual](../04-templates/template-fundacao-visual.md): direção aprovada, onde vivem os tokens e componentes, padrões de layout, critérios de medida.
6. **Referência de medida.** O Playwright captura a maquete aprovada nas larguras de referência, temas claro e escuro, em `docs/design/referencia/`.

### Saída
- `PRODUCT.md`
- `docs/design/direcao/` com a maquete aprovada
- tokens e componentes no código
- `docs/design/design-system.md`
- `docs/design/referencia/` com as capturas

---

## Momento B: nascimento de tela
Acontece em toda fatia que cria ou muda uma tela, dentro do [create-feature](../08-orquestracao/tipos-de-trabalho/create-feature.md) ou como task de uma spec do [cortex-spec-flow](../08-orquestracao/tipos-de-trabalho/cortex-spec-flow.md).

### Critério de entrada
Fatia com tela exige fundação visual existente. Sem fundação, a fatia não implementa tela: primeiro executa o momento A.

O dono pode dispensar a fundação de forma explícita. A exceção fica registrada em `memory/project-context.md` (quando vale para o projeto) ou na spec ou task da fatia (quando vale só para ela), com o motivo.

### Passos
1. **Partir da fundação.** Ler `docs/design/design-system.md` e a direção aprovada. A tela usa os tokens, componentes e padrões de layout que já existem.
2. **Maquete antes do código.** A Taste desenha a tela **dentro** da direção aprovada, sem abrir direção nova. O dono aprova. A maquete vai para `docs/design/telas/`.
3. **Faltou peça, estende o sistema primeiro.** Se a tela precisa de componente, variante ou token que não existe, o UI UX Pro Max estende o sistema antes, e só depois a tela usa. A extensão é registrada no `design-system.md`.
4. **Direção nova não é decisão da fatia.** Se a tela só funciona com uma direção diferente da aprovada, isso volta ao dono como proposta de mudança da fundação. Não aplicar direto.
5. **Implementar reproduzindo a composição da maquete**: uso da largura, hierarquia e agrupamento, e não só as cores. Desvio estrutural só com aprovação prévia do dono.
6. **Validar:** typecheck, lint, testes e build, conforme a stack.
7. **Medir e revisar:**
   - Playwright compara a tela real com a maquete e aplica os critérios do [quality-gate-interface](../10-padroes-tecnicos/quality-gates/quality-gate-interface.md);
   - Vercel revisa o código da tela;
   - Impeccable roda `critique` e `audit` contra o `PRODUCT.md`.
8. **Percurso do dono** no navegador, com dados fictícios ou do próprio dono, e só então o commit.

### Saída
- maquete aprovada em `docs/design/telas/`
- tela implementada com a composição da maquete
- evidência de medida registrada (capturas e números)
- `design-system.md` atualizado quando o sistema foi estendido

---

## Momento C: modernização
Acontece quando o projeto já tem telas e não tem fundação, ou quando a identidade precisa mudar. Conduzido pelo [refatoracao](../08-orquestracao/tipos-de-trabalho/refatoracao.md), com o plano montado a partir do [template-plano-de-interface](../04-templates/template-plano-de-interface.md).

A modernização cria a fundação (momento A) e alinha as telas existentes a ela, em etapas que vão da fundação sem mudança visível até a auditoria final. Dentro de cada etapa com tela, cada fatia segue os passos do momento B.

---

## Instalação
Todas as ferramentas são de terceiros e gratuitas. A instalação é do projeto, não da governança: o Cortex referencia as ferramentas, não as empacota.

**Pré-requisitos:** Node.js 22.20 ou mais novo (o CLI `skills` exige essa versão), Python 3 para o UI UX Pro Max e um Chrome ou Chromium para a Taste e o Playwright.

| Ferramenta | Comando recomendado | Alternativa |
|---|---|---|
| Vercel `web-design-guidelines` | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code` | |
| Taste `design-taste-frontend` | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` | `/plugin marketplace add Leonxlnx/taste-skill` e `/plugin install taste-skill@taste-skill` |
| UI UX Pro Max | `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` e `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill` | `npx ui-ux-pro-max-cli init --ai claude` |
| Impeccable | `npx impeccable install`, na raiz do projeto, e depois `/impeccable init` | `/plugin marketplace add pbakaus/impeccable` e instalar pelo `/plugin` |
| Playwright `playwright-cli` | `npm install -g @playwright/cli@latest` e `playwright-cli install --skills` | |

### Regras de instalação
- **Ler o `SKILL.md` antes de instalar.** Uma skill é instrução que o agente segue, e pode mandar editar arquivos do projeto.
- **Fixar a versão.** Pelo `skills-lock.json` (CLI `skills`) ou pela versão do plugin, para a mesma skill não mudar de comportamento entre duas sessões. Registrar as versões em `docs/design/design-system.md`.
- **Instalar fora de `.cortex/` só com aprovação do dono**, conforme a regra de fronteira.
- Depois de instalar, abrir uma sessão nova (a skill nova só aparece nela) e conferir se está na lista de skills.
- Atualizar: `npx skills list` mostra as instaladas e `npx skills update` atualiza; o Impeccable se atualiza com `npx impeccable update`.

Fontes: [vercel-labs/skills](https://github.com/vercel-labs/skills), [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [pbakaus/impeccable](https://github.com/pbakaus/impeccable), [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli).

---

## Cuidados que o uso real ensinou
- **A maquete aprovada é contrato de composição**, e não só de cor: a tela real reproduz o uso da largura, a hierarquia e a organização.
- **Material oficial vem antes da Taste.** Quando existe manual de marca ou logo, a identidade parte dele.
- **Antes de cada percurso do dono**, pedir recarga forçada (Ctrl+Shift+R): uma aba antiga roda a tela anterior.
- **Maquete com painel aberto:** no percurso, avisar que na tela real ele abre pelo clique, para o dono não achar que falta algo.
- **Nada de dado real nas maquetes e nos documentos**: valores e nomes fictícios, sempre.

Os cuidados sobre medida e evidência estão no [quality-gate-interface](../10-padroes-tecnicos/quality-gates/quality-gate-interface.md).

---

## Registros esperados
- fundação visual → `docs/design/` (ver [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md))
- exceção ao trilho → `memory/project-context.md` ou spec/task da fatia
- proposta de mudança de direção → `docs/context/current-status.md`, como pendência para o dono
- andamento da modernização → `docs/context/current-status.md` e `docs/context/handoff.md`

---

## Regras aplicáveis
- [00-regras-gerais](../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../01-regras/01-limites-de-atuacao.md)
- [04-estrutura-documental-de-projetos](../01-regras/04-estrutura-documental-de-projetos.md)

---

## Agentes que mais usam esta skill
- [agente-arquiteto](../02-agentes/agente-arquiteto.md) (fundação visual, sistema, modernização)
- [agente-planejador](../02-agentes/agente-planejador.md) (plano de interface, ordem das fatias)

---

## Sinais de uso correto
- toda tela nova parte da direção aprovada e dos componentes existentes
- a maquete é aprovada antes do código
- o sistema é estendido antes de a tela usar uma peça nova
- mudança de direção chega ao dono como proposta
- a coerência é provada com capturas e números

---

## Sinais de uso ruim
- tela implementada sem maquete aprovada e sem exceção registrada
- cada tela com sua própria paleta, espaçamento ou padrão de layout
- componente novo criado dentro da tela, fora do sistema
- a Taste abrindo direção nova a cada fatia
- "está bom" afirmado sem medida
- trilho aplicado a projeto sem interface, só por ritual

---

## Origem
Esta skill nasceu de uso real em modernização de interface, em que as cinco ferramentas foram combinadas por etapa. Ela torna esse método reutilizável e acrescenta a regra de nascimento de tela, para que telas novas já nasçam coerentes em vez de serem corrigidas depois.

---

## Regra final
O papel desta skill é simples:
**fazer cada tela nascer da fundação visual aprovada e provar, com medida, que ela continua coerente.**
