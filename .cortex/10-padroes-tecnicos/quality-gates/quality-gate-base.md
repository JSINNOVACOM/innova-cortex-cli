# Quality gate base

## Objetivo

Definir um conjunto técnico mínimo de validações para permitir avanço com segurança, sem transformar o processo em burocracia excessiva.

Relacionado a:

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)

---

## Princípio central

Quality gate não existe para engessar.

Ele existe para evitar avanço irresponsável.

O objetivo deste arquivo é responder:  
**“qual é o mínimo técnico aceitável antes de considerar que algo pode seguir?”**

---

## Papel deste quality gate

Este arquivo define o gate técnico base do ecossistema.

Ele serve como referência mínima reutilizável para múltiplos projetos, stacks e fluxos.

Pode ser complementado por gates mais específicos no futuro, mas não deve ser inflado cedo demais.

---

## O que este gate deve proteger

Este gate existe para reduzir risco em pontos como:

- código que não compila ou não executa
- mudança sem validação mínima
- ausência total de teste quando teste era esperado
- quebra silenciosa de contrato
- observabilidade inexistente
- impacto desconhecido
- rollback impossível ou não pensado

---

## O que este gate não deve virar

Este gate não deve virar:

- checklist gigante
- auditoria infinita
- exigência idêntica para qualquer contexto
- barreira burocrática sem ganho real
- justificativa para não entregar nada

O gate base deve ser leve, progressivo e proporcional.

---

## Regra de proporcionalidade

Nem toda demanda precisa do mesmo rigor.

A aplicação do gate deve considerar:

- criticidade da mudança
- impacto esperado
- tipo de componente
- tipo de projeto
- estágio da iniciativa
- risco de regressão
- custo de falha

Regra prática:

- quanto maior o risco, maior o rigor
- quanto menor o risco, mais leve o gate pode ser

---

## Quality gate base

### 1. Execução mínima viável

Deve haver evidência de que a mudança consegue:

- compilar, quando aplicável
- iniciar, quando aplicável
- executar o fluxo principal mínimo, quando aplicável

Pergunta central:  
**“isso roda minimamente?”**

---

### 2. Integridade estrutural

A mudança não deve deixar:

- arquivos quebrados
- estrutura incoerente
- organização impossível de entender
- dependências claramente inválidas
- acoplamento absurdo introduzido sem motivo

Pergunta central:  
**“a mudança ficou estruturalmente íntegra?”**

---

### 3. Validação mínima

Deve existir alguma forma de validação proporcional ao contexto.

Exemplos:

- teste automatizado
- teste manual guiado
- evidência de execução
- validação de contrato
- revisão técnica

Pergunta central:  
**“qual foi a validação mínima desta mudança?”**

---

### 4. Impacto conhecido

Antes de seguir, deve estar claro:

- o que foi alterado
- o que pode ser afetado
- qual é o risco principal
- o que ainda não foi validado

Pergunta central:  
**“o impacto foi explicitado ou estamos avançando no escuro?”**

---

### 5. Tratamento de erro e observabilidade mínima

Quando aplicável, a mudança deve prever minimamente:

- tratamento de erro coerente
- logs úteis
- sinalização de falha
- visibilidade mínima do comportamento

Pergunta central:  
**“se isso falhar, alguém percebe e entende?”**

---

### 6. Caminho de retorno ou contenção

Quando o impacto justificar, deve existir pelo menos uma ideia clara de:

- rollback
- desativação
- contenção
- mitigação inicial

Pergunta central:  
**“se der errado, existe saída?”**

---

## Aplicação por contexto

### Mudança pequena e local

Exigir normalmente:

- execução mínima
- validação mínima
- impacto conhecido

---

### Feature moderada

Exigir normalmente:

- execução mínima
- integridade estrutural
- validação mínima
- impacto conhecido
- observabilidade mínima

---

### Mudança crítica

Exigir normalmente:

- execução mínima
- integridade estrutural
- validação robusta
- impacto conhecido
- observabilidade
- caminho de retorno ou mitigação

---

## Exemplos de evidência aceitável

Dependendo do contexto, o gate pode ser satisfeito com coisas como:

- build passando
- teste manual documentado
- testes automatizados relevantes
- captura de execução
- checklist de impacto
- revisão técnica explícita
- plano de rollback resumido

O importante não é ritualizar a evidência.  
O importante é que ela exista de forma útil.

---

## Sinais de uso correto

Este quality gate está sendo bem usado quando:

- evita avanço irresponsável
- protege sem travar tudo
- é proporcional ao risco
- deixa claro o mínimo aceitável
- melhora confiança na entrega

---

## Sinais de uso ruim

Há desvio quando:

- qualquer mudança precisa do mesmo nível de rigor
- o gate vira burocracia ornamental
- o time ou os agentes preenchem sem pensar
- o processo trava por excesso de formalismo
- falhas óbvias continuam passando mesmo com gate “aprovado”

---

## Relação com stacks e componentes

Este é um gate base.

Stacks e componentes específicos podem complementar este gate depois, quando houver necessidade real.

Exemplo:

- uma stack pode exigir build/lint específicos
- um componente pode exigir observabilidade mais forte
- uma integração pode exigir validação contratual mais rigorosa

Mas esses refinamentos devem nascer depois, não agora.

---

## Relação com projetos reais

Este arquivo não substitui critérios locais de um projeto específico.

Ele serve como base transversal.

Se um projeto precisar de exigências adicionais, elas devem ser registradas no próprio projeto ou em padrões técnicos mais específicos.

---

## Regra final

O quality gate base existe para impedir avanço cego, não para impedir avanço.

Seu papel é simples:  
**garantir um mínimo técnico responsável antes de seguir.**
