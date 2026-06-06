# Stack: Python

## Objetivo

Definir padrões técnicos iniciais para projetos que utilizem Python, mantendo consistência, previsibilidade, testabilidade, observabilidade e boa separação de responsabilidades.

Este documento orienta o uso de Python como stack de desenvolvimento para aplicações, serviços, automações, integrações, pipelines, workers, APIs e componentes internos.

**Relacionado a:**

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)
- [quality-gate-base](../quality-gates/quality-gate-base.md)

---

## Princípio central

Este arquivo trata da stack concreta Python. Ele não define sozinho o papel do componente no sistema.

Ele define como Python deve ser usado de forma consistente, sustentável e evolutiva. A pergunta central aqui é:

> “Como construir com Python de forma clara, testável, observável, performática e preparada para evolução?”

Python deve ser usado com simplicidade, mas não de forma desorganizada. Código Python saudável não é apenas código curto: é código previsível, com responsabilidades bem separadas e comportamento fácil de validar.

---

## O que esta stack representa

Esta stack é adequada para projetos em que Python é usado como base para:

- APIs e serviços HTTP
- workers assíncronos
- automações locais
- integrações entre sistemas
- processamento de arquivos
- pipelines de dados
- scripts operacionais controlados
- ferramentas internas de engenharia
- aplicações orientadas a domínio
- agentes, orquestradores e serviços auxiliares de IA

Python normalmente envolve:

- módulos e pacotes
- tipagem gradual
- uso de bibliotecas externas
- integração com bancos, filas, APIs e arquivos
- testes automatizados
- logs, métricas e rastreabilidade
- validação de entrada e saída
- tratamento explícito de erro
- empacotamento e distribuição

---

## O que entra aqui

Este arquivo deve conter convenções como:

- organização de pastas
- separação de responsabilidades
- arquitetura em camadas
- Clean Architecture
- Ports and Adapters
- padrão de services, use cases e repositories
- uso de tipagem
- validação de dados
- tratamento de erros
- logging e observabilidade
- testes
- performance
- configuração
- empacotamento
- qualidade mínima da stack

---

## O que não entra aqui

Este arquivo não deve virar:

- tutorial completo de Python
- catálogo de snippets
- documentação de uma biblioteca específica
- regra de negócio de produto
- padrão de um único projeto promovido cedo demais a padrão geral
- substituto para documentação arquitetural do sistema
- lista infinita de ferramentas obrigatórias

O papel do componente deve continuar em documentos próprios, por exemplo:

- `api-service`
- `worker`
- `cli-tool`
- `batch-job`
- `data-pipeline`
- `automation-service`
- `agent-service`

Este arquivo define o uso consistente da stack Python, não o propósito de cada aplicação.

---

## Princípios de uso da stack

### 1. Python simples, mas não improvisado

Python permite escrever código rapidamente, mas isso não deve justificar baixa disciplina técnica.

Preferir:

- funções pequenas e com responsabilidade clara
- módulos coesos
- nomes explícitos
- dependências controladas
- comportamento previsível
- erros tratados na borda correta
- testes para fluxos relevantes
- tipagem em pontos críticos
- padronização de logs e configurações

Evitar:

- scripts gigantes
- funções com múltiplas responsabilidades
- lógica de negócio misturada com integração externa
- `print` como mecanismo de observabilidade
- exceções genéricas sem contexto
- imports circulares
- dependência direta de frameworks dentro do domínio

---

### 2. PEP8 como base, clareza como objetivo

PEP8 deve ser tratado como base mínima de consistência, não como burocracia estética.

Seguir:

- nomes de variáveis e funções em `snake_case`
- classes em `PascalCase`
- constantes em `UPPER_CASE`
- imports organizados
- linhas legíveis
- módulos com responsabilidade clara

Preferir ferramentas automáticas para manter consistência:

- `ruff` para lint
- `black` ou `ruff format` para formatação
- `mypy` ou `pyright` para checagem de tipos quando aplicável
- `pre-commit` para validações locais antes do commit

Regra prática:

> O estilo deve ser automatizado sempre que possível. Discussões humanas devem focar em design, clareza, comportamento e riscos.

---

