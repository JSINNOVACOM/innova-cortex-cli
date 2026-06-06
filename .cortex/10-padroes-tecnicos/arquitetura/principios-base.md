# Princípios base de arquitetura

## Objetivo
Definir princípios arquiteturais transversais e reutilizáveis para orientar decisões técnicas no ecossistema, sem misturar esse papel com regras globais do sistema, detalhes de stack específica ou decisões locais de projeto.

Relacionado a:
- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)
- [quality-gate-base](../quality-gates/quality-gate-base.md)

---

## Princípio central
Arquitetura não é apenas desenho de alto nível.

Arquitetura existe para sustentar clareza, evolução, manutenção, integração e mudança com risco controlado.

Este arquivo existe para responder perguntas como:
- que princípios técnicos valem de forma ampla no ecossistema?
- que tipo de decisão arquitetural tende a reduzir retrabalho?
- o que deve orientar a organização de componentes e responsabilidades?
- como evitar acoplamento desnecessário e complexidade ornamental?

---

## Papel deste arquivo
Este arquivo define princípios arquiteturais base do ecossistema.

Ele deve servir como referência transversal para múltiplos projetos, stacks e componentes.

Ele não substitui:
- arquitetura específica de um projeto
- decisão técnica local
- guideline detalhado de stack
- regra de componente específico
- quality gate técnico

Seu papel é orientar decisões recorrentes com coerência suficiente, sem tentar antecipar toda situação possível.

---

## O que este arquivo deve conter
Este arquivo deve concentrar princípios como:
- separação de responsabilidades
- modularidade com sentido prático
- contratos claros entre partes do sistema
- baixo acoplamento desnecessário
- previsibilidade estrutural
- tratamento consistente de erro e integração
- evolução segura da solução

---

## O que este arquivo não deve conter
Este arquivo não deve virar:
- tutorial de framework
- manual completo de arquitetura corporativa
- catálogo de padrões por moda
- coleção de diagramas sem uso real
- repositório de decisões locais de um único projeto
- lista infinita de regras sem prioridade

---

## Regra de proporcionalidade
Nem toda solução precisa do mesmo nível de sofisticação arquitetural.

A aplicação destes princípios deve considerar:
- tamanho do problema
- criticidade do domínio
- risco de mudança
- volume de integrações
- ritmo de evolução esperado
- custo operacional da complexidade

Regra prática:
- complexidade baixa → arquitetura mais simples
- complexidade alta ou risco alto → arquitetura mais explícita

---

## Princípios base

## 1. Clareza antes de sofisticação
A arquitetura deve primeiro tornar o sistema compreensível.

Preferir:
- nomes claros
- fronteiras perceptíveis
- organização legível
- fluxo minimamente rastreável
- Variáveis com tipagem

Evitar:
- abstrações cedo demais
- camadas criadas por hábito
- complexidade sem ganho operacional claro
- Variáveis com tipagem genericas

Pergunta útil:
**“isso deixou o sistema mais compreensível ou apenas mais sofisticado?”**

---

## 2. Separação de responsabilidades
Cada parte do sistema deve ter papel minimamente claro.

Buscar separar, quando fizer sentido:
- interface
- aplicação ou orquestração
- domínio ou regra relevante
- integração externa
- persistência
- infraestrutura transversal

A separação não precisa ser idêntica em todo projeto, mas deve reduzir mistura confusa de responsabilidades.

Pergunta útil:
**“esta parte está fazendo mais do que deveria?”**

---

## 3. Acoplamento controlado
As partes do sistema não devem depender mais do que o necessário umas das outras.

Buscar:
- dependências explícitas
- contratos claros
- isolamento de detalhes internos
- redução de efeito cascata em mudanças

Evitar:
- conhecimento excessivo entre módulos
- acesso espalhado a detalhes internos
- acoplamento acidental por conveniência imediata

Regra prática:
quanto maior o acoplamento desnecessário, maior o custo de evoluir com segurança.

---

## 4. Coesão com sentido de negócio ou responsabilidade
Partes que mudam juntas ou atendem à mesma responsabilidade devem, em geral, permanecer próximas.

Buscar:
- agrupar por responsabilidade real
- reduzir espalhamento artificial
- manter contexto relacionado acessível

Evitar:
- fragmentação excessiva
- organização que parece bonita, mas dificulta entendimento
- separação tão rígida que o fluxo real do sistema fica invisível

Pergunta útil:
**“essas partes realmente pertencem juntas?”**

---

## 5. Contratos explícitos entre fronteiras
Toda fronteira relevante do sistema deve ter contrato claro o suficiente para evitar ambiguidade.

Exemplos de fronteira:
- frontend ↔ backend
- serviço ↔ serviço
- aplicação ↔ banco
- sistema ↔ integração externa
- módulo ↔ módulo

Buscar:
- entradas e saídas compreensíveis
- formatos previsíveis
- tratamento razoável de erro
- versionamento ou compatibilidade quando aplicável

Evitar:
- integração implícita demais
- contratos informais frágeis
- dependência de comportamento acidental

---

## 6. Estado atual separado de visão futura
Ao evoluir arquitetura, é obrigatório distinguir:
- o que existe hoje
- o que está frágil
- o que é hipótese de melhoria
- o que é direção futura recomendada

