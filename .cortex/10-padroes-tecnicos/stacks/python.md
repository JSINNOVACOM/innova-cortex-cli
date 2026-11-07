# Stack: Python

## Objetivo

Definir padrões técnicos iniciais para projetos que utilizem Python, mantendo consistência, previsibilidade, testabilidade, observabilidade e boa separação de responsabilidades.

Este documento orienta o uso de Python como stack de desenvolvimento para aplicações, serviços, automações, integrações, pipelines, workers, APIs e componentes internos.

**APIs e aplicações Python de larga escala e missão crítica**. Estrutura define (architecture, api-design, fastapi, django-drf, flask, data-and-async, tooling, testing, observability-resilience, deploy-runtime, security). Vendor-neutral. Segurança segue baseline de indústria (OWASP Top 10, OWASP API Security Top 10, CWE, OWASP ASVS).



**Relacionado a:**

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)
- [quality-gate-base](../quality-gates/quality-gate-base.md)


---

## Sumário

1. [Objetivo](#objetivo)
2. [Princípio central](#princípio-central)
3. [Escopo: o que entra e o que não entra](#escopo-o-que-entra-e-o-que-não-entra)
4. [Convenção de severidade](#convenção-de-severidade)
5. [Regras de ouro (G1–G10)](#regras-de-ouro-g1g10)
6. [Arquitetura e estrutura de projeto](#arquitetura-e-estrutura-de-projeto)
7. [Tipagem e validação nas bordas](#tipagem-e-validação-nas-bordas)
8. [Design de API HTTP](#design-de-api-http)
9. [Padrões por framework: FastAPI, Django/DRF, Flask](#padrões-por-framework-fastapi-djangodrf-flask)
10. [Acesso a dados, concorrência e async](#acesso-a-dados-concorrência-e-async)
11. [Workers, filas e processamento assíncrono](#workers-filas-e-processamento-assíncrono)
12. [Scripts e CLI](#scripts-e-cli)
13. [Design patterns e papéis (Producer/Consumer/Reducer)](#design-patterns-e-papéis-producerconsumerreducer)
14. [Tratamento de erros](#tratamento-de-erros)
15. [Observabilidade e resiliência](#observabilidade-e-resiliência)
16. [Segurança](#segurança)
17. [Testes e qualidade](#testes-e-qualidade)
18. [Tooling e ambiente de desenvolvimento](#tooling-e-ambiente-de-desenvolvimento)
19. [Deploy e runtime](#deploy-e-runtime)
20. [Documentação mínima](#documentação-mínima)
21. [Definition of Done (DoD)](#definition-of-done-dod)
22. [Sinais de bom uso e de uso ruim](#sinais-de-bom-uso-e-de-uso-ruim)
23. [Regra final](#regra-final)

---

## Objetivo

Definir padrões técnicos para projetos Python, mantendo **consistência, previsibilidade,
testabilidade, observabilidade e boa separação de responsabilidades**. Aplica-se a APIs e
serviços HTTP, workers assíncronos, automações, integrações, pipelines de dados, scripts
operacionais controlados, ferramentas internas, aplicações orientadas a domínio e
serviços auxiliares de IA (agentes, orquestradores).

A pergunta central:

> "Como construir com Python de forma clara, testável, observável, segura, performática e
> preparada para evolução?"

Python deve ser usado com simplicidade, mas não de forma desorganizada. Código saudável
não é apenas código curto: é código previsível, com responsabilidades bem separadas e
comportamento fácil de validar.

---

## Princípio central

Em sistemas críticos, **correção, previsibilidade e observabilidade vencem velocidade de
digitação**. Código deve ser explícito, tipado, testável e seguro por padrão.

> Otimize para quem vai operar o sistema às 3h da manhã, não para quem o escreveu.

Este guia é **vendor-neutral**: nenhuma dependência de plataforma ou fornecedor
específico. Segurança segue baseline de indústria (OWASP Top 10, OWASP API Security
Top 10, CWE, OWASP ASVS).

---

## Escopo: o que entra e o que não entra

### O que entra

- Organização de pastas, separação de responsabilidades, arquitetura em camadas
- Clean Architecture / Ports and Adapters; services, use cases e repositories
- Tipagem, validação de dados, tratamento de erros
- Logging, observabilidade e resiliência
- Design de API (contratos HTTP, versionamento, erros, paginação, idempotência)
- Acesso a dados, concorrência e async; performance com evidência
- Padrões por framework (FastAPI, Django/DRF, Flask)
- Testes, tooling, configuração, empacotamento e deploy
- Segurança (OWASP/CWE/ASVS) e quality gate mínimo

### O que não entra

- Tutorial completo de Python ou catálogo de snippets
- Documentação de uma biblioteca específica
- Regra de negócio de produto
- Padrão de um único projeto promovido cedo demais a padrão geral
- Substituto para documentação arquitetural do sistema
- Lista infinita de ferramentas obrigatórias

O **papel do componente** (`api-service`, `worker`, `cli-tool`, `batch-job`,
`data-pipeline`, `automation-service`, `agent-service`) vive em documentos próprios. Aqui
definimos **como a stack Python deve ser usada**, não o propósito de cada aplicação.

---

## Convenção de severidade

Aplique as regras pela severidade. Ao revisar código, reporte cada violação com: regra
violada (id), severidade, local (`arquivo:linha`) e a correção.

| Tag | Significado | Ação |
|---|---|---|
| **MUST** | Obrigatório. Violar quebra correção, segurança ou contrato. | Bloquear / corrigir sempre. |
| **SHOULD** | Forte recomendação. É o caminho default. | Seguir, salvo justificativa explícita registrada. |
| **AVOID** | Antipadrão conhecido. | Não introduzir; sinalizar se encontrado. |

**Na dúvida entre simplicidade e completude, escolha simplicidade — mas nunca às custas de
uma regra `MUST` de segurança ou correção.**

---

## Regras de ouro (G1–G10)

São o núcleo. Todas as outras regras derivam delas.

### G1 — Explícito vence implícito
**MUST.** Tipagem em todas as assinaturas públicas. Sem `Any` exceto em fronteiras
realmente dinâmicas (e ainda assim, isole). Sem comportamento mágico escondido.
`mypy`/`pyright` em modo estrito no CI.

### G2 — Fronteiras validam, núcleo confia
**MUST.** Todo dado que entra (HTTP body, query params, headers, mensagens de fila,
resposta de serviço externo) é validado e parseado em um modelo tipado **na borda**. O
núcleo trabalha com tipos já validados, nunca com `dict` cru ou string não confiável.

### G3 — Falhe rápido, alto e com contexto
**MUST.** Erros não são engolidos. `except Exception: pass` é proibido. Toda exceção ou é
tratada com decisão consciente, ou propaga com contexto. Logs de erro carregam correlação
(request id / trace id) e o suficiente para diagnosticar sem reproduzir.

### G4 — Toda I/O tem timeout e limite
**MUST.** Nenhuma chamada de rede, query de banco ou operação bloqueante sem timeout
explícito. Nenhuma coleção carregada do banco sem limite/paginação. "Sem timeout" = espera
infinita = incidente.

### G5 — Idempotência e segurança de retry
**SHOULD.** Operações que mutam estado e podem ser repetidas (retries de cliente,
redelivery de fila) devem ser idempotentes ou protegidas por chave de idempotência. Assuma
que tudo será chamado mais de uma vez.

### G6 — Stateless e horizontalmente escalável
**SHOULD.** Nenhum estado de sessão ou cache de correção em memória local do processo.
Estado vai para store externo (DB, cache distribuído). Qualquer instância atende qualquer
request. Config vem do ambiente (12-factor), nunca hardcoded.

### G7 — Observável por construção
**MUST.** Todo fluxo de negócio relevante emite logs estruturados, métricas e participa de
tracing distribuído. Se não dá pra medir e correlacionar em produção, não está pronto.

### G8 — Seguro por padrão
**MUST.** Input não confiável até validado. Queries parametrizadas, sempre (zero string
interpolation em SQL). Secrets nunca no código/log/repo. Authz checada por recurso, não só
authn. Dependências fixadas e auditadas.

### G9 — Determinístico e testável
**MUST.** Tempo, aleatoriedade, I/O e relógio são injetados, não acessados globalmente
dentro da lógica. Lógica de negócio é testável sem rede nem banco. Cobertura mede
comportamento e branches, não linhas por vaidade.

### G10 — O simples que funciona vence o esperto que impressiona
**SHOULD.** Não introduza abstração, camada, metaclasse ou framework interno antes de ter
≥3 casos concretos que a justifiquem. Código é lido muito mais vezes do que escrito.
Duplicação pequena pode ser melhor que abstração errada.

---

## Arquitetura e estrutura de projeto

### 1. Arquitetura em camadas

**MUST.** Separe responsabilidades em camadas com dependências apontando **para dentro**
(regra de dependência): a borda conhece o domínio, o domínio **não** conhece a borda.

```
┌─────────────────────────────────────────────┐
│  API / Transport (HTTP, fila, CLI)           │  ← framework-specific
│  - routers/controllers, serialização, authz  │
├─────────────────────────────────────────────┤
│  Application / Use cases (services)          │  ← orquestra, sem framework
│  - regras de fluxo, transações, coordenação  │
├─────────────────────────────────────────────┤
│  Domain (entities, value objects, regras)    │  ← puro, testável sem I/O
├─────────────────────────────────────────────┤
│  Infrastructure (repos, clients, adapters)   │  ← implementa portas
│  - DB, HTTP clients, cache, mensageria       │
└─────────────────────────────────────────────┘
```

- **MUST:** lógica de negócio **não** importa nada de `fastapi`, `django`, `flask`,
  `sqlalchemy.orm`, `boto3`, `requests`, Kafka, Redis diretamente. Use abstrações
  (portas/protocolos).
- **MUST:** a camada de transporte só traduz (HTTP ↔ comando de caso de uso) e delega. Sem
  regra de negócio em handler/view.
- **AVOID:** "fat models" / "fat views" com regra de negócio, I/O e serialização
  misturados.

Fluxo recomendado de dependência:

```text
interfaces -> application -> domain
infrastructure -> application/domain contracts
```

Fluxo proibido:

```text
domain -> infrastructure
domain -> framework
use_case -> controller
entity -> database model
```

> Não confunda camadas com over-engineering. Para um CRUD trivial,
> transport→repository pode bastar. Adicione a camada de application quando houver
> orquestração real (G10).

### 2. Ports and Adapters (dependency inversion)

Portas representam contratos internos (o que o domínio precisa); adaptadores implementam
detalhes externos.

```python
# domain/ports.py — a porta, sem implementação
from typing import Protocol

class PaymentGateway(Protocol):
    def charge(self, amount_cents: int, token: str) -> ChargeResult: ...

class CustomerRepository(Protocol):
    def find_by_id(self, customer_id: str) -> Customer | None: ...

# infrastructure/stripe_gateway.py — o adaptador
class StripeGateway:  # satisfaz PaymentGateway estruturalmente
    def charge(self, amount_cents: int, token: str) -> ChargeResult: ...
```

- **SHOULD:** use `typing.Protocol` para portas — acoplamento estrutural, sem herança
  forçada, fácil de mockar.

> Use case depende de uma porta. Infraestrutura implementa a porta.

### 3. Clean Architecture com proporcionalidade

Use com **mais rigor** quando houver regras de negócio relevantes, integrações externas,
necessidade de testes, evolução esperada, múltiplos entry points, risco operacional,
orquestrações complexas, persistência relevante. Use de forma **mais leve** em scripts
pequenos, automações temporárias, provas de conceito.

> Arquitetura deve reduzir risco e aumentar clareza. Se só aumenta cerimônia, está errada
> para o contexto.

### 4. Layout de diretórios

**SHOULD.** Organize por **feature/domínio**, não por tipo técnico, quando o sistema
cresce ("package by feature" escala melhor que "package by layer" em monolitos grandes).

```
src/
  myapp/
    __init__.py
    main.py                 # composition root: monta DI, cria app
    config.py               # settings tipadas (pydantic-settings)
    api/                    # borda HTTP
      deps.py               # dependências/injeção
      v1/
        orders.py
        payments.py
    domain/
      orders/
        models.py           # entidades, VOs (sem framework)
        service.py          # casos de uso
        ports.py            # protocolos (repos, gateways)
    infrastructure/
      db/
        models.py           # mapeamento ORM
        repositories.py
      clients/
        http.py
    observability/
      logging.py
      metrics.py
    errors.py               # taxonomia de exceções de domínio
tests/
  unit/
  integration/
  contract/
pyproject.toml
```

Estrutura **simples** para automações pequenas e controladas:

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

- **MUST:** use layout `src/` (código em `src/myapp/`). Evita import acidental do
  diretório de trabalho e força testar o pacote instalado.
- **MUST:** um **composition root** único (`main.py`) onde dependências são instanciadas e
  injetadas. O resto do código recebe dependências, não as cria.
- **AVOID:** imports circulares — sintoma de fronteira de camada errada. Quebre com
  protocolos/eventos, não com import dentro de função (que só esconde o problema).

**Regra de escolha:** estrutura completa quando houver domínio importante, integração
externa, persistência, múltiplos fluxos, necessidade de teste ou evolução esperada;
estrutura simples quando o escopo for pequeno e controlado.

### 5. Convenções de pacotes e módulos

Preferir módulos pequenos, nomes claros, baixo acoplamento, ausência de import circular,
`__init__.py` apenas quando necessário, separação entre modelo externo e modelo interno.

Evitar nomes genéricos demais (`utils.py`, `helpers.py`, `manager.py`, `processor.py`,
`service.py`). Quando usados, devem ter contexto claro:

```text
payment_reconciliation_service.py
customer_repository.py
invoice_file_parser.py
```

### 6. Injeção de dependências

**SHOULD.** Dependências (repos, clients, config, relógio) são **injetadas**, não criadas
dentro da lógica nem acessadas via singleton global.

```python
# bom — testável, explícito (G9)
class OrderService:
    def __init__(self, repo: OrderRepository, clock: Clock, payments: PaymentGateway):
        self._repo = repo
        self._clock = clock
        self._payments = payments
```

- **MUST:** **tempo, aleatoriedade e I/O são injetados** (`Clock`, `IdGenerator`, etc.),
  nunca `datetime.now()`/`random`/`requests.get` direto no meio da regra (G9).
- **AVOID:** estado mutável global (variáveis de módulo que mudam em runtime) — raiz de
  bugs de concorrência e testes que vazam estado.
- Frameworks têm DI próprio: FastAPI (`Depends`), Django (settings + apps), Flask
  (extensions/`g`). Use o do framework **na borda**; mantenha o núcleo agnóstico.

### 7. Configuração (12-factor)

**MUST.** Configuração vem do **ambiente**, validada em um objeto tipado no startup. Falhe
no boot se algo obrigatório faltar — nunca em runtime no meio de um request.

```python
from pydantic import PostgresDsn, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_")

    database_url: PostgresDsn
    http_timeout_seconds: float = Field(default=5.0, gt=0)
    log_level: str = "INFO"
    environment: str = Field(pattern="^(local|staging|production)$")

settings = Settings()  # erro de boot se inválido — fail fast
```

- **MUST:** sem secrets/URLs/flags hardcoded. Tudo via env (secrets em secret manager — ver
  [Segurança](#segurança)).
- **MUST:** valide config no startup (tipos, ranges, formatos). Config inválida = não sobe.
- **SHOULD:** o mesmo artefato/imagem roda em todos os ambientes; só a config muda.
- **AVOID:** ler `os.environ[...]` espalhado pelo código. Centralize em um único `Settings`.

### 8. Modelagem de domínio

- **SHOULD:** use **value objects** para conceitos com regras (Money, Email, CPF) em vez
  de `str`/`int` cru — concentra validação e evita "primitive obsession".
- **SHOULD:** modelos imutáveis quando possível (`frozen=True`) — raciocínio mais simples
  sobre concorrência.
- **MUST:** invariantes de negócio validadas na **construção** da entidade, não
  espalhadas. Se um `Order` não pode ter total negativo, isso é garantido no `Order`, não
  em cada caller.

### 9. Estratégias de escala (larga escala / missão crítica)

- **MUST (G6):** processos **stateless**; estado de sessão, locks e cache de correção em
  store externo (Redis/DB), nunca em memória local.
- **SHOULD:** desenhe para **falha parcial** — toda dependência externa pode estar lenta ou
  fora; degrade graciosamente.
- **SHOULD:** separe **read e write paths** quando os perfis de carga divergem (CQRS leve,
  réplicas de leitura, cache de leitura).
- **SHOULD:** trabalho pesado/lento é **assíncrono** (fila + worker), não dentro do request
  HTTP.
- **SHOULD:** torne operações **idempotentes** (G5). Em sistemas distribuídos, "exactly
  once" é ilusão; projete para "at least once".
- **SHOULD:** **backpressure** e limites — rate limiting, connection pools dimensionados,
  bulkheads. Um cliente abusivo não pode derrubar todos.
- **AVOID:** fan-out síncrono não-limitado (chamar N serviços em série dentro de um
  request). Paralelize com limite ou torne assíncrono.

### Padrão de entrada e saída

Casos de uso devem receber entradas explícitas e retornar saídas previsíveis. Preferir
comandos e resultados tipados:

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

- **AVOID:** passar dicionários soltos por várias camadas sem contrato. `dict` pode existir
  na borda, mas deve ser convertido para objetos internos antes da regra principal.

### ✅ Checklist de arquitetura

- [ ] Dependências apontam para dentro; domínio sem import de framework
- [ ] Layout `src/` com composition root único
- [ ] Dependências injetadas; tempo/random/IO injetados (G9)
- [ ] Config tipada, validada no boot, vinda do ambiente (G6)
- [ ] Taxonomia de erros de domínio desacoplada de HTTP
- [ ] Processos stateless; estado em store externo (G6)
- [ ] Trabalho pesado assíncrono; operações idempotentes (G5)
- [ ] Sem imports circulares; sem estado mutável global

---

## Tipagem e validação nas bordas

### Tipagem gradual, mas intencional (G1)

Usar type hints intencionalmente em: contratos públicos, use cases, services, adapters,
DTOs, modelos de entrada/saída, integrações externas, funções com regra de negócio,
retornos não triviais.

```python
# Preferir
def calculate_total(items: list[OrderItem]) -> Decimal: ...

# Evitar
def calculate_total(items): ...
```

- **MUST:** assinaturas públicas totalmente tipadas; `Any` só em fronteiras dinâmicas
  reais, isolado e comentado.
- **AVOID:** tipagem enganosa, usada só para satisfazer ferramenta.

Quando a estrutura de dados importa, preferir `dataclass`, `TypedDict`, `Protocol`,
`Enum`, modelos Pydantic (quando houver validação de borda) ou objetos de domínio simples.

### Validação nas bordas (G2)

Dados externos são **não confiáveis** até validados. Validar entradas de APIs HTTP, filas,
arquivos, variáveis de ambiente, banco legado, chamadas externas, payloads de LLMs,
argumentos de CLI e webhooks.

- **MUST:** valide **tipo, formato, faixa e tamanho** na borda, antes de entrar no domínio
  ou caso de uso. Use Pydantic/serializers com constraints (`Field`, `pattern`,
  `max_length`).
- **MUST:** `extra="forbid"` (Pydantic) / campos explícitos (DRF) — bloqueia **mass
  assignment** (CWE-915).
- **MUST:** valide no **servidor**, sempre. Validação de cliente é UX, não segurança.

> O domínio não deve depender de payload bruto externo.

### ✅ Checklist de tipagem e validação

- [ ] Assinaturas públicas tipadas; sem `Any` fora de fronteiras dinâmicas (G1)
- [ ] Todo input externo validado em modelo tipado na borda (G2)
- [ ] `extra="forbid"` / campos explícitos; sem mass assignment
- [ ] DTOs distintos para entrada, saída e persistência

---

## Design de API HTTP

### 1. Recursos e verbos

**SHOULD.** Modele recursos (substantivos), não ações (verbos). Use o método HTTP para a
operação.

| Verbo | Uso | Idempotente | Seguro |
|---|---|---|---|
| GET | Ler | ✅ | ✅ |
| POST | Criar (ou ação não-idempotente) | ❌ | ❌ |
| PUT | Substituir por completo | ✅ | ❌ |
| PATCH | Atualizar parcialmente | ❌* | ❌ |
| DELETE | Remover | ✅ | ❌ |

- **MUST:** GET nunca muta estado (G8 — GETs são cacheáveis, prefetchados, repetidos).
- **SHOULD:** URLs em plural e minúsculas: `/orders`, `/orders/{id}`, `/orders/{id}/items`.
- **AVOID:** verbos na URL (`/createOrder`). Exceção pragmática: ações não-CRUD
  (`/orders/{id}/cancel`) quando modelar como sub-recurso seria artificial.
- **SHOULD:** evite aninhamento profundo (> 2 níveis).

### 2. Status codes

**MUST.** Use o status semanticamente correto. `4xx` = culpa do cliente; `5xx` = culpa do
servidor. **Não retorne `200` com `{"error": ...}` no corpo** — quebra observabilidade e
clientes.

- `200` ok · `201` criado (com `Location`) · `202` aceito (async) · `204` sem corpo
- `400` malformado · `401` não autenticado · `403` autenticado sem permissão · `404`
  inexistente · `409` conflito · `422` validação · `429` rate limit
- `500` bug · `502/503/504` dependência downstream falhou/indisponível/timeout

- **MUST:** nunca vaze stack trace ou detalhe interno em corpo de erro de produção.
- **SHOULD:** considere `404` em vez de `403` quando revelar existência for vazamento
  (IDOR).

### 3. Contrato de erro padronizado (RFC 9457)

**MUST.** Erros têm um formato único e estável em toda a API — **Problem Details for HTTP
APIs (RFC 9457, sucessora da 7807)**, com `Content-Type: application/problem+json`.

```json
{
  "type": "https://api.example.com/problems/insufficient-funds",
  "title": "Insufficient funds",
  "status": 409,
  "detail": "The account balance 50.00 is below the requested 120.00.",
  "instance": "/accounts/123/transfers/abc",
  "trace_id": "0af7651916cd43dd8448eb211c80319c"
}
```

- **MUST:** inclua identificador de correlação (`trace_id`/`request_id`) no corpo de erro.
- **SHOULD:** `type` é URI estável e documentada; clientes ramificam por `type`, não por
  `detail`.
- **SHOULD:** erros de validação listam os campos (`errors: [{field, reason}]`).
- **AVOID:** formatos de erro diferentes por endpoint. Um único middleware/handler
  centraliza a tradução domínio→Problem Details.

### 4. Versionamento

**MUST.** Versione a API desde o dia 1. Mudança incompatível exige nova versão.

- **SHOULD:** versão no path (`/v1/orders`) — mais simples de rotear, cachear e debugar.
- **MUST:** defina o que é **breaking**: remover/renomear campo, mudar tipo, tornar
  opcional→obrigatório, mudar semântica. Adicionar campo opcional **não** é breaking.
- **SHOULD:** clientes **ignoram campos desconhecidos** (tolerant reader).
- **SHOULD:** deprecação anunciada (`Deprecation`/`Sunset`) com janela clara.

### 5. Paginação, filtros, ordenação

**MUST (G4).** Nenhum endpoint de coleção retorna lista ilimitada. Sempre paginado, com
limite máximo enforced no servidor.

- **SHOULD:** **cursor-based** (keyset) para datasets grandes/alto tráfego — estável sob
  inserção, performático (sem `OFFSET` caro). Offset/limit só para datasets pequenos.
- **MUST:** limite default e máximo (ex.: default 20, máx 100); pedido acima do máx é
  clampado.

```json
GET /orders?limit=20&cursor=eyJpZCI6MTIzfQ
{ "data": [ ... ], "page": { "next_cursor": "eyJpZCI6MTQzfQ", "has_more": true } }
```

- **SHOULD:** filtros explícitos e validados; ordenação com **whitelist** de campos
  (`?sort=-created_at`) — nunca passe o valor direto para `ORDER BY`.

### 6. Idempotência

**MUST para escritas críticas (G5).** POST que cria recurso (pagamento, pedido) aceita
header `Idempotency-Key`. A mesma chave retorna o mesmo resultado sem duplicar o efeito.

```
POST /payments  Idempotency-Key: 9f2a...  → 201 (cria)
POST /payments  Idempotency-Key: 9f2a...  → 200/201 (mesmo resultado, sem cobrar de novo)
```

- **MUST:** armazene (chave → resultado) com TTL; chave repetida com payload diferente →
  `409`/`422`.

### 7. Payloads e schema

- **MUST:** request e response têm schema explícito e validado. Nunca aceite/retorne `dict`
  arbitrário (G2).
- **MUST:** **input model ≠ output model ≠ persistence model.** Não exponha o modelo de
  banco direto na API.
- **SHOULD:** `camelCase` ou `snake_case` — escolha um e seja consistente.
- **SHOULD:** datas em ISO 8601 UTC; dinheiro como inteiro de menor unidade (centavos) ou
  string decimal — **nunca float** (perde precisão).
- **MUST:** limite tamanho de payload (body size limit) — proteção contra DoS.
- **AVOID:** campos polimórficos sem discriminador.

### 8. Documentação (OpenAPI)

- **MUST:** mantenha uma spec **OpenAPI 3.1** como contrato (FastAPI gera; Django/Flask via
  `drf-spectacular`/`apispec`).
- **SHOULD:** spec é fonte de verdade para clientes gerados e contract testing; mantenha-a
  no CI (lint, diff de breaking changes).

### 9. Cache HTTP e concorrência

- **SHOULD:** `ETag` + `If-None-Match` para leituras cacheáveis (`304`).
- **SHOULD:** `ETag`/`If-Match` para **optimistic concurrency** em updates (`412
  Precondition Failed`).
- **SHOULD:** `Cache-Control` explícito; nunca cacheie dado sensível por padrão.

### ✅ Checklist de API

- [ ] Recursos como substantivos; verbo HTTP correto; GET sem efeito colateral
- [ ] Status codes semânticos; 4xx≠5xx; sem 200-com-erro
- [ ] Erros em Problem Details (RFC 9457) com trace_id, formato único
- [ ] Versionado; mudanças aditivas; tolerant reader
- [ ] Coleções sempre paginadas com limite máximo (G4)
- [ ] Escritas críticas com Idempotency-Key (G5)
- [ ] DTOs distintos para input/output/persistência; sem float p/ dinheiro
- [ ] Body size limit; filtros/sort com whitelist
- [ ] OpenAPI atualizada no CI

---

## Padrões por framework: FastAPI, Django/DRF, Flask

> Detecte o framework presente no projeto antes de sugerir padrões; não imponha o estilo de
> um framework em outro.

### FastAPI (Python 3.11+, Pydantic v2)

- **MUST:** organize endpoints em `APIRouter` por domínio, montados no composition root.
- **MUST:** declare `response_model` em toda rota — define contrato de saída, filtra campos
  extras, documenta o OpenAPI. Sem ele, você vaza o que o handler retornar.
- **MUST (G2):** request/response são modelos Pydantic; input ≠ output ≠ ORM model.

```python
class OrderCreate(BaseModel):          # input
    model_config = ConfigDict(extra="forbid")   # rejeita campos desconhecidos
    customer_id: int
    items: list[OrderItemIn] = Field(min_length=1)

class OrderOut(BaseModel):             # output
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: OrderStatus
    total_cents: int
```

- **MUST:** `extra="forbid"` em modelos de **input** (mass assignment vira `422`).
- **MUST:** **nunca** use o modelo ORM como `response_model` — exponha um `*Out`.
- **SHOULD:** `Depends` para injetar dependências; `Annotated[T, Depends(...)]` (estilo
  moderno); `yield` para cleanup; `app.dependency_overrides` em testes.

```python
async def get_session() -> AsyncIterator[AsyncSession]:
    async with SessionLocal() as session:
        yield session

DbSession = Annotated[AsyncSession, Depends(get_session)]
CurrentUser = Annotated[User, Depends(get_current_user)]
```

- **MUST:** clients HTTP e engine de DB criados no **lifespan** e reusados, não por request.

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http = httpx.AsyncClient(timeout=httpx.Timeout(5.0))
    yield
    await app.state.http.aclose()   # graceful shutdown

app = FastAPI(lifespan=lifespan)
```

- **AVOID:** o decorador legado `@app.on_event(...)` — use `lifespan`.
- **MUST:** centralize erro de domínio → HTTP em **exception handlers** (Problem Details);
  handler genérico para `Exception` loga com trace_id e retorna `500` sem vazar; handler de
  `RequestValidationError` retorna `422` em Problem Details.
- **MUST:** CORS restritivo (`allow_origins` explícito, nunca `["*"]` com credenciais);
  body size limit no servidor/proxy; `docs_url`/`openapi_url` protegidos em prod sensível.

### Django + Django REST Framework

- **SHOULD:** apps por domínio; **service layer** (`services.py` escrita, `selectors.py`
  leitura) onde mora a regra de negócio; views/serializers finos.
- **MUST:** settings seguras de produção:

```python
DEBUG = False                      # nunca True em prod (vaza stack + settings, CWE-209)
ALLOWED_HOSTS = [...]              # explícito, sem "*"
SECRET_KEY = env("SECRET_KEY")     # do ambiente, nunca no repo
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_CONTENT_TYPE_NOSNIFF = True
```

- **MUST:** rode `python manage.py check --deploy` no CI.
- **MUST:** N+1 eliminado (`select_related` FK/one-to-one, `prefetch_related` many);
  `.only()`/`.values()` em paths quentes; índices e constraints no DB; `bulk_create`/
  `bulk_update` em vez de loop de `.save()`; escrita multi-tabela em `transaction.atomic`
  sem chamada HTTP externa dentro.
- **MUST (G2):** input validado por serializer (`is_valid(raise_exception=True)`);
  serializer input ≠ output (`read_only`/`write_only`); **não use `fields = "__all__"`** em
  serializer exposto (vaza campos / mass assignment).
- **MUST:** `permission_classes` explícito + checagem de **ownership** (IDOR/CWE-639);
  paginação default global + `max_page_size`; throttling em endpoints sensíveis.
- **MUST:** custom `EXCEPTION_HANDLER` → Problem Details (RFC 9457) com trace_id.
- **AVOID:** lógica de negócio pesada em `Model.save()` override e em `signals` (efeito
  colateral oculto).
- **SHOULD:** trabalho pesado → Celery/RQ idempotente com retry+backoff.

### Flask (minimalista — muito é decisão explícita)

- **MUST:** **application factory** + **blueprints**; extensions via `init_app(app)`; nunca
  `app = Flask(__name__)` global.

```python
def create_app(config: Settings) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    register_error_handlers(app)
    from app.orders.routes import bp as orders_bp
    app.register_blueprint(orders_bp, url_prefix="/v1/orders")
    return app
```

- **MUST (G2):** Flask **não valida nada** por padrão. Adote Pydantic (recomendado) /
  marshmallow. Nunca use `request.json`/`request.form` cru na lógica; `extra="forbid"` no
  input; valide `Content-Type` e trate JSON malformado com `400` (não `500`); saída via
  modelo `*Out`.
- **MUST:** config tipada do ambiente; `DEBUG=False` e `app.debug=False` em prod (o debugger
  do Werkzeug é **RCE** se exposto — CWE-94); `PROPAGATE_EXCEPTIONS` configurado.
- **MUST:** error handlers → Problem Details + trace_id; catch-all que loga e retorna `500`
  sem vazar.
- **MUST:** sessão de DB por request com teardown garantido (`teardown_appcontext`).
- **MUST:** sirva com **gunicorn**/uWSGI atrás de proxy; nunca `app.run()` em prod.
- **MUST:** CORS explícito; cookies seguros (`SECURE`/`HTTPONLY`/`SAMESITE`); CSRF em fluxos
  com cookie; headers de segurança (CSP, nosniff, HSTS via `flask-talisman`); authz por
  recurso + ownership; `MAX_CONTENT_LENGTH` (body size limit).
- **AVOID:** usar `g` para guardar estado de negócio entre requests; forçar `async` em Flask
  WSGI (para async-first, FastAPI é a escolha natural).

### ✅ Checklist por framework

- [ ] **FastAPI:** `APIRouter` por domínio; `response_model`; input `extra="forbid"`; `*Out`
  ≠ ORM; `Depends`+`yield`; clients/engine no `lifespan`; exception handlers → Problem
  Details; CORS restrito; docs protegida
- [ ] **Django/DRF:** apps por domínio; service/selector; `DEBUG=False`+`check --deploy`;
  N+1 eliminado; serializer input≠output sem `__all__`; `permission_classes`+ownership;
  paginação+throttling; `EXCEPTION_HANDLER`→Problem Details
- [ ] **Flask:** application factory+blueprints; validação Pydantic na borda; `DEBUG=False`;
  error handlers→Problem Details; sessão com teardown; gunicorn; CORS/cookies/CSRF/headers/
  body limit; authz+ownership

---

## Acesso a dados, concorrência e async

### 1. Regra de ouro de I/O

**MUST (G4).** Toda operação de I/O — query, chamada HTTP, leitura de cache, publicação em
fila — tem **timeout explícito**. Sem exceção.

```python
client = httpx.AsyncClient(timeout=httpx.Timeout(5.0, connect=2.0))
engine = create_async_engine(url, connect_args={"command_timeout": 5})
```

- **MUST:** defina timeout de connect E de read separadamente quando possível.
- **MUST:** timeouts são config, não mágicos no código.

### 2. SQL e proteção contra injeção (CWE-89)

**MUST (G8).** Queries sempre **parametrizadas**. Zero interpolação de string/f-string com
input em SQL.

```python
# PROIBIDO — SQL injection
db.execute(f"SELECT * FROM users WHERE email = '{email}'")

# CORRETO — parametrizado
db.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})
```

- **MUST:** identificadores dinâmicos (coluna/tabela em `ORDER BY`/filtro) vêm de
  **whitelist**, nunca direto do request.

### 3. ORM: armadilhas de larga escala

**N+1 queries** — **MUST.** Identifique e elimine N+1 (causa nº1 de latência em listagens).

```python
# N+1
orders = session.scalars(select(Order)).all()
for o in orders:
    print(o.customer.name)   # dispara query por iteração

# Correto: eager load
orders = session.scalars(select(Order).options(selectinload(Order.customer))).all()
```

- **SHOULD:** `joinedload`/`select_related` para to-one; `selectinload`/`prefetch_related`
  para to-many.
- **MUST:** selecione só as colunas necessárias em queries quentes.

**Transações** — **MUST:** escopo explícito e curto; uma unidade de trabalho = uma
transação; não mantenha transação aberta durante chamada HTTP externa. Para corridas de
update, use **optimistic locking** (coluna de versão) ou `SELECT ... FOR UPDATE` — nunca
read-modify-write desprotegido (lost update).

**Connection pool** — **MUST:** dimensione o pool (`instâncias × pool_size` ≤
`max_connections`); `pool_pre_ping=True`; engine é singleton da aplicação (não abra por
request).

### 4. Sync vs Async — escolha consciente

**MUST.** Não misture I/O bloqueante dentro de código async. Uma chamada bloqueante
(`requests`, driver sync, `time.sleep`) num handler async **trava o event loop inteiro**.

- **MUST:** em stack async use libs async (`httpx.AsyncClient`, `asyncpg`, SQLAlchemy
  async, `asyncio.sleep`).
- **MUST:** bloqueante inevitável vai para `await asyncio.to_thread(fn, ...)`.
- **SHOULD:** se a app é majoritariamente CPU-bound ou usa libs só-sync maduras, **sync +
  workers** (gunicorn, WSGI) é escolha legítima. Async não é sempre superior.
- **AVOID:** "async em tudo" por moda.

**Concorrência controlada:**

```python
sem = asyncio.Semaphore(10)
async def fetch(item):
    async with sem:
        return await client.get(...)
results = await asyncio.gather(*(fetch(i) for i in items), return_exceptions=True)
```

- **MUST:** `asyncio.gather` sem limite em coleção grande = milhares de conexões = derruba
  downstream. Use `Semaphore`/batches.
- **MUST:** trabalho CPU-intensivo vai para `ProcessPoolExecutor` ou worker dedicado, não
  no event loop.

> Async melhora espera por I/O. Não resolve CPU-bound sozinho.

### 5. Cache

- **SHOULD:** cache para leituras quentes e caras, em store distribuído (Redis), nunca em
  memória local de processo (G6).
- **MUST:** toda entrada de cache tem **TTL** e estratégia de **invalidação** explícita.
- **SHOULD:** proteja contra **cache stampede** (lock/single-flight ou TTL com jitter).
- **AVOID:** cachear dado sensível/por-usuário sem chave que isole o usuário.

### 6. Mensageria e processamento assíncrono

- **MUST (G5):** assuma entrega **at-least-once** → consumidores **idempotentes** (dedupe
  por id de mensagem).
- **MUST:** mensagem que falha repetidamente vai para **dead-letter queue (DLQ)** após N
  tentativas.
- **SHOULD:** retry com **backoff exponencial + jitter**; **outbox pattern** para
  atomicidade entre escrita no DB e publicação de evento.
- **MUST:** propague o contexto de trace (trace_id no envelope) — senão o trace distribuído
  quebra no salto assíncrono (G7).

### 7. Migrations de schema

- **MUST:** toda mudança via ferramenta versionada (Alembic, Django migrations) — nunca DDL
  manual em produção.
- **MUST:** migrations **expand/contract**, compatíveis com a versão anterior do código
  rodando em paralelo: adicione coluna nullable → deploy → backfill → torne obrigatória →
  remova o antigo. Reversíveis ou com plano de rollback.
- **AVOID:** migration com lock pesado em tabela grande em pico (use índices
  `CONCURRENTLY`, backfill em lotes).

### ✅ Checklist de dados & async

- [ ] Toda I/O com timeout explícito (G4)
- [ ] SQL parametrizado; identificadores dinâmicos via whitelist (G8)
- [ ] Sem N+1; eager loading consciente; só colunas necessárias
- [ ] Transações curtas; sem I/O externo dentro; locking onde há corrida
- [ ] Pool dimensionado; pre-ping; engine singleton
- [ ] Sem I/O bloqueante no event loop; concorrência com limite (Semaphore)
- [ ] CPU-bound fora do loop/worker HTTP
- [ ] Cache com TTL + invalidação; sem stampede; isolado por usuário se sensível
- [ ] Consumidores idempotentes; DLQ; backoff+jitter; trace propagado (G5/G7)
- [ ] Migrations expand/contract, reversíveis, sem lock em pico

---

## Workers, filas e processamento assíncrono

Workers são **entry points**, assim como controllers HTTP. Um consumer deve:

- receber mensagem → **validar payload** → montar command → chamar use case
- confirmar processamento (ack) **apenas após sucesso**
- registrar falha com contexto; aplicar retry ou DLQ conforme política
- ser **idempotente** (G5)

Evitar:

- regra de negócio diretamente no callback da fila
- ack antes da conclusão real
- retry infinito
- logs sem identificador
- payload sem versionamento

---

## Scripts e CLI

Scripts também seguem organização mínima. Evitar tudo dentro de
`if __name__ == "__main__"`.

```python
def main() -> int:
    ...
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

Boas práticas: argumentos explícitos; saída controlada; logs em vez de prints para fluxo
operacional; códigos de saída coerentes; `--dry-run` quando houver risco; `--apply` para
ações destrutivas; confirmação ou flag explícita para operações perigosas.

---

## Design patterns e papéis (Producer/Consumer/Reducer)

### Design Patterns com intenção

Use patterns para resolver problemas reais de design, não para decorar código. Úteis em
Python: **Strategy** (variações de comportamento), **Factory** (criação controlada),
**Adapter** (integração externa), **Repository** (abstração de persistência), **Unit of
Work** (controle transacional), **Command/Query** (intenção de execução / consulta sem
efeito), **Template Method**, **Chain of Responsibility** (pipelines), **Producer/Consumer**
(processamento assíncrono), **Reducer** (consolidação determinística).

```python
class UnitOfWork(Protocol):
    orders: OrderRepository
    def commit(self) -> None: ...
    def rollback(self) -> None: ...
```

- **AVOID:** criar pattern sem necessidade; transformar tudo em classe; abstrair antes de
  haver variação real; esconder fluxo simples atrás de camadas excessivas.

> Pattern bom reduz complexidade percebida. Pattern ruim só muda a complexidade de lugar.

### Producer, Consumer e Reducer

Quando o sistema processar eventos, mensagens, arquivos ou lotes, separar os papéis:

- **Producer** — produz mensagens/eventos/tarefas. Garante payload válido, correlação/
  rastreabilidade, idempotência quando necessário, tratamento de falha na publicação,
  metadados de observabilidade.
- **Consumer** — consome e processa. Garante validação de entrada, tratamento de erro,
  retentativa controlada, idempotência, logs com contexto, não bloquear fila
  indefinidamente, DLQ quando aplicável.
- **Reducer** — consolida eventos/estados/resultados. Garante determinismo,
  previsibilidade, ausência de efeitos colaterais desnecessários, clareza sobre estado
  inicial e final.

> Producer cria intenção, Consumer executa processamento, Reducer consolida resultado.

---

## Tratamento de erros

### Taxonomia de erros (domínio desacoplado de HTTP)

**MUST.** Defina uma hierarquia de exceções de **domínio** desacoplada de HTTP. A borda
traduz domínio→HTTP.

```python
# errors.py
class DomainError(Exception):
    """Base para erros de regra de negócio."""

class NotFoundError(DomainError): ...
class ConflictError(DomainError): ...        # violação de unicidade lógica
class ValidationError(DomainError): ...
class PermissionDeniedError(DomainError): ...
```

### Erros por responsabilidade (G3)

Separar: erro de validação, de domínio, de integração externa, de infraestrutura,
inesperado, recuperável e não recuperável.

- **MUST:** não lance `HTTPException` (ou equivalente) de dentro do domínio — acopla o
  núcleo à borda. Lance erro de domínio; mapeie na borda.
- **MUST:** `except Exception: pass` é proibido. Não engula exceções silenciosamente; não
  transforme todo erro em `Exception` genérico.
- **MUST:** preserve a causa original quando relevante; adicione contexto sem expor dados
  sensíveis.
- **AVOID:** usar exceções para fluxo de controle normal (esperado-vazio retorna
  `None`/`Optional`, não exceção).

Em APIs, o controller/handler converte erros para HTTP response. O domínio não conhece
status code.

---

## Observabilidade e resiliência

> Em larga escala, falha não é exceção — é o estado normal de alguma dependência o tempo
> todo.

### Parte A — Observabilidade

**1. Logging estruturado (G7).** Logs em **formato estruturado (JSON)**, não strings
livres.

```python
logger.info("order_created", extra={
    "order_id": order.id, "customer_id": order.customer_id,
    "amount_cents": order.total_cents, "trace_id": trace_id,
})
```

- **MUST:** todo log carrega **identificador de correlação** (`trace_id`/`request_id`).
- **MUST:** **nunca logue dados sensíveis** (senha, token, PII, cartão, secret — CWE-532).
  Redija na borda do logger. É regra de segurança, não de estilo.
- **MUST:** níveis corretos: `ERROR` (precisa ação), `WARNING` (anômalo mas tratado),
  `INFO` (evento de negócio), `DEBUG` (desligado em prod).
- **SHOULD:** mensagem = evento estável (`order_created`), dados = campos; não concatene
  valores na mensagem (quebra agregação). Logue a **decisão e o porquê** em bifurcações
  críticas.

Em vez de `print("deu erro")`:

```python
logger.exception("failed_to_process_payment", extra={
    "payment_id": payment_id, "customer_id": customer_id, "correlation_id": correlation_id,
})
```

Eventos de log típicos: `order_creation_started`, `order_creation_succeeded`,
`order_creation_failed`, `external_api_request_failed`, `message_processing_retried`,
`message_sent_to_dlq`.

**2. Métricas.** **MUST.** Convenção **RED** (Rate, Errors, Duration) para serviços e
**USE** (Utilization, Saturation, Errors) para recursos.

- **MUST:** por endpoint: taxa de request, taxa de erro, latência com **percentis**
  (p50/p95/p99 — média esconde a cauda).
- **MUST:** cuidado com **cardinalidade** — não use `user_id`/`request_id` como label de
  métrica (explode a série). Identificadores únicos vão em logs/traces.
- **SHOULD:** instrumentação via **OpenTelemetry** (vendor-neutral); métricas de negócio
  além das técnicas.

**3. Tracing distribuído (G7).** **MUST.** Instrumente tracing (OpenTelemetry); **propague
o contexto** (W3C `traceparent`) em HTTP, filas e jobs. O `trace_id` aparece nos logs e na
resposta de erro — liga os três pilares. Spans sem PII; sampling consciente.

**4. Health checks.** **MUST.** Endpoints distintos:

- `/health` (**liveness**): processo vivo? Resposta barata, **sem** checar dependências.
- `/ready` (**readiness**): pode receber tráfego? Checa dependências essenciais com timeout
  curto. Falha → retirado do balanceador, não morto. Não retorne `200` fixo; não inclua
  dependências não-essenciais.

### Parte B — Resiliência

**5. Timeouts (G4).** **MUST.** Toda chamada de I/O tem timeout. Timeout do cliente
**menor** que o do servidor que o chama (orçamento de tempo decrescente na cadeia).

**6. Retries — SHOULD.** Só para falhas **transitórias** (timeout, `503`, conexão
resetada); nunca retry de `4xx` determinístico.

- **MUST:** **backoff exponencial + jitter** (evita retry storm e thundering herd); limite
  de tentativas (ex.: 3) e orçamento de retry.
- **MUST (G5):** só retry de operações **idempotentes**; não-idempotente exige chave de
  idempotência.

**7. Circuit breaker — SHOULD.** Após N falhas, abre o circuito e falha rápido por um
período, depois testa (half-open). Combine com **fallback/degradação graciosa** (cache
stale, resposta parcial, default seguro).

**8. Bulkheads e limites (G6).** Pools separados por dependência; **rate limiting** e
**concurrency limits**; **load shedding** sob saturação (rejeitar `429`/`503` cedo é melhor
que colapsar).

**9. Falha parcial e graceful degradation.** Identifique dependências **essenciais vs.
opcionais**; a falha de uma opcional degrada a feature, não derruba o request. Timeouts e
fallbacks definidos por dependência; teste o comportamento degradado.

**10. Alertas.** **SHOULD.** Alerte em **sintomas que afetam o usuário** (taxa de erro,
latência p99, saturação), baseados em SLO — não em causa interna ruidosa. **MUST:** todo
alerta acionável tem dono e runbook.

### ✅ Checklist de observabilidade & resiliência

- [ ] Logs JSON estruturados com trace_id; sem PII/secrets (G7, CWE-532)
- [ ] Métricas RED/USE com percentis; cardinalidade controlada; OTel
- [ ] Tracing distribuído com propagação de contexto; trace_id em log e erro
- [ ] Liveness barato + readiness checando dependências essenciais
- [ ] Timeout em toda I/O, decrescente na cadeia (G4)
- [ ] Retry só em transitório, idempotente, backoff+jitter, limitado (G5)
- [ ] Circuit breaker + fallback em dependências instáveis
- [ ] Rate/concurrency limits, bulkheads, load shedding (G6)
- [ ] Essencial vs opcional definido; degradação graciosa testada
- [ ] Alertas por sintoma/SLO, acionáveis, com runbook

---

## Segurança

> Input não confiável até validado; menor privilégio; defesa em profundidade; falhe fechado
> (negar por padrão). Segurança é regra `MUST` por padrão (G8) — não um passo posterior.
> Baseline: OWASP Top 10, OWASP API Security Top 10, CWE, OWASP ASVS.

**1. Validação e tratamento de input (CWE-20).** **MUST (G2).** Todo input externo
validado e parseado em modelo tipado na borda — body, query, path, headers, cookies, filas,
respostas de terceiros. Valide tipo/formato/faixa/tamanho; `extra="forbid"` contra **mass
assignment** (CWE-915 / OWASP API6 — `is_admin`, `role`, `balance`); limite tamanho de
payload e profundidade de estruturas aninhadas; valide no servidor sempre.

**2. Injeção (CWE-89/78/94).** **MUST.** Nunca construa comando/query/código interpolando
input.

- SQL parametrizado; identificadores via whitelist (CWE-89).
- OS command: `subprocess.run([...], shell=False)`; **nunca** `shell=True` com input nem
  `os.system` (CWE-78).
- **Nunca** `eval`/`exec`/`compile` sobre input; nunca `pickle.loads`/`yaml.load` sobre
  dado não confiável (use `yaml.safe_load`) — desserialização insegura (CWE-94/502).
- Template/SSTI: não renderize template de string controlada pelo usuário; autoescape
  ligado.
- Path traversal (CWE-22): valide e resolva caminhos contra um diretório base
  (`Path.resolve()` + checagem de prefixo); rejeite `..` e caminhos absolutos.

**3. Autenticação (CWE-287, OWASP API2).** **MUST.** Centralizada e reutilizável. Valide
tokens (assinatura, `exp`, `iss`, `aud`); para JWT **rejeite `alg: none`**, fixe os
algoritmos aceitos (CWE-347). Senhas com hash forte adaptativo (**argon2**/bcrypt/scrypt) +
salt — **nunca** MD5/SHA-1/SHA-256 puro (CWE-916). Proteja auth contra brute force (rate
limit, lockout/backoff). **SHOULD:** tokens de curta duração + refresh + revogação.

**4. Autorização (CWE-285/639 IDOR, OWASP API1).** **MUST.** Autenticação ≠ autorização.
Verifique **a cada request** se o usuário pode acessar **aquele recurso específico**.

- **IDOR/BOLA (OWASP API1):** **nunca** confie num id do cliente sem checar
  **ownership/permissão** — `GET /orders/{id}` verifica que o pedido pertence ao usuário.
  Vulnerabilidade nº1 de APIs.
- Autorização no servidor, por recurso e por ação; **falhe fechado**. Endpoints
  administrativos checam papel (OWASP API5). Defesa em profundidade (não só UI/gateway).

**5. Secrets e credenciais (CWE-798/312).** **MUST.** **Zero secrets** no código, repo,
logs, imagem ou histórico de commits. Secrets via **secret manager**/env injetada em
runtime. Scan no CI e pre-commit (`gitleaks`/`detect-secrets`). Se vazar, **rotacione**
(assuma comprometido). Nunca logue secrets/PII (CWE-532). Dados sensíveis cifrados em
repouso e trânsito (TLS sempre).

**6. Criptografia (CWE-327/330).** **MUST.** Use libs mantidas de alto nível
(`cryptography`); não invente primitivas. Aleatoriedade de segurança com `secrets`/
`os.urandom`, **nunca `random`**. Sem algoritmos quebrados (MD5/SHA-1 para integridade,
DES, RC4); use AES-GCM/ChaCha20-Poly1305. TLS verificado nos clientes — **nunca**
`verify=False` em produção (CWE-295).

**7. Exposição de dados e erros (CWE-209/200, OWASP API3).** **MUST.** Em produção, **não
vaze** stack trace, mensagem interna, query SQL, versão de framework ou path em respostas
de erro. Erro genérico para o cliente (Problem Details); detalhe vai para o log com
trace_id. `DEBUG=False` (Django/Flask). Retorne só os campos necessários; DTO de saída ≠
persistência.

**8. Headers e transporte (OWASP API8).** **MUST.** TLS obrigatório; redirecione
HTTP→HTTPS; HSTS. **CORS restritivo** — origens whitelistadas; **nunca `*` com
credenciais**. **SHOULD:** CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options`,
`Referrer-Policy`. **MUST (CSRF):** fluxos baseados em cookie de sessão precisam de proteção
CSRF; APIs token-based são imunes ao CSRF clássico mas exigem cuidado com armazenamento do
token.

**9. Rate limiting e abuso (OWASP API4).** **MUST.** Rate limiting em endpoints de auth,
caros e de escrita; limites de recurso por request (tamanho, complexidade, paginação
máxima). **SHOULD:** limites por usuário/IP/chave, com `429` + `Retry-After`.

**10. Dependências e cadeia de suprimentos (CWE-1395, OWASP A06).** **MUST.** Fixe versões
com lockfile (builds reproduzíveis); **auditoria de vulnerabilidades** no CI
(`pip-audit`/scanner); falhe o build em CVE crítico sem mitigação; instale só de índices
confiáveis (cuidado com **typosquatting** e **dependency confusion**). **SHOULD:** minimize
a árvore de dependências; gere SBOM e scan de imagem.

**11. SSRF (CWE-918, OWASP API7).** **MUST.** Se a app faz requests para URLs derivadas de
input (webhooks, "fetch this URL"), **valide o destino**: bloqueie IPs internos/privados/
loopback/link-local e metadata endpoints (`169.254.169.254`); use allowlist de hosts;
revalide o IP (DNS rebinding); desabilite redirects para destinos não permitidos.

**12. Concorrência e race conditions (CWE-362).** **MUST.** Operações sensíveis a corrida
(débito de saldo, reserva de estoque, consumo de cupom) protegidas por lock pessimista
(`SELECT FOR UPDATE`), optimistic locking (versão) ou constraint de banco — nunca
read-modify-write desprotegido. Não separe checagem da ação (TOCTOU) em operações críticas.

### ✅ Checklist de segurança (gate de revisão)

- [ ] Todo input validado na borda; `extra="forbid"`; sem mass assignment (CWE-20/915)
- [ ] SQL parametrizado; sem `eval`/`exec`/`pickle`/`yaml.load`/`shell=True`/path traversal
- [ ] Auth centralizada; JWT validado (sem `alg:none`); senha com argon2/bcrypt
- [ ] **Authz por recurso + ownership** (IDOR/BOLA); falha fechada
- [ ] Zero secret no código/log/imagem; scan no CI; rotação se vazar; PII redigida
- [ ] Crypto com lib mantida; `secrets` não `random`; TLS verificado; sem algoritmo quebrado
- [ ] Sem vazamento de stack/erro interno; `DEBUG=False`; DTO de saída ≠ persistência
- [ ] TLS+HSTS; CORS restrito; headers de segurança; CSRF onde há cookie
- [ ] Rate limiting em auth/escrita; limites por request; `429`+`Retry-After`
- [ ] Deps fixadas + auditadas; cuidado typosquatting/confusion; imagem escaneada
- [ ] SSRF mitigado em fetch de URL do usuário
- [ ] Race conditions protegidas (lock/versão/constraint) em operações sensíveis

---

## Testes e qualidade

### 1. Pirâmide de testes

**SHOULD.** Muitos testes de unidade rápidos, menos de integração, poucos end-to-end.

```
        /\        E2E / contract  — poucos, lentos, alto valor de confiança
       /──\       Integração      — borda↔DB/serviços reais (ou fakes fiéis)
      /────\      Unidade          — lógica de domínio, rápidos, isolados
     /──────\
```

- **MUST:** **lógica de negócio testável sem rede nem banco** (G9). Se um teste de regra
  precisa de DB, a arquitetura está acoplada demais.
- **AVOID:** inverter a pirâmide (tudo E2E).

### 2. pytest — base

**MUST.** Use **pytest**; estruture `tests/unit`, `tests/integration`, `tests/contract`.

- **MUST:** testes **determinísticos e isolados** — independentes de ordem, sem estado
  compartilhado, sem relógio/rede real. Injete `Clock`/`IdGenerator` fakes (G9).
- **MUST:** um teste verifica **um comportamento**; nome descreve cenário e esperado
  (`test_create_order_rejects_empty_items`).
- **SHOULD:** Arrange-Act-Assert; sem lógica condicional/loop no teste;
  `pytest.mark.parametrize` para variações (incl. bordas e inválidos).

### 3. Fixtures e dublês

- **SHOULD:** fixtures para setup reutilizável; escopo mínimo (`function` por padrão).
- **MUST:** **fake** (implementação leve funcional, ex.: repo em memória) é preferível a
  **mock** (verifica interação) na maioria dos casos. Mock demais testa implementação, não
  comportamento.
- **MUST:** **não mocke o que você não possui** sem um teste de contrato cobrindo a
  integração real.
- **SHOULD:** `factory_boy`/builders para objetos de domínio de teste.

### 4. Testes de integração

- **MUST:** teste a borda contra dependências reais ou fiéis: banco real (containers via
  `testcontainers`), não SQLite fingindo ser Postgres (dialetos divergem — falso verde).
- **MUST:** cada teste limpa seu estado (transação com rollback ou truncate/recreate).
- **SHOULD:** teste o handler HTTP de ponta a ponta no processo (`TestClient` FastAPI,
  `APIClient` DRF, `app.test_client()` Flask) — valida serialização, validação, status,
  authz. Teste explicitamente **caminhos de erro** (404/409/422/401/403), não só o happy
  path.

### 5. Testes de contrato

**SHOULD.** Valide que a implementação cumpre a **spec OpenAPI** (schemathesis gera casos,
incl. adversariais); consumer-driven contracts (Pact) quando há acoplamento forte. **MUST:**
detecte **breaking changes** de contrato no CI (diff de OpenAPI) antes do merge.

### 6. Property-based testing

**SHOULD.** Use **Hypothesis** para lógica com muitos casos de entrada (parsers,
validadores, cálculos, serialização). Teste **invariantes e roundtrips**.

```python
from hypothesis import given, strategies as st

@given(st.integers(min_value=0))
def test_money_roundtrip(cents):
    assert Money.from_cents(cents).to_cents() == cents
```

### 7. Cobertura — medida, não meta vaidosa

- **SHOULD:** meça cobertura (`pytest-cov`), mirando em **branches** (`--cov-branch`).
- **MUST:** defina um **piso** de cobertura no CI calibrado por contexto — não persiga 100%
  cego.
- **SHOULD:** **mutation testing** (`mutmut`/`cosmic-ray`) em módulos críticos (pagamento,
  autorização) — mede se os testes detectam bugs.
- **AVOID:** teste só para subir a métrica.

### 8. Performance e carga (sistemas críticos)

- **SHOULD:** teste de carga (`locust`/`k6`) no caminho crítico; descubra o ponto de
  saturação; valide timeouts/pool/limites sob pressão.
- **SHOULD:** teste de resiliência (simule dependência lenta/fora; verifique timeout,
  retry, breaker, degradação); regressão de N+1 (conte queries: `assertNumQueries` no
  Django).

### 9. Higiene da suíte

- **MUST:** suíte **rápida** (unit em segundos); marque lentos (`@pytest.mark.slow`).
- **MUST:** **zero testes flaky tolerados** — conserte ou quarentena com prazo.
- **MUST:** testes rodam no CI como gate de merge.
- **SHOULD:** sem `sleep` em teste (use relógio injetado e espera por condição).

Tipos recomendados conforme o contexto: **Unitários** (regras puras, reducers, validators,
use cases com portas mockadas), **Integração** (banco, fila, filesystem, adapters),
**Contrato** (entrada/saída de APIs, payloads de fila), **End-to-end** (fluxos críticos).

> Teste bom protege decisão importante. Teste ruim só aumenta custo de mudança.

### ✅ Checklist de testes

- [ ] Lógica de negócio testável sem rede/DB (G9); pirâmide respeitada
- [ ] Testes determinísticos, isolados, um comportamento cada; parametrizados
- [ ] Fakes > mocks; não mockar o que não se possui sem contract test
- [ ] Integração com DB real (não SQLite-faking-Postgres); estado limpo entre testes
- [ ] Caminhos de erro/borda testados, não só happy path
- [ ] Contract testing + diff de OpenAPI no CI; Hypothesis em lógica densa
- [ ] Cobertura por branch com piso; mutation testing em módulos críticos
- [ ] Carga/resiliência no caminho crítico; regressão de N+1
- [ ] Suíte rápida, zero flaky, gate de CI, sem `sleep`

---

## Tooling e ambiente de desenvolvimento

### 1. Gerenciamento de dependências

**MUST.** Gerenciador moderno com **lockfile** e resolução determinística. Default
recomendado: **uv** (rápido, lock confiável). Alternativas: **Poetry**, **PDM**. Evite `pip
install` solto sem lock.

- **MUST:** **commitar o lockfile** (`uv.lock`/`poetry.lock`); **fixe versões** das deps
  diretas (o lock fixa as transitivas); separe deps de runtime, dev e opcionais.
- **SHOULD:** atualize de forma controlada (Dependabot/Renovate), não em big-bang anual.
- **MUST (security):** auditoria de vulnerabilidades no CI (`pip-audit`).

```bash
uv sync                 # instala do lock (reproduzível)
uv add httpx            # adiciona dep + atualiza lock
uv add --dev pytest     # dep de desenvolvimento
uv run pytest           # roda no ambiente do projeto
```

### 2. `pyproject.toml` como fonte única

**MUST.** Centralize metadados e config de ferramentas em `pyproject.toml`.

```toml
[project]
name = "myapp"
requires-python = ">=3.11"
dependencies = ["fastapi", "pydantic", "httpx"]

[tool.ruff]
target-version = "py311"
line-length = 100

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "S", "ASYNC", "C4", "SIM", "RUF"]
# E/F pycodestyle/pyflakes, I isort, UP pyupgrade, B bugbear,
# S bandit (segurança), ASYNC armadilhas async, SIM simplificações

[tool.mypy]
python_version = "3.11"
strict = true
warn_unreachable = true
```

### 3. Lint e formatação — Ruff

**MUST.** Use **Ruff** (substitui flake8, isort, pyupgrade, parte do pylint e black).

- **MUST:** habilite no mínimo `E,F,I,UP,B,S,SIM` (inclui **bandit/`S`** para segurança);
  `ruff format` para formatação. Sem discussão de estilo em review — a ferramenta decide.
- **SHOULD:** findings de lint como erro no CI; suprima caso a caso com `# noqa: <code>`
  justificado, nunca globalmente.

> O estilo deve ser automatizado sempre que possível. Discussões humanas focam em design,
> clareza, comportamento e riscos.

### 4. Type checking

**MUST (G1).** Type checker em **modo estrito** no CI: **mypy `--strict`** ou **pyright**.

- **MUST:** assinaturas públicas totalmente tipadas; `Any` só em fronteiras dinâmicas
  reais, isolado e comentado; zero erro de tipo no CI; `# type: ignore[code]` específico e
  justificado, nunca blanket.
- **SHOULD:** `disallow_untyped_defs`, `warn_return_any`, `warn_unused_ignores`. Para libs
  sem stubs, instale `types-*` ou escreva stubs mínimos.

### 5. Pre-commit

**SHOULD.** Use **pre-commit** para lint/format/type-check localmente antes do commit.

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.x.x
    hooks:
      - id: ruff           # lint
      - id: ruff-format    # format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.x.x
    hooks:
      - id: mypy
```

- **MUST:** o pre-commit **não substitui o CI** (devs podem pular hooks). Os mesmos checks
  rodam em ambos.
- **SHOULD:** hooks de higiene (trailing whitespace, end-of-file, detecção de secrets,
  check de YAML/TOML).

### 6. Ambientes virtuais e reprodutibilidade

- **MUST:** ambiente isolado por projeto (`.venv`); nunca instale deps no Python global.
- **MUST:** CI e produção instalam **do lockfile**, com a mesma versão de Python do
  desenvolvimento.
- **SHOULD:** versione a versão de Python (`.python-version`); a mesma em dev, CI e imagem.

### 7. CI mínimo (gate de qualidade)

**MUST.** Pipeline que falha o merge se qualquer etapa falhar:

1. Instalar do lockfile (reproduzível)
2. `ruff check` + `ruff format --check`
3. `mypy --strict` (ou pyright)
4. `pytest` com cobertura mínima
5. Auditoria de dependências (`pip-audit`/`uv`)
6. (SHOULD) scan de secrets e SAST

- **MUST:** main protegida; merge só com CI verde e review.

### ✅ Checklist de tooling

- [ ] Gerenciador moderno (uv/Poetry) com lockfile commitado e versões fixas
- [ ] `pyproject.toml` como config única; `requires-python` declarado
- [ ] Ruff (lint+format) com grupos incl. `S` (segurança); zero warning no CI
- [ ] mypy `--strict`/pyright no CI; zero erro; sem `Any`/`ignore` blanket (G1)
- [ ] pre-commit com lint/format/type-check + detecção de secrets
- [ ] `.venv` isolado; mesma versão de Python em dev/CI/prod
- [ ] CI: lock→lint→types→testes→audit de deps; main protegida

---

## Deploy e runtime

### 1. Servidor de aplicação (nunca o de dev)

**MUST.** Nunca use o servidor embutido de dev em produção (`flask run`/`app.run()`,
`manage.py runserver`, `uvicorn` single sem gerenciador). São single-process, sem robustez,
e alguns expõem o debugger (RCE).

| Stack | Servidor de produção |
|---|---|
| WSGI (Flask, Django sync) | **gunicorn** (sync/gthread/gevent) ou uWSGI |
| ASGI (FastAPI, Django async) | **uvicorn** gerenciado por **gunicorn** (`-k uvicorn.workers.UvicornWorker`) |

- **MUST:** rode atrás de um **reverse proxy** (nginx/envoy/ingress) — TLS, buffering,
  limites de conexão, body size limit.
- **MUST:** dimensione workers/threads pelo perfil e pelo limite do banco: `workers ×
  threads × pool_size ≤ max_connections`. Heurística inicial: `workers ≈ 2×CPU + 1` para
  sync I/O-bound; ajuste por medição.
- **MUST:** timeouts do servidor (worker, graceful, keep-alive) coerentes com os da
  aplicação.

### 2. Containerização

**SHOULD.** Imagem mínima, segura e cacheável (multi-stage).

```dockerfile
FROM python:3.11-slim AS build
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen --no-dev   # instala do lock, sem dev

FROM python:3.11-slim AS runtime
RUN useradd --create-home --uid 10001 appuser     # não-root
WORKDIR /app
COPY --from=build /app/.venv /app/.venv
COPY src/ ./src/
USER appuser                                       # MUST: não rodar como root
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "myapp.main:app"]
```

- **MUST:** **usuário não-root** (CWE-250); instale **do lockfile** (`--frozen`) sem dev
  deps; imagem base mínima (`-slim`/distroless) pinada por digest quando crítico;
  **nenhum secret na imagem** (nem em layer intermediário — `docker history` revela).
- **SHOULD:** multi-stage; scan de vulnerabilidade no CI (trivy/grype); filesystem
  read-only; drop de capabilities.

### 3. Configuração em runtime (12-factor)

- **MUST:** config do **ambiente**, validada no boot; a **mesma imagem** em staging e
  produção (só a config muda — não builde por ambiente).
- **MUST:** secrets via **secret manager**/orquestrador (env ou arquivo montado), nunca no
  `Dockerfile`/repo.
- **SHOULD:** logs para **stdout/stderr** (12-factor); não escreva arquivos de log no
  container.

### 4. Graceful shutdown

**MUST.** Ao receber `SIGTERM`, o processo: para de aceitar novos requests, **termina os em
andamento** (até um deadline), fecha conexões (DB, HTTP) e sai.

```python
@asynccontextmanager
async def lifespan(app):
    yield
    await app.state.http.aclose()
    await engine.dispose()
```

- **MUST:** `graceful timeout` ≥ maior request legítimo esperado, mas finito;
  workers/consumidores de fila terminam a mensagem atual antes de sair (ou devolvem para
  redelivery); o orquestrador manda `SIGTERM` e espera antes de `SIGKILL`.

### 5. Probes do orquestrador

- **MUST:** **liveness** → `/health` (barato, sem dependências); **readiness** → `/ready`
  (checa dependências); **startup probe** para apps com boot lento.
- **MUST:** configure `resources.requests/limits` (CPU/memória) — sem limite de memória, um
  vazamento derruba o nó.

### 6. Migrations no deploy

- **MUST:** migrations **expand/contract**, compatíveis com a versão anterior em paralelo
  (rolling deploy expõe N e N-1).
- **MUST:** rode migration como **passo controlado** do pipeline (job dedicado antes do
  rollout), não no boot de cada réplica; sempre com caminho de rollback; migration
  destrutiva só depois que nenhum código a usa.
- **AVOID:** lock pesado em tabela grande durante deploy de pico.

### 7. Estratégia de deploy e rollback

- **SHOULD:** rolling/blue-green/canary; em sistema crítico, **rollback trivial e ensaiado**.
- **MUST:** artefato **imutável e versionado** (tag/digest); rollback = reapontar para o
  anterior, não rebuildar.
- **SHOULD:** desacople **deploy** (código no ar) de **release** (feature ligada) com
  feature flags (kill switch sem novo deploy).
- **MUST:** após deploy, observe os sinais (erro, latência, saturação) antes de declarar
  sucesso.

### 8. Capacidade e limites de runtime

- **SHOULD:** defina e teste o ponto de saturação; autoscaling por sinal relevante
  (CPU/RPS/latência), com mínimo e máximo.
- **MUST:** limites de recurso por instância coerentes com o pool de conexões e o uso de
  memória medido — não chutado.

### ✅ Checklist de deploy & runtime

- [ ] Servidor de produção (gunicorn/uvicorn-managed) atrás de proxy; nunca dev server
- [ ] Workers/threads × pool ≤ max_connections; timeouts do servidor coerentes
- [ ] Imagem multi-stage, slim, do lockfile, sem dev deps, **não-root**, sem secrets
- [ ] Scan de imagem; base pinada
- [ ] Config e secrets via ambiente/secret manager; mesma imagem por ambiente; logs em stdout
- [ ] Graceful shutdown (drena requests, fecha conexões, finaliza mensagem)
- [ ] Liveness barato + readiness real + startup probe; resources.limits definidos
- [ ] Migrations expand/contract, passo controlado, com rollback
- [ ] Artefato imutável versionado; rollback trivial; deploy≠release via flags
- [ ] Sinais observados pós-deploy; autoscaling por sinal relevante

---

## Documentação mínima

Todo projeto Python deve ter pelo menos: objetivo do projeto; como executar localmente;
como rodar testes; variáveis de ambiente necessárias; comandos principais; arquitetura
resumida; entry points; dependências externas; decisões importantes; limitações conhecidas.

- **AVOID:** documentação que apenas repete o código.

---

## Definition of Done (DoD)

Gate final antes de considerar uma entrega de endpoint/serviço crítico completa:

- [ ] Entrada validada por modelo tipado na borda (G2)
- [ ] Saída com contrato/schema explícito e versionado
- [ ] Erros mapeados para respostas padronizadas (RFC 9457) — sem stack trace vazando
- [ ] Toda I/O com timeout; coleções paginadas (G4)
- [ ] Operações de escrita idempotentes ou protegidas (G5)
- [ ] Autenticação E autorização verificadas (authz por recurso)
- [ ] Sem secrets no código; config via ambiente
- [ ] Queries parametrizadas; sem N+1 conhecido
- [ ] Logs estruturados + métricas + trace span no caminho crítico (G7)
- [ ] Health/readiness checks refletindo dependências reais
- [ ] Testes: unidade (lógica), integração (borda↔dependências), contrato (API)
- [ ] `ruff` + `mypy/pyright` estrito + testes passando no CI
- [ ] Migrations reversíveis e compatíveis com deploy sem downtime
- [ ] Documentação de API (OpenAPI) atualizada

### Quality gate mínimo

```text
ruff check
ruff format --check
mypy ou pyright (modo estrito)
pytest (com cobertura mínima)
dependency/security scan (pip-audit + secrets)
build/empacotamento quando necessário
```

---

## Sinais de bom uso e de uso ruim

### Sinais de bom uso

- O domínio não depende de framework; casos de uso são fáceis de testar.
- Integrações externas estão isoladas em adapters.
- Logs ajudam a diagnosticar falhas reais; erros têm contexto e responsabilidade clara.
- Tipagem melhora previsibilidade sem travar produtividade.
- Estrutura de pastas ajuda a entender o sistema; código simples continua simples.
- Arquitetura cresce conforme a necessidade; performance é medida e tratada com evidência.

### Sinais de uso ruim

- Tudo dentro de um único script; controllers/consumers/CLIs concentram regra de negócio.
- Dicionários soltos atravessam todas as camadas; framework aparece dentro do domínio.
- `print` como observabilidade; exceções genéricas escondem a causa real.
- Sem timeout em chamadas externas; testes dependem demais de detalhes internos.
- Abstrações criadas antes de existir variação real; estrutura complexa demais para
  problema simples.
- Dependências adicionadas sem critério; secrets em código ou logs.

---

## Regra final

Este guia existe para orientar o uso consistente da stack, não para impor burocracia.

> Ajudar a construir soluções Python claras, testáveis, observáveis, reutilizáveis,
> seguras, performáticas e sustentáveis.

A arquitetura deve servir ao problema. Quando o problema for simples, o código deve
continuar simples. Quando o problema crescer, a estrutura deve estar preparada para crescer
sem virar acoplamento, improviso ou complexidade invisível.

**Regras de comportamento (para o agente de IA):**

1. **Nunca gere código que viole uma regra `MUST`.** Se pedirem algo que viole, sinalize o
   risco e proponha a alternativa segura.
2. **Carregue/consulte a seção relevante antes de opinar** sobre um domínio específico.
3. **Cite a regra** (ex.: "G4 / dados-async §Timeouts") ao justificar uma escolha.
4. **Adapte ao framework presente** — detecte FastAPI/Django/Flask antes de sugerir padrões.
5. **Prefira o idioma do código existente** — match a convenção do repositório.
6. **Não invente dependências** — sugira só bibliotecas estáveis; fixe versões; justifique.