### 3. Tipagem gradual, mas intencional

Python não exige tipagem estática, mas projetos sustentáveis devem usar type hints de forma intencional.

Usar tipagem principalmente em:

- contratos públicos de funções e métodos
- use cases
- services
- adapters
- DTOs
- modelos de entrada e saída
- integrações externas
- funções com regra de negócio
- retornos não triviais

Preferir:

```python
def calculate_total(items: list[OrderItem]) -> Decimal:
    ...
```

Evitar:

```python
def calculate_total(items):
    ...
```

Evitar também tipagem enganosa, usada apenas para satisfazer ferramenta.

Quando a estrutura de dados for importante, preferir:

- `dataclass`
- `TypedDict`
- `Protocol`
- `Enum`
- modelos Pydantic quando houver validação de borda
- objetos de domínio simples quando fizer sentido

---

### 4. Validação nas bordas

Dados externos devem ser tratados como não confiáveis.

Validar entradas vindas de:

- APIs HTTP
- filas
- arquivos
- variáveis de ambiente
- banco de dados legado
- chamadas externas
- payloads produzidos por LLMs
- argumentos de CLI
- webhooks

A validação deve acontecer preferencialmente na borda da aplicação, antes de entrar no domínio ou caso de uso.

Ferramentas possíveis:

- Pydantic
- dataclasses com validação explícita
- schemas dedicados
- validações manuais simples quando o contexto for pequeno

Regra prática:

> O domínio não deve depender de payload bruto externo.

---

### 5. Separar domínio, aplicação e infraestrutura

A estrutura deve deixar claro o que é regra de negócio, o que é orquestração e o que é detalhe técnico.

Separação recomendada:

- **Domain:** entidades, regras, objetos de valor, exceções de domínio e contratos conceituais.
- **Application:** casos de uso, orquestração, fluxos, comandos e queries.
- **Infrastructure:** banco de dados, APIs externas, filas, arquivos, cache, frameworks e provedores.
- **Interface / Entry Points:** controllers, rotas HTTP, consumers, CLIs, jobs, handlers e endpoints.

Regra prática:

> O domínio não deve conhecer FastAPI, Flask, SQLAlchemy, boto3, requests, Kafka, Redis ou qualquer detalhe externo.

---

### 6. Ports and Adapters como padrão de isolamento

Quando houver dependência de sistemas externos, usar o conceito de portas e adaptadores.

Portas representam contratos internos:

```python
from typing import Protocol

class CustomerRepository(Protocol):
    def find_by_id(self, customer_id: str) -> Customer | None:
        ...
```

Adaptadores implementam detalhes externos:

```python
class SqlAlchemyCustomerRepository:
    def find_by_id(self, customer_id: str) -> Customer | None:
        ...
```

Benefícios:

- facilita testes
- reduz acoplamento
- permite trocar infraestrutura
- protege o domínio
- melhora leitura arquitetural

Regra prática:

> Use case depende de uma porta. Infraestrutura implementa a porta.

---

### 7. Clean Architecture com proporcionalidade

Clean Architecture deve ser usada para proteger regras importantes, não para criar camadas artificiais.

Usar com mais rigor quando o projeto tiver:

- regras de negócio relevantes
- integrações externas
- necessidade de testes
- evolução esperada
- múltiplos entry points
- risco operacional
- orquestrações complexas
- persistência relevante

Usar de forma mais leve quando for:

- script pequeno
- automação temporária
- prova de conceito
- tarefa operacional simples

Regra prática:

> Arquitetura deve reduzir risco e aumentar clareza. Se só aumenta cerimônia, está errada para o contexto.

---

### 8. Arquitetura em camadas sem vazamento

Quando usar camadas, evitar que detalhes inferiores contaminem camadas superiores.

Fluxo recomendado de dependência:

```text
interfaces -> application -> domain
infrastructure -> application/domain contracts
```

Evitar:

```text
domain -> infrastructure
domain -> framework
use_case -> controller
entity -> database model
```

Exemplo de separação saudável:

- Controller recebe HTTP.
- Controller transforma request em command/query.
- Use case executa fluxo.
- Use case chama porta.
- Adapter acessa banco/API/fila.
- Controller transforma output em response.

---

### 9. Design Patterns com intenção

Design Patterns devem ser usados para resolver problemas reais de design, não para decorar código.

Padrões úteis em Python:

- **Strategy:** variações de comportamento por tipo, regra ou provedor.
- **Factory:** criação controlada de objetos complexos.
- **Adapter:** integração com serviços externos.
- **Repository:** abstração de persistência.
- **Unit of Work:** controle transacional.
- **Command:** representação de uma intenção de execução.
- **Query:** representação de uma consulta sem efeito colateral.
- **Template Method:** fluxo padrão com etapas customizáveis.
- **Chain of Responsibility:** pipelines de validação ou processamento.
- **Producer / Consumer:** processamento assíncrono ou orientado a fila.
- **Reducer:** consolidação determinística de estados ou eventos.

Evitar:

- criar pattern sem necessidade
- transformar tudo em classe
- criar abstrações antes de haver variação real
- esconder fluxo simples atrás de camadas excessivas

Regra prática:

> Pattern bom reduz complexidade percebida. Pattern ruim só muda a complexidade de lugar.

---

### 10. Producer, Consumer e Reducer

Quando o sistema processar eventos, mensagens, arquivos ou lotes, separar bem os papéis.

#### Producer

Responsável por produzir mensagens, eventos ou tarefas.

Deve garantir:

- payload válido
- correlação/rastreabilidade
- idempotência quando necessário
- tratamento de falha na publicação
- metadados mínimos de observabilidade

#### Consumer

Responsável por consumir e processar mensagens.

Deve garantir:

- validação de entrada
- tratamento de erro
- retentativa controlada
- idempotência
- logs com contexto
- não bloquear fila indefinidamente
- dead letter queue quando aplicável

#### Reducer

Responsável por consolidar eventos, estados ou resultados.

Deve garantir:

- determinismo
- previsibilidade
- ausência de efeitos colaterais desnecessários
- clareza sobre estado inicial e estado final

Regra prática:

> Producer cria intenção, Consumer executa processamento, Reducer consolida resultado.

---

### 11. Observability como requisito técnico

Observabilidade não deve ser adicionada apenas depois do problema em produção.

Toda aplicação Python relevante deve considerar:

- logs estruturados
- correlation id
- trace id quando aplicável
- métricas técnicas
- métricas de negócio quando útil
- tempo de execução
- contagem de sucesso e falha
- motivo de falha
- contexto suficiente para diagnóstico

Evitar:

```python
print("deu erro")
```

Preferir:

```python
logger.exception(
    "failed_to_process_payment",
    extra={
        "payment_id": payment_id,
        "customer_id": customer_id,
        "correlation_id": correlation_id,
    },
)
```

Regra prática:

> Log bom permite entender o que aconteceu sem precisar reproduzir o erro localmente.

---

### 12. Tratamento de erros por responsabilidade

Erros devem ser tratados no nível correto.

Separar:

- erro de validação
- erro de domínio
- erro de integração externa
- erro de infraestrutura
- erro inesperado
- erro recuperável
- erro não recuperável

Boas práticas:

- criar exceções específicas
- preservar causa original quando relevante
- adicionar contexto sem expor dados sensíveis
- não engolir exceções silenciosamente
- não transformar todo erro em `Exception`
- mapear erros para respostas na borda da aplicação

Exemplo:

```python
class CustomerNotFoundError(Exception):
    pass
```

Em APIs, o controller/handler deve converter erros para HTTP response. O domínio não deve conhecer status code.

---

### 13. Configuração por ambiente

Configuração deve ser externa ao código.

Usar variáveis de ambiente ou arquivos de configuração controlados para:

- URLs
- credenciais
- timeouts
- limites de retry
- feature flags
- nomes de filas
- configurações de banco
- níveis de log

Evitar:

- secrets hardcoded
- URLs fixas em services
- configuração espalhada em vários módulos
- mudança de código para trocar ambiente

Preferir um módulo central de settings.

Exemplo:

```python
class Settings(BaseSettings):
    database_url: str
    log_level: str = "INFO"
    external_api_timeout_seconds: int = 10
```

---

### 14. Performance com evidência

Performance deve ser tratada com medição, não com suposição.

Observar:

- complexidade algorítmica
- quantidade de chamadas externas
- acesso a banco em loop
- uso de memória
- leitura de arquivos grandes
- serialização/deserialização
- concorrência
- paralelismo
- cache
- batch processing

Evitar otimização precoce, mas corrigir problemas evidentes.

Sinais de risco:

- N+1 queries
- loop chamando API externa sem limite
- carregar arquivo inteiro sem necessidade
- usar lista gigante quando generator resolver
- falta de timeout
- falta de paginação
- concorrência sem controle
- retry sem backoff

Regra prática:

> Primeiro meça. Depois otimize. Mas não ignore antipadrões óbvios.

---

### 15. Concorrência, paralelismo e async com critério

Python permite diferentes modelos:

- execução síncrona
- threads
- multiprocessing
- async/await
- filas
- workers

Usar `async` quando houver ganho real com I/O concorrente, como:

- chamadas HTTP externas
- operações de rede
- múltiplas consultas independentes
- serviços com alta espera de I/O

Evitar usar `async` apenas por moda.

Cuidados:

- não misturar código bloqueante em fluxo async sem controle
- definir timeouts
- limitar concorrência
- tratar cancelamento
- controlar retries
- observar consumo de recursos

Regra prática:

> Async melhora espera por I/O. Não resolve CPU-bound sozinho.

---

### 16. Reusability sem abstração prematura

Reutilização deve nascer de repetição real e intenção clara.

Preferir:

- funções utilitárias pequenas
- componentes internos bem nomeados
- interfaces explícitas
- módulos coesos
- bibliotecas internas apenas quando houver maturidade

Evitar:

- criar pacote compartilhado cedo demais
- abstrair antes de existir repetição
- generalizar caso específico
- criar helpers genéricos sem contrato claro
- compartilhar código instável entre projetos

Regra prática:

> Duplicação pequena pode ser melhor que abstração errada. Abstração deve surgir quando o padrão estiver claro.

---

### 17. Dependências externas com controle

Toda biblioteca adicionada aumenta superfície de manutenção.

Antes de adicionar dependência, avaliar:

- resolve problema real?
- é mantida?
- tem comunidade?
- adiciona risco de segurança?
- é simples substituir?
- será usada em mais de um ponto?
- existe solução nativa suficiente?

Boas práticas:

- fixar versões quando necessário
- usar lockfile
- revisar dependências transitivas
- separar dependências de produção e desenvolvimento
- remover dependências não usadas

Ferramentas possíveis:

- `pip-tools`
- `poetry`
- `uv`
- `pipenv`
- `requirements.txt` com lock controlado

---

## Organização recomendada

A estrutura pode variar, mas deve deixar claro o papel de cada parte.

### Estrutura recomendada para serviços com domínio relevante

```text
src/
  app/
    domain/
      entities/
      value_objects/
      exceptions.py
    application/
      use_cases/
      commands/
      queries/
      ports/
    infrastructure/
      database/
      repositories/
      http_clients/
      messaging/
      cache/
      settings.py
    interfaces/
      http/
      cli/
      consumers/
      jobs/
    shared/
      logging/
      observability/
      errors/
tests/
  unit/
  integration/
  contract/
pyproject.toml
README.md
```

### Estrutura recomendada para automações simples

```text
src/
  main.py
  settings.py
  services/
  adapters/
  utils/
tests/
pyproject.toml
README.md
```

### Regra de escolha

Usar estrutura mais completa quando houver:

- domínio importante
- integração externa
- persistência
- múltiplos fluxos
- necessidade de teste
- evolução esperada

Usar estrutura simples quando o escopo for pequeno e controlado.

---

## Convenções de pacotes e módulos

Preferir:

- módulos pequenos
- nomes claros
- baixo acoplamento
- ausência de import circular
- `__init__.py` apenas quando necessário
- separação entre modelo externo e modelo interno

Evitar nomes genéricos demais:

```text
utils.py
helpers.py
manager.py
processor.py
service.py
```

Quando usados, devem ter contexto claro:

```text
payment_reconciliation_service.py
customer_repository.py
invoice_file_parser.py
```

---

## Padrão de entrada e saída

Casos de uso devem receber entradas explícitas e retornar saídas previsíveis.

Preferir comandos e resultados:

```python
@dataclass(frozen=True)
class CreateOrderCommand:
    customer_id: str
    items: list[OrderItemInput]


@dataclass(frozen=True)
class CreateOrderResult:
    order_id: str
    status: str
```

Evitar passar dicionários soltos por várias camadas sem contrato:

```python
def create_order(payload: dict):
    ...
```

Dicionários podem existir na borda, mas devem ser convertidos para objetos internos antes da regra principal.

---

## Padrão para APIs HTTP

Quando Python for usado para APIs, seja com FastAPI, Flask, Django ou outro framework:

- manter controllers/routers finos
- validar entrada na borda
- converter request para command/query
- chamar caso de uso
- converter resultado para response
- mapear exceções de forma padronizada
- não colocar regra de negócio no controller
- não acoplar domínio ao framework

Fluxo recomendado:

```text
HTTP Request
  -> Router/Controller
  -> Schema de entrada
  -> Command/Query
  -> Use Case
  -> Ports
  -> Adapters
  -> Result
  -> Response Schema
```

---

## Padrão para workers e filas

Workers devem ser tratados como entry points, assim como controllers HTTP.

Um consumer deve:

- receber mensagem
- validar payload
- montar command
- chamar use case
- confirmar processamento apenas após sucesso
- registrar falha com contexto
- aplicar retry ou DLQ conforme política

Evitar:

- regra de negócio diretamente no callback da fila
- ack antes da conclusão real
- retry infinito
- logs sem identificador
- payload sem versionamento

---

## Padrão para scripts e CLI

Scripts também devem seguir organização mínima.

Evitar scripts que fazem tudo dentro de `if __name__ == "__main__"`.

Preferir:

```python
def main() -> int:
    ...
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Boas práticas:

- argumentos explícitos
- saída controlada
- logs em vez de prints para fluxo operacional
- códigos de saída coerentes
- dry-run quando houver risco
- `--apply` para ações destrutivas
- confirmação ou flag explícita para operações perigosas

---

## Banco de dados e persistência

Persistência deve ser detalhe de infraestrutura.

Boas práticas:

- repositories implementam portas
- transações ficam claras
- queries complexas ficam nomeadas
- migrations são versionadas
- modelos de banco não devem contaminar domínio sem necessidade
- commits devem ocorrer em fronteiras claras
- evitar transação aberta durante chamada externa

Quando fizer sentido, usar Unit of Work para coordenar transações:

```python
class UnitOfWork(Protocol):
    orders: OrderRepository

    def commit(self) -> None:
        ...

    def rollback(self) -> None:
        ...
