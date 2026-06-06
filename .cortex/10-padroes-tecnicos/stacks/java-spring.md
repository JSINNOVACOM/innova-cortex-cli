# Stack: Java + Spring

## Objetivo

Definir padrões técnicos iniciais para projetos que utilizem Java com Spring, mantendo consistência, previsibilidade e boa separação de responsabilidades.

Relacionado a:

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- memoria-operacional (registro interno, não publicado no OSS)
- pendencias (registro interno, não publicado no OSS)
- [quality-gate-base](../quality-gates/quality-gate-base.md)

---

## Princípio central

Este arquivo trata da **stack concreta** Java + Spring.

Ele não define o papel do componente no sistema. Ele define como essa stack deve ser usada de forma consistente.

A pergunta central aqui é: **“como construir com Java + Spring de forma organizada e sustentável?”**

---

## O que esta stack representa

Esta stack é adequada para aplicações backend em que Java oferece base de tipagem, robustez e ecossistema maduro, enquanto Spring oferece infraestrutura para composição de aplicações, injeção de dependência, exposição de APIs, integração e suporte operacional.

---

## Princípios de uso da stack

### 1. Java como ferramenta de clareza (Tipagem Explícita e Idioma)

A stack deve usar a linguagem para aumentar previsibilidade e legibilidade. O código deve ser lido como um texto fluido em português.

- **Proibição do uso de `var`:** É obrigatório tipar todas as variáveis explicitamente.
    
    - _Bom:_ `Usuario usuario = new Usuario();` / `List<String> itens = new ArrayList<>();`
    - _Ruim:_ `var usuario = new Usuario();`
    
- **Proibição de "Unnamed Variables" (`_`):** Não utilizar o recurso de variáveis não nomeadas. Toda variável deve ter um nome semântico, mesmo que não seja utilizada no escopo (ex: em blocos `catch` ou lambdas).
    
- **PT-BR Obrigatório:** Todos os nomes de classes, métodos, atributos e variáveis devem ser escritos em **Português (Brasil)**.
    - _Ex: `ProcessadorPagamento` em vez de `PaymentProcessor`._


### 2. Spring com responsabilidade explícita

Spring deve apoiar composição e organização da aplicação, não esconder a lógica.

- **Injeção via Construtor:** Evitar terminantemente o uso de `@Autowired` em atributos (Field Injection). Usar injeção via construtor para garantir que o componente seja imutável e facilmente testável.
- **Componentes Claros:** Uso disciplinado de `@Service`, `@Component` e `@Repository` conforme a semântica da camada.

### 3. Imutabilidade e Modernidade (Java 17+)

- **Records para DTOs:** Utilizar `record` para classes de transporte de dados (DTOs), garantindo imutabilidade e reduzindo boilerplate de getters/setters.
- **Optional:** Métodos de busca ou que podem não retornar valor devem obrigatoriamente retornar `Optional<T>`. Nunca retornar `null`.

### 4. Mappers com MapStruct

A transformação de dados entre camadas deve ser automatizada e isolada.

- **Padrão:** Sempre preferir o **MapStruct** para conversões entre Entidades e DTOs.
- **Isolamento:** A lógica de mapeamento não deve poluir as classes de serviço ou controllers.

### 5. Persistência e Evolução de Banco

- **Migrações:** Uso obrigatório de ferramentas de migração de banco de dados (**Flyway** ou **Liquibase**).
- **Controle:** O Hibernate não deve criar ou alterar tabelas automaticamente (`ddl-auto` deve ser `validate` ou `none`).
- **Nomenclatura:** Tabelas e colunas no banco seguem `snake_case`, enquanto o mapeamento no Java segue `camelCase`.

### 6. Contratos e API (REST)

- **Padronização de URLs:** Substantivos no plural e `kebab-case`. Ex: `/v1/pedidos-compra`.
- **Versionamento:** APIs devem ser versionadas na URL (ex: `/api/v1/...`).
- **Paginação:** Listagens devem obrigatoriamente suportar paginação via `Pageable`.

### 7. Tratamento de Erro e Validação

- **Tratamento Global:** Centralizar exceções em um `@ControllerAdvice`.
- **Bean Validation:** Validar contratos de entrada nos DTOs usando anotações como `@NotBlank`, `@NotNull`, etc.

### 8. Testes Automatizados

- **Naming em PT-BR:** Métodos de teste devem descrever o comportamento esperado em português.
    - _Ex: `deve_SalvarUsuario_Quando_DadosForemValidos()`._


---

## Organização recomendada

A estrutura de pacotes deve refletir as responsabilidades em português:

Plaintext

```
src/main/java/
    projeto/
        configuracao/   # Configurações de Beans, Security, etc.
        controle/       # Camada de entrada (Controllers)
	    dto/            # Records de Request e Response
        dominio/        # Entidades JPA e regras de domínio
        servico/        # Lógica de negócio simples e orquestração
        bussiness       # Quando ouver necessidade de logica de negocio mais detalhada
        repositorio/    # Interfaces de acesso a dados (Spring Data)
        integracao/     # Clientes HTTP, Feign, integração externa
        excecao/        # Definição de erros e Handler global
        mapeador/       # Interfaces MapStruct
```

---

## Sinais de bom uso

- Ausência total da palavra-chave `var` no projeto.
- Código escrito inteiramente em português (exceto palavras reservadas da linguagem/framework).
- Mapeamentos realizados exclusivamente por interfaces MapStruct.
- Services sem instâncias de `@Autowired` em campos privados.

## Sinais de uso ruim

- Uso de `var` para reduzir a verbosidade à custa da clareza do tipo.
- Nomenclatura mista (Inglês + Português).
- Uso de variáveis `_` em lambdas ou blocos catch.
- Entidades de banco sendo expostas diretamente nos controllers.

---

## Regra final

O padrão `java-spring` prioriza a **clareza absoluta sobre a brevidade**.

**Seja explícito no tipo, rigoroso na nomenclatura em português e disciplinado na separação de camadas.**