# Handoff entre agentes

## Objetivo
Definir como a passagem de contexto entre agentes deve acontecer, garantindo continuidade, clareza e rastreabilidade, sem depender de contexto implícito ou memória informal.

Relacionado a:
- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [01-limites-de-atuacao](../../01-regras/01-limites-de-atuacao.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [04-estrutura-documental-de-projetos](../../01-regras/04-estrutura-documental-de-projetos.md)
- [agente-inicializacao-projeto](../../02-agentes/agente-inicializacao-projeto.md)
- [agente-arquiteto](../../02-agentes/agente-arquiteto.md)
- [agente-analista](../../02-agentes/agente-analista.md)
- [agente-planejador](../../02-agentes/agente-planejador.md)

---

## Princípio central
Handoff não é apenas “passar adiante”.

Handoff existe para garantir que o próximo agente consiga começar com base suficiente, sem precisar reconstruir contexto do zero e sem assumir coisas que não foram explicitadas.

Um handoff bom reduz:
- ambiguidade
- retrabalho
- perda de contexto
- conclusões improvisadas
- desalinhamento entre etapas

---

## Papel deste arquivo
Este arquivo define regras mínimas para passagem de contexto entre agentes dentro do sistema.

Ele deve responder:
- o que precisa estar explícito antes de transferir responsabilidade?
- o que não pode ficar implícito?
- quando o handoff está incompleto?
- qual é a estrutura mínima aceitável para a próxima etapa começar bem?

---

## O que este arquivo deve fazer
Este arquivo deve:
- padronizar a passagem entre agentes
- preservar rastreabilidade
- reduzir dependência de contexto informal
- explicitar estado atual e próximo passo
- proteger a continuidade do trabalho

---

## O que este arquivo não deve fazer
Este arquivo não deve:
- substituir os arquivos reais de contexto do projeto
- virar documentação principal do projeto
- repetir integralmente tudo que já está documentado
- funcionar como log cronológico de execução
- servir como desculpa para passar contexto mal consolidado

---

## Quando um handoff é necessário
Handoff é necessário quando:

- um agente encerra sua etapa e outro deve assumir
- o trabalho precisa ser retomado depois
- há troca de foco entre análise, estruturação e planejamento
- o fluxo precisa parar e ser retomado sem contexto implícito
- a próxima etapa depende do entendimento produzido até aqui

---

## Quando um handoff não deve ocorrer
Handoff não deve acontecer como formalidade vazia.

Evitar handoff quando:
- nada relevante foi produzido
- a etapa anterior ainda não atingiu saída mínima
- a passagem ocorreria só para “andar o fluxo”
- ainda falta clarificação essencial
- o contexto continua confuso ou contraditório

Nesses casos, o correto é:
- continuar a etapa atual
- consolidar melhor
- ou parar para validação

---

## Estrutura mínima de handoff
Todo handoff entre agentes deve deixar explícito, no mínimo:

### 1. Contexto resumido
- do que se trata a demanda
- em que tipo de trabalho ela se encaixa
- qual é o objetivo atual

### 2. Estado atual
- o que já foi entendido
- o que já foi produzido
- o que já está minimamente consolidado

### 3. Pontos ainda abertos
- dúvidas
- lacunas
- riscos
- validações pendentes

### 4. Motivo da transferência
- por que outro agente deve assumir agora
- o que mudou de etapa
- o que o próximo agente precisa fazer

### 5. Próxima ação esperada
- qual é o próximo movimento mais sensato
- qual saída mínima é esperada da próxima etapa

### 6. Referências relevantes
- quais documentos devem ser lidos primeiro
- quais materiais são base para a próxima etapa

---

## Estrutura mínima em formato prático

```text
Handoff entre agentes

1. Contexto resumido
2. Estado atual
3. O que já está consolidado
4. O que ainda está em aberto
5. Motivo da transferência
6. Próxima ação esperada
7. Referências relevantes
8. Alertas importantes
```

---

## O que não pode ficar implícito
Um handoff não deve depender de coisas como:
- “o próximo agente vai entender”
- “isso está óbvio pelo contexto”
- “depois alguém organiza”
- “já deve estar claro para quem pegar”

Especialmente, não devem ficar implícitos:
- objetivo atual
- status da demanda
- principais lacunas
- risco principal
- motivo da troca de agente
- próxima ação desejada

---

## Critérios de qualidade de um bom handoff
Um handoff está bom quando:

- o próximo agente sabe por onde começar
- o objetivo da próxima etapa está claro
- o que está confirmado e o que está em aberto está separado
- a passagem evita releitura desnecessária de tudo
- as referências mais importantes já estão apontadas
- o risco de interpretação errada foi reduzido

---

## Sinais de handoff ruim
Há desvio quando:

- o próximo agente precisa reconstruir o contexto inteiro
- o objetivo da próxima etapa não está explícito
- a troca acontece sem saída mínima da etapa anterior
- o handoff só repete texto sem indicar direção
- lacunas críticas não são mencionadas
- o fluxo troca de agente cedo demais

---

## Relação com `docs/context/current-status.md`
Quando a demanda pertence a um projeto específico, o estado vivo do trabalho deve estar no próprio projeto, especialmente em:
- `docs/context/current-status.md`

Esse arquivo deve registrar:
- onde o trabalho está agora
- o que está em andamento
- o que ainda falta
- prioridades e bloqueios

O handoff entre agentes não substitui esse registro.

---

## Relação com `docs/context/handoff.md`
Quando a demanda pertence a um projeto específico, a continuidade formal da retomada deve estar em:
- `docs/context/handoff.md`

Esse é o handoff principal do projeto.

O handoff entre agentes deve ser compatível com ele, não paralelo nem concorrente.

Regra prática:
- handoff operacional entre agentes → ajuda o fluxo
- handoff do projeto → preserva continuidade local do projeto

---

## Relação com roteamento
Roteamento responde:
- para onde a demanda deve ir?

Handoff responde:
- o que a próxima etapa precisa receber para começar bem?

Os dois devem andar juntos:
- roteamento sem handoff gera troca vazia
- handoff sem roteamento gera troca sem direção

---

## Relação com material gerado

Se o trabalho gerar análise, plano, decisão ou entrega relevante, esses materiais devem ser registrados no próprio projeto, em `docs/`:

- análises → `docs/analysis/`
- decisões → `docs/decisions/`
- specs → `docs/specs/`
- visão futura → `docs/to-be/`

O handoff em si não deve virar depósito de output. Ele deve continuar sendo:
- passagem de contexto
- explicitação de estado
- indicação de próxima etapa

Pode referenciar esses materiais, mas não duplicá-los.

---

## Regra de proporcionalidade
Nem todo handoff precisa do mesmo nível de detalhe.

A profundidade do handoff deve considerar:
- criticidade da demanda
- complexidade do contexto
- risco de interpretação errada
- número de dependências
- impacto do próximo passo

Regra prática:
- demanda simples → handoff mais curto
- demanda complexa ou arriscada → handoff mais explícito

---

## Exemplo de uso correto
Exemplo resumido:

- a análise já separou fatos, hipóteses e lacunas
- agora a demanda precisa de estruturação
- o handoff deixa claro:
  - contexto do problema
  - o que já foi entendido
  - o que ainda está aberto
  - por que o próximo agente é o arquiteto
  - quais documentos ele deve ler primeiro

Isso é handoff bom.

---

## Exemplo de uso incorreto
Exemplo ruim:

- “já analisei”
- “agora pode seguir”
- “o resto está no contexto”

Isso não preserva continuidade e não reduz ambiguidade.

---

## Regra final
Handoff entre agentes existe para tornar a passagem de responsabilidade clara, útil e retomável.

Seu papel é simples:
**garantir que o próximo agente receba contexto suficiente para começar bem, sem depender de adivinhação.**