```

---

## Integrações externas

Clients externos devem ser isolados em adapters.

Boas práticas:

- timeout obrigatório
- retry com backoff quando aplicável
- circuit breaker quando necessário
- logs com contexto
- tratamento de status code
- contrato de entrada e saída
- não expor resposta bruta externa ao domínio
- mapear erro externo para erro interno compreensível

Evitar:

- `requests.get(url)` espalhado pelo código
- URL hardcoded
- ausência de timeout
- dependência do formato externo em várias camadas

---

## Segurança mínima

Projetos Python devem considerar segurança desde o início.

Boas práticas:

- não logar secrets
- não versionar `.env`
- sanitizar entradas críticas
- validar arquivos recebidos
- limitar tamanho de payload
- usar dependências confiáveis
- revisar vulnerabilidades
- evitar execução dinâmica de código
- cuidado com `eval`, `exec` e desserialização insegura
- princípio do menor privilégio para credenciais

---

## Testes

O nível de teste depende do contexto, mas a stack deve permitir testes relevantes.

Tipos recomendados:

- **Unitários:** regras puras, reducers, validators, use cases com portas mockadas.
- **Integração:** banco, fila, filesystem, adapters externos controlados.
- **Contrato:** entrada e saída de APIs, payloads de fila, integrações relevantes.
- **End-to-end:** fluxos críticos quando fizer sentido.

Boas práticas:

- testar comportamento, não implementação interna
- usar fixtures com intenção clara
- evitar mocks excessivos
- cobrir erros relevantes
- testar idempotência quando necessário
- testar serialização/deserialização de contratos
- testar reducers com diferentes ordens de eventos quando aplicável

Ferramentas possíveis:

- `pytest`
- `pytest-cov`
- `freezegun`
- `responses`
- `respx`
- `testcontainers`
- `hypothesis` para casos específicos

Regra prática:

> Teste bom protege decisão importante. Teste ruim só aumenta custo de mudança.

---

## Qualidade mínima esperada

Uma base Python minimamente saudável deve buscar:

- código formatado automaticamente
- lint configurado
- tipagem nos contratos relevantes
- testes executáveis localmente
- logging estruturado nos fluxos importantes
- tratamento claro de erro
- configuração externa ao código
- dependências controladas
- README com execução local
- separação entre domínio, aplicação e infraestrutura quando necessário
- ausência de secrets no repositório
- CI executando validações mínimas

Quality gate mínimo sugerido:

```text
ruff check
ruff format --check
pytest
mypy ou pyright quando aplicável
dependency/security scan quando aplicável
```

---

## Observabilidade mínima esperada

Para serviços, workers e automações críticas, considerar:

- logger central configurado
- correlation id
- identificação do fluxo
- identificação da entidade processada
- duração da operação
- status final
- motivo de falha
- contadores de sucesso/erro
- tracing distribuído quando houver arquitetura distribuída

Exemplo de eventos de log:

```text
order_creation_started
order_creation_succeeded
order_creation_failed
external_api_request_failed
message_processing_retried
message_sent_to_dlq
```

Regra prática:

> Logs devem contar a história operacional do fluxo.

---

## Documentação mínima

Todo projeto Python deve ter pelo menos:

- objetivo do projeto
- como executar localmente
- como rodar testes
- variáveis de ambiente necessárias
- comandos principais
- arquitetura resumida
- entry points
- dependências externas
- decisões importantes
- limitações conhecidas

Evitar documentação que apenas repete o código.

---

## Relação com componentes

Esta stack pode se relacionar com diferentes tipos de componentes, por exemplo:

- `api-service`
- `worker`
- `batch-job`
- `cli-tool`
- `data-pipeline`
- `automation-service`
- `agent-service`

**Regra prática:**

- o componente define o papel da aplicação
- `python` define como essa tecnologia deve ser usada

---

## Relação com quality gates

Esta stack deve conseguir atender, no mínimo, um quality gate base, contendo:

- formatação
- lint
- testes
- validação de dependências
- verificação de tipos quando aplicável
- ausência de secrets
- build ou empacotamento quando necessário

---

## Sinais de bom uso

- O domínio não depende de framework.
- Casos de uso são fáceis de testar.
- Integrações externas estão isoladas.
- Logs ajudam a diagnosticar falhas reais.
- Erros possuem contexto e responsabilidade clara.
- Tipagem melhora previsibilidade sem travar produtividade.
- Estrutura de pastas ajuda a entender o sistema.
- Código simples continua simples.
- Arquitetura cresce conforme a necessidade.
- Performance é medida e tratada com evidência.

---

## Sinais de uso ruim

- Tudo fica dentro de um único script.
- Controllers, consumers ou CLIs concentram regra de negócio.
- Dicionários soltos atravessam todas as camadas.
- Framework aparece dentro do domínio.
- `print` é usado como observabilidade.
- Exceções genéricas escondem a causa real.
- Não há timeout em chamadas externas.
- Testes dependem demais de detalhes internos.
- Criam-se abstrações antes de existir variação real.
- A estrutura é complexa demais para um problema simples.
- Dependências são adicionadas sem critério.
- Secrets aparecem em código ou logs.

---

## Regra final

`python` existe para orientar o uso consistente da stack, não para impor burocracia.

Seu papel é simples:

> ajudar a construir soluções Python claras, testáveis, observáveis, reutilizáveis, performáticas e sustentáveis.

A arquitetura deve servir ao problema. Quando o problema for simples, o código deve continuar simples. Quando o problema crescer, a estrutura deve estar preparada para crescer sem virar acoplamento, improviso ou complexidade invisível.