Misturar essas camadas gera:
- falsa sensação de maturidade
- decisão apressada
- retrabalho
- documentação confusa

Este princípio vale tanto para análise quanto para desenho de solução.

---

## 7. Evolução incremental preferível à reconstrução impulsiva
Quando possível, preferir evolução em passos compreensíveis e reversíveis.

Buscar:
- mudanças com impacto entendido
- checkpoints claros
- redução de risco por etapas
- aprendizado durante a evolução

Evitar:
- reescrever tudo por desconforto local
- big bang sem base suficiente
- modernização ampla sem critérios de corte

Isso não significa nunca refazer algo grande.
Significa apenas que a decisão deve ser consciente, não impulsiva.

---

## 8. Tratamento de erro como parte da arquitetura
Erro não é detalhe periférico.

A arquitetura deve prever minimamente:
- onde erros podem ocorrer
- como eles serão propagados ou contidos
- como serão observados
- como o sistema evita colapso em cadeia

Buscar:
- mensagens coerentes
- propagação controlada
- logs úteis
- comportamento previsível em falha

Evitar:
- tratamento improvisado em cada ponto
- silêncio diante de falhas relevantes
- colapso total da experiência por erro localizado

---

## 9. Observabilidade mínima desde cedo
Uma arquitetura saudável deve permitir entender o comportamento do sistema sem depender apenas de memória informal.

Buscar, quando aplicável:
- logs úteis
- sinalização de falhas
- rastreabilidade mínima de fluxos relevantes
- apoio a diagnóstico real

Observabilidade não precisa começar sofisticada.
Mas não deve ser completamente ausente em partes críticas.

---

## 10. Dependências devem servir ao sistema, não dominá-lo
Bibliotecas, frameworks e ferramentas devem apoiar a solução.

Elas não devem se tornar o centro da arquitetura por si só.

Buscar:
- adoção consciente de dependências
- entendimento do impacto estrutural
- uso proporcional ao problema

Evitar:
- arquitetura moldada só pela moda do framework
- dependência difícil de substituir sem motivo claro
- abstração criada apenas para agradar ferramenta

---

## 11. Reuso com critério
Reutilização é útil quando reduz duplicação relevante sem aumentar confusão.

Buscar:
- reuso de padrões recorrentes
- extração de partes realmente compartilhadas
- centralização apenas quando houver ganho real

Evitar:
- generalização cedo demais
- “componente genérico” que ninguém entende
- centralização de responsabilidades incompatíveis

Pergunta útil:
**“isso é um padrão recorrente ou só uma coincidência temporária?”**

---

## 12. Decisões arquiteturais devem explicitar trade-offs
Toda decisão relevante de arquitetura deveria, quando possível, deixar claro:
- o que ela favorece
- o que ela sacrifica
- que risco reduz
- que custo introduz

Arquitetura sem trade-off explícito tende a virar opinião disfarçada de regra.

---

## Relação com stacks
Stacks específicas detalham como aplicar esses princípios em tecnologias concretas.

Exemplo:
- `react-typescript.md` detalha a stack React + TypeScript
- `java-spring.md` pode detalhar a stack Java + Spring

Este arquivo continua acima desse nível.

Ele não substitui as stacks.
Ele orienta o raciocínio transversal.

---

## Relação com componentes
Componentes definem o papel que uma parte do sistema exerce.

Exemplo:
- `frontend-web.md`
- `backend-api.md`

Este arquivo ajuda a orientar como esses componentes devem ser organizados e integrados com clareza.

---

## Relação com quality gates
Princípio arquitetural e quality gate não são a mesma coisa.

Diferença prática:
- princípio arquitetural orienta decisão e estrutura
- quality gate verifica o mínimo para seguir com segurança

Os dois se complementam.

---

## Relação com projetos reais
Se um projeto precisar de decisão arquitetural específica, essa decisão deve viver no próprio projeto.

Este arquivo existe para registrar o que tende a valer de forma mais ampla.

Regra prática:
- princípio reutilizável → fica aqui
- decisão local e contextual → fica no projeto

---

## Perguntas úteis para aplicação
Ao tomar decisão arquitetural, vale responder:
- isso deixou responsabilidades mais claras?
- houve redução real de acoplamento ou só mudança cosmética?
- o contrato entre partes ficou mais explícito?
- a solução ficou mais fácil de evoluir?
- o tratamento de erro continua coerente?
- a complexidade introduzida é proporcional ao problema?

---

## Sinais de bom uso
Este arquivo está sendo bem usado quando:
- as decisões ficam menos improvisadas
- componentes e stacks conversam com mais coerência
- o sistema evita abstração ornamental
- a arquitetura fica mais compreensível
- mudanças importantes passam a explicitar trade-offs

---

## Sinais de uso ruim
Há desvio quando:
- qualquer preferência vira “princípio”
- o arquivo começa a substituir decisões de projeto
- a arquitetura fica mais complexa sem ganho claro
- abstrações são criadas por costume
- o documento vira coleção de frases bonitas sem efeito real

---

## Regra final
Princípios base de arquitetura existem para aumentar coerência, não para congelar decisões.

Seu papel é simples:
**orientar escolhas estruturais com clareza, proporcionalidade e capacidade real de evolução.**
