# Quality gate de interface

## Objetivo

Definir o mínimo verificável para considerar que uma tela pode seguir: coerente com a direção aprovada, acessível e responsiva, com evidência medida.

Este gate complementa o [quality-gate-base](quality-gate-base.md). Ele não o substitui.

Relacionado a:

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [quality-gate-base](quality-gate-base.md)
- [frontend-web](../componentes/frontend-web.md)
- [skill-trilho-de-interface](../../03-skills/skill-trilho-de-interface.md)

---

## Princípio central

Coerência visual se prova com medida, não com impressão.

O objetivo deste arquivo é responder:  
**"o que precisa estar medido antes de considerar que uma tela pode seguir?"**

---

## Quando este gate se aplica

Aplicar quando a fatia cria ou muda uma tela.

Não aplicar a mudanças que não tocam o que o usuário vê nem como interage.

A forma operacional de chegar a estas evidências está na [skill-trilho-de-interface](../../03-skills/skill-trilho-de-interface.md).

---

## Gate de interface

### 1. Coerência com a fundação

A tela deve:

- partir da direção aprovada em `docs/design/`
- usar os tokens e componentes do sistema do projeto
- seguir os padrões de layout registrados no `docs/design/design-system.md`
- reproduzir a composição da maquete aprovada: uso da largura, hierarquia e agrupamento

Componente, variante ou token novo deve ter entrado no sistema antes de a tela usá-lo.

Pergunta central:  
**"esta tela parece parte do mesmo produto?"**

---

### 2. Maquete aprovada

Deve existir maquete da tela aprovada pelo dono antes do código, ou exceção registrada com motivo.

Desvio estrutural da maquete só com aprovação prévia.

Pergunta central:  
**"o que foi implementado é o que o dono aprovou?"**

---

### 3. Acessibilidade medida

Deve haver medida de:

- contraste mínimo AA em texto e elementos interativos
- alvos de toque de pelo menos 44 px
- foco visível e navegação por teclado
- rótulos em campos e controles

Pergunta central:  
**"a tela é usável por quem não usa mouse nem enxerga perfeitamente?"**

---

### 4. Responsividade medida

A tela deve ser capturada e verificada, no mínimo, nas larguras de 360, 390, 768 e 1440 px, sem rolagem lateral em nenhuma delas.

Pergunta central:  
**"a tela funciona do celular ao computador?"**

---

### 5. Temas

Quando o projeto tem tema claro e escuro, a tela deve ser capturada e medida nos dois.

Pergunta central:  
**"a tela continua legível e coerente nos dois temas?"**

---

### 6. Revisões aplicadas

Deve haver registro de:

- revisão do código contra as regras de interface (Vercel `web-design-guidelines`)
- `critique` e `audit` do Impeccable contra o `PRODUCT.md`
- achados resolvidos ou registrados como pendência

Achado que mudaria a direção aprovada vira proposta ao dono, não correção direta.

Pergunta central:  
**"as revisões rodaram e o que acharam foi tratado?"**

---

### 7. Percurso do dono

O dono percorreu a tela no navegador, com dados fictícios ou com os próprios dados, antes do commit.

Pergunta central:  
**"quem decide a direção viu a tela real funcionando?"**

---

## Aplicação por contexto

### Ajuste pequeno em tela existente

Exigir normalmente:

- coerência com a fundação
- responsividade medida nas larguras afetadas
- percurso do dono

---

### Tela nova ou mudança relevante

Exigir o gate completo.

---

### Modernização ou mudança de identidade

Exigir o gate completo em cada tela, mais a varredura final de todas as telas do escopo, nas quatro larguras e nos dois temas.

---

## Exemplos de evidência aceitável

- capturas do Playwright por largura e tema, lado a lado com a maquete
- números de contraste e de tamanho de alvo extraídos da página rodando
- lista de achados da Vercel e do Impeccable com o destino de cada um
- registro do percurso do dono

---

## Cuidados com a medida

- **Dizer que não é defeito pede prova medida.** Zoom, cache ou dado diferente se comprovam com números e capturas.
- **O medidor também erra.** Um script de captura pode tomar uma cor sólida por transparente e acusar contraste 1,00 num botão que mede 6:1. Achado estranho se confere direto no elemento antes de corrigir.
- **Uma aba antiga roda a tela anterior.** Antes de medir ou de pedir o percurso do dono, recarregar sem cache.

---

## Sinais de uso correto

Este gate está sendo bem usado quando:

- toda tela nova tem maquete aprovada e medida registrada
- as telas do projeto parecem um produto só
- achados de direção chegam ao dono como proposta
- regressões visuais aparecem nas capturas antes do commit

---

## Sinais de uso ruim

Há desvio quando:

- "está bonito" substitui medida
- a tela foi aprovada só pelo código, sem ser vista rodando
- o gate é aplicado a mudança sem tela, por ritual
- cada tela traz paleta, espaçamento ou layout próprios
- achado de revisão muda a direção sem passar pelo dono

---

## Relação com o quality gate base

O [quality-gate-base](quality-gate-base.md) continua valendo para toda mudança: execução mínima, integridade estrutural, validação mínima, impacto conhecido.

Este gate acrescenta o que é específico de interface. Uma tela que passa aqui e falha no base não está pronta.

---

## Regra final

O quality gate de interface existe para que coerência e acessibilidade não dependam de opinião.

Seu papel é simples:  
**garantir que cada tela segue a direção aprovada e prova isso com medida.**
