# Stack: Next.js

## Objetivo

Definir padrões técnicos de arquitetura, implementação e qualidade para sistemas Next.js.

> **Documento de referência:** Recomendação Final Curada — Arquitetura, Implementação e Qualidade de Sistemas Next.js  
> **Status:** especificação técnica de referência, revisada em 23/10/2026.  
> **Baseline:** Next.js **16.4.x** (documentação oficial consultada na versão **16.4.2**), App Router, React 19 compatível e TypeScript.  
> **Fonte primária para regras e correções do framework:** <https://nextjs.org/docs>.  
> **Abrangência:** arquitetura, padrões de código, segurança, renderização, cache, SEO, desenvolvimento, testes e operação.  
> **Regra de manutenção:** rever as seções dependentes de versão ao atualizar o Next.js; não aplicar automaticamente regras de versões anteriores ao modelo atual.

**Relacionado a:**

- [Claude](../../Claude.md)
- [00-regras-gerais](../../01-regras/00-regras-gerais.md)
- [03-checklist-de-qualidade](../../01-regras/03-checklist-de-qualidade.md)
- [quality-gate-base](../quality-gates/quality-gate-base.md)
- [quality-gate-interface](../quality-gates/quality-gate-interface.md)

---

## Sumário

- [Princípio central](#princípio-central)
- [Como interpretar este documento](#como-interpretar-este-documento)
- [1. Princípios gerais](#1-princípios-gerais)
- [2. Organização de pastas e responsabilidades](#2-organização-de-pastas-e-responsabilidades)
- [3. Layouts e fronteiras entre servidor e cliente](#3-layouts-e-fronteiras-entre-servidor-e-cliente)
- [4. Política de acesso e redirecionamentos](#4-política-de-acesso-e-redirecionamentos)
- [5. Proxy (`proxy.ts`): navegação e interceptação de requisições](#5-proxy-proxyts-navegação-e-interceptação-de-requisições)
- [6. Data Access Layer (DAL), autenticação e autorização](#6-data-access-layer-dal-autenticação-e-autorização)
- [7. Validação de entradas, SQL Injection, XSS e Webhooks](#7-validação-de-entradas-sql-injection-xss-e-webhooks)
- [8. Segredos, dados pessoais e contrato servidor → cliente](#8-segredos-dados-pessoais-e-contrato-servidor--cliente)
- [9. Dependências e segurança do desenvolvimento](#9-dependências-e-segurança-do-desenvolvimento)
- [10. Navegação, imagens, fontes e carregamento de scripts](#10-navegação-imagens-fontes-e-carregamento-de-scripts)
- [11. Estilização com Tailwind CSS](#11-estilização-com-tailwind-css)
- [12. Política de renderização, Cache Components e invalidação](#12-política-de-renderização-cache-components-e-invalidação)
- [13. SEO: HTML semântico e metadados](#13-seo-html-semântico-e-metadados)
- [14. SEO em rotas dinâmicas e parâmetros assíncronos](#14-seo-em-rotas-dinâmicas-e-parâmetros-assíncronos)
- [15. Robots, Sitemap e indexação](#15-robots-sitemap-e-indexação)
- [16. Dados estruturados (JSON-LD)](#16-dados-estruturados-json-ld)
- [17. Proteções de aplicação, cabeçalhos e monitoramento de segurança](#17-proteções-de-aplicação-cabeçalhos-e-monitoramento-de-segurança)
- [18. Checklist de entrega e publicação](#18-checklist-de-entrega-e-publicação)
- [19. Limites explícitos da especificação](#19-limites-explícitos-da-especificação)
- [20. TypeScript: convenções de tipagem e legibilidade](#20-typescript-convenções-de-tipagem-e-legibilidade)
- [21. Server Functions, Server Actions e Route Handlers](#21-server-functions-server-actions-e-route-handlers)
- [22. Erros, estados vazios, loading e streaming](#22-erros-estados-vazios-loading-e-streaming)
- [23. Estratégia de testes](#23-estratégia-de-testes)
- [24. ESLint, DX e critérios de revisão de código](#24-eslint-dx-e-critérios-de-revisão-de-código)
- [25. CI/CD, ambientes e implantação](#25-cicd-ambientes-e-implantação)
- [26. Auditoria de desempenho e Core Web Vitals](#26-auditoria-de-desempenho-e-core-web-vitals)
- [27. Observabilidade da aplicação](#27-observabilidade-da-aplicação)
- [28. Monorepo e Turborepo (condicional)](#28-monorepo-e-turborepo-condicional)
- [29. Critérios técnicos de contratação e curadoria de pull requests](#29-critérios-técnicos-de-contratação-e-curadoria-de-pull-requests)
- [30. Node.js versus Edge Runtime](#30-nodejs-versus-edge-runtime)
- [31. Governança da fonte de verdade e exceções](#31-governança-da-fonte-de-verdade-e-exceções)
- [Apêndice A — Principais mudanças em relação ao documento original](#apêndice-a--principais-mudanças-em-relação-ao-documento-original)
- [Apêndice B — Índice das fontes oficiais primárias](#apêndice-b--índice-das-fontes-oficiais-primárias)
- [Sinais de bom uso e de uso ruim](#sinais-de-bom-uso-e-de-uso-ruim)
- [Regra final](#regra-final)

---

## Princípio central

Em aplicações Next.js, clareza arquitetural, segurança, previsibilidade e desempenho devem prevalecer sobre conveniência de implementação.

Utilize os recursos nativos do framework, respeitando as responsabilidades entre servidor e cliente, com tipagem consistente, validação nas fronteiras, autorização próxima aos dados e estratégias conscientes de renderização e cache.

Priorize código fácil de entender, testar, manter e diagnosticar. Uma implementação simples e correta é melhor do que uma solução sofisticada sem necessidade comprovada.

As decisões devem seguir preferencialmente a versão estável mais recente do Next.js, utilizando a documentação oficial como fonte de verdade para comportamentos, APIs e restrições do framework.

---

## Como interpretar este documento

- **Obrigatório:** padrão institucional adotado por esta especificação; desvios exigem justificativa técnica registrada.
- **Preferencial:** escolha recomendada para o caso comum; alternativa equivalente pode ser aceita se cumprir o mesmo objetivo.
- **Condicional:** aplicável apenas quando a arquitetura, a funcionalidade ou a infraestrutura apresentar aquela necessidade.
- **Experimental:** não deve ser transformado em dependência mandatória de produção sem avaliação de maturidade e suporte na versão adotada.

A documentação oficial descreve capacidades e restrições do Next.js; **nem toda decisão institucional é uma exigência do framework**. Em caso de conflito sobre o comportamento do Next.js, prevalece a documentação oficial correspondente à versão efetivamente instalada. As bibliotecas mencionadas como exemplos não constituem uma lista obrigatória de fornecedores.

**Referências:** [instalação e requisitos](https://nextjs.org/docs/app/getting-started/installation) · [atualização do Next.js](https://nextjs.org/docs/app/getting-started/upgrading) · [migração para a v16](https://nextjs.org/docs/app/guides/upgrading/version-16).

---

## 1. Princípios gerais

A arquitetura deve combinar organização de rotas, renderização apropriada, acesso controlado a dados, autorização no servidor, validação de entradas, segurança de saídas, desempenho mensurável e observabilidade.

1. **Obrigatório:** utilizar **App Router** em novas aplicações; migrações de Pages Router serão tratadas como projetos de modernização, não como mistura casual de convenções.
2. **Obrigatório:** utilizar **TypeScript** e verificação de tipos em CI.
3. **Obrigatório:** manter **Server Components** como padrão e introduzir Client Components somente quando estado, efeitos, eventos ou APIs de navegador justificarem a fronteira.
4. **Preferencial:** organizar rotas por responsabilidade, recorrendo a route groups quando facilitarem layouts e manutenção; os nomes entre parênteses não integram a URL.
5. **Obrigatório:** centralizar acesso a dados e **autorização por recurso/operação** na DAL ou serviço equivalente de confiança.
6. **Condicional:** usar **Proxy (`proxy.ts`)** para interceptações que realmente dependam da requisição; não confundir redirecionamento otimista com segurança de dados.
7. **Obrigatório:** tratar Server Actions/Server Functions e Route Handlers como superfícies de entrada públicas, validando dados e autorização.
8. **Preferencial:** usar mecanismos nativos do framework (`Link`, `Image`, `next/font`, Metadata API, loading/error boundaries) antes de reimplementá-los.
9. **Condicional:** aplicar SEO e dados estruturados às páginas cuja indexação e compartilhamento sejam relevantes.
10. **Obrigatório:** definir conscientemente renderização, cache, invalidação e isolamento de dados, considerando **Cache Components** como padrão preferencial em novas aplicações Next.js 16.4+.
11. **Obrigatório:** garantir instalação reproduzível, lint, verificação de tipos, build e testes pertinentes antes da entrega.
12. **Obrigatório:** medir desempenho, registrar erros de produção e revisar dependências e segredos.

A presença de cookie, a divisão visual entre pastas públicas/privadas, o uso de `robots` ou a ocultação de um botão **não comprovam autorização**.

**Referências:** [Server e Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [autenticação e autorização](https://nextjs.org/docs/app/guides/authentication) · [Proxy](https://nextjs.org/docs/app/getting-started/proxy) · [Cache Components](https://nextjs.org/docs/app/getting-started/caching).

---

## 2. Organização de pastas e responsabilidades

A estrutura a seguir é uma **referência**, não uma exigência de nomes. Os domínios `products` e `tickets` são exemplos distintos; ajustar a nomenclatura ao sistema real.

```text
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── sign-in/page.tsx
│   │   ├── register/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── contact/page.tsx
│   │   └── products/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   ├── (private)/
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── api/
│   │   └── webhooks/provider/route.ts
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   └── ui/
├── data-access/
│   ├── products.ts
│   └── tickets.ts
├── actions/
│   └── tickets.ts
├── lib/
│   ├── db.ts
│   ├── auth/
│   ├── validations/
│   └── observability/
├── instrumentation.ts            # quando houver instrumentação do servidor
└── proxy.ts                       # opcional; apenas quando necessário
```

### Regras de organização

- `app/layout.tsx`: layout raiz, informações compartilhadas e metadados gerais.
- `app/(public)/` e `app/(private)/`: **organização** e layouts; não representam autorização automática.
- `app/(public)/products/[slug]/page.tsx`: rota `/products/:slug`; route groups não participam da URL.
- `data-access/`: operações de dados com proteção efetiva; módulos exclusivamente servidores devem usar `import 'server-only'`.
- `actions/`: Server Functions invocáveis pelo cliente, quando houver mutações que justifiquem seu uso. A camada não substitui a DAL.
- `app/api/**/route.ts`: endpoints HTTP e Webhooks, com autenticação/verificação de origem e contratos próprios.
- `components/ui/`: componentes reutilizáveis sem dependência de domínio quando fizer sentido.
- `proxy.ts`: interceptação opcional de requisições, na raiz ou em `src/`, no mesmo nível de `app/`.

**Obrigatório:** evitar que a organização de pastas incentive lógica de domínio dentro de componentes visuais, ou componentes/clientes de banco importados no navegador.

**Não obrigatório:** criar todas as pastas preventivamente. Co-localizar funções e componentes próximos da rota é aceitável quando preserva fronteiras de responsabilidade. Não duplicar arquitetura por antecipação.

**Referências:** [estrutura de projeto](https://nextjs.org/docs/app/getting-started/project-structure) · [route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) · [convenção Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy).

---

## 3. Layouts e fronteiras entre servidor e cliente

### 3.1. Server Components

- **Obrigatório:** páginas e layouts são Server Components por padrão, salvo motivo concreto para `use client`.
- Consultar dados na camada de servidor sem transportar segredos, conexões ou objetos internos ao navegador.
- Utilizar composição: uma página servidora pode renderizar componentes clientes pequenos e focados.
- Evitar chamadas HTTP internas desnecessárias a Route Handlers da própria aplicação quando o servidor puder invocar diretamente uma função da DAL; isso elimina uma ida à rede e preserva contratos de autorização.

### 3.2. Client Components

- **Obrigatório:** adicionar `'use client'` somente na **fronteira necessária** para eventos, estado interativo, efeitos, browser APIs ou hooks que exigem cliente.
- **Obrigatório:** reconhecer que tudo que o módulo cliente importa passa a participar do grafo cliente; não converter páginas e layouts inteiros em cliente por causa de um botão.
- **Obrigatório:** transmitir somente props serializáveis pelo React e dados estritamente necessários à interface.
- **Obrigatório:** evitar resultados diferentes entre o HTML inicial e a primeira renderização cliente, particularmente com `window`, tempo, aleatoriedade e localização.
- **Preferencial:** encapsular widgets de terceiros que exigem navegador em wrappers clientes pequenos.

### 3.3. Layouts, templates e composição

- `layout.tsx` compartilha UI e pode preservar estado durante navegação; não é guarda suficiente de autorização.
- `template.tsx` deve ser usado quando for necessário recriar um segmento na navegação, e não apenas como variação estilística.
- `loading.tsx` e `Suspense` definem limites de carregamento e streaming; `error.tsx` captura falhas inesperadas da subárvore.
- A verificação efetiva de permissão deve acompanhar os dados/ações protegidos, inclusive quando um Server Component é reutilizado.

**Referências:** [Server e Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages) · [streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading).

---

## 4. Política de acesso e redirecionamentos

As rotas públicas não precisam ter o mesmo comportamento para usuários autenticados. Definir separadamente destinos comuns e entradas de login/cadastro.

| Destino | Sem sessão válida | Com sessão válida |
| --- | --- | --- |
| `/` | Permitir | Permitir |
| `/sign-in` | Permitir | Redirecionar ao dashboard, quando apropriado |
| `/register` | Permitir | Redirecionar ao dashboard, quando apropriado |
| `/pricing` | Permitir | Permitir |
| `/contact` | Permitir | Permitir |
| `/products` | Permitir | Permitir |
| `/products/[slug]` | Permitir | Permitir |
| `/dashboard` | Encaminhar ao login ou responder não autorizado | Permitir apenas após autorização no servidor |

A política pode ser representada por uma coleção tipada:

```ts
const publicRoutes = [
  { path: '/', whenAuthenticated: 'next' },
  { path: '/sign-in', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/pricing', whenAuthenticated: 'next' },
  { path: '/contact', whenAuthenticated: 'next' },
  { path: '/products', whenAuthenticated: 'next' },
] as const;
```

- Este exemplo **não implementa** sozinho reconhecimento de rotas dinâmicas; `/products/[slug]` requer classificação por padrão.
- **Obrigatório:** não construir um ciclo no qual qualquer cookie falsificado/expirado impeça o acesso ao login; redirecionamento para fora do login exige evidência confiável de sessão ou um fluxo de recuperação bem definido.
- A classificação visual `/public` versus `/private` não deve se sobrepor a verificações reais em DAL, Actions e Route Handlers.
- Evitar mudar silenciosamente o significado de `/` segundo o estado de login; preferir redirecionamentos quando a UX o exigir.

**Referência:** [autenticação no Next.js](https://nextjs.org/docs/app/guides/authentication).

---

## 5. Proxy (`proxy.ts`): navegação e interceptação de requisições

> **Correção de versão do documento original:** `middleware.ts` é uma convenção depreciada no Next.js 16. A convenção atual é `proxy.ts`, cuja execução utiliza **Node.js runtime**; não pressupor Edge Runtime para esse arquivo.

### 5.1. Quando utilizar

- Redirecionamentos condicionados a características da requisição, reescritas, cabeçalhos e verificações **otimistas** de sessão.
- Preferir `redirects` em `next.config.ts` para redirecionamentos estáticos simples.
- Não utilizar Proxy como mecanismo exclusivo de autenticação, autorização, refresh token ou sessão.
- Não concentrar em Proxy consultas rotineiras custosas ao banco, processos demorados ou decisões definitivas de acesso a registros.

### 5.2. Navegação e `matcher`

- **Obrigatório:** classificar a rota pela URL solicitada e explicitar o comportamento de destinos públicos, privados e de login.
- **Obrigatório:** definir `matcher` abrangendo apenas as requisições relevantes; revisar exclusões para `_next`, arquivos estáticos, metadados e `/api`.
- **Obrigatório:** se uma ação ou rota mudar de caminho, verificar novamente sua cobertura; Server Functions usam POST na rota em que são expostas, não um endpoint independente necessariamente coberto pelo matcher.
- Para redirecionar, utilizar a API do framework (`NextResponse.redirect`, `redirects` ou `redirect` conforme o contexto); para seguir, `NextResponse.next()`.

Exemplo mínimo de convenção, **não** de autenticação:

```ts
// src/proxy.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/old-pricing') {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/old-pricing'],
};
```

### 5.3. Controles de segurança complementares

Soluções como Arcjet ou mecanismos de rate limiting/bot protection podem atuar em Proxy ou nos pontos específicos de entrada. Não se tornam obrigatórios por serem citados aqui. Verificar limitações e custos de toda inspeção externa.

### 5.4. Token e cookie

**Cookie presente não significa sessão válida.** Ler `exp`/`iat` de JWT sem verificar assinatura pode servir no máximo como informação não confiável para uma navegação otimista; a autorização depende de validação da sessão e dos direitos de acesso. Renovação de token não deve ser embutida indiscriminadamente no Proxy.

**Referências:** [Proxy e migração de Middleware](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) · [guia Proxy](https://nextjs.org/docs/app/getting-started/proxy) · [upgrade v16](https://nextjs.org/docs/app/guides/upgrading/version-16).

---

## 6. Data Access Layer (DAL), autenticação e autorização

### 6.1. Contrato obrigatório

1. Autenticar o solicitante usando a sessão real, quando exigida.
2. **Autorizar a operação** solicitada: leitura, criação, atualização ou exclusão.
3. **Autorizar o recurso e o escopo**: proprietário, tenant, equipe, perfil ou permissões específicas.
4. Construir consulta/mutação restringindo o escopo aos registros permitidos, preferencialmente no próprio acesso a dados.
5. Validar os dados aplicáveis; retornar somente campos necessários (DTO/projeção).
6. Manter o módulo no servidor com `import 'server-only'`.
7. Evitar bypass da DAL por componentes ou Actions; realizar transações quando a consistência do caso de uso exigir.

**Falha de segurança a impedir:** verificar apenas que existe usuário autenticado e consultar um recurso por `id`, permitindo leitura de registros pertencentes a outros usuários (*IDOR*).

### 6.2. Exemplo de consulta com escopo

```ts
// src/data-access/tickets.ts
import 'server-only';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';

export async function findMyTicket(id: string) {
  const session = await verifySession();

  // Sintaxe ilustrativa do client de banco utilizado pelo projeto.
  return db.ticket.findFirst({
    where: { id, ownerId: session.userId },
    select: { id: true, question: true, status: true },
  });
}
```

O código acima cobre **somente** o cenário de proprietário individual. Em aplicações com tenant/equipe, a política de autorização correspondente precisa ser implementada e testada. Nunca aceitar do cliente um `ownerId` ou `tenantId` como prova de autorização.

### 6.3. Reutilização sem duplicar consultas

`cache()` do React pode evitar repetir **o mesmo trabalho dentro da mesma renderização**, como resolver sessão ou recurso usado em `page` e `generateMetadata`. **Não confundir** essa memoização por renderização com cache persistente entre usuários/requisições.

**Referências:** [DAL, autorização e DTO](https://nextjs.org/docs/app/guides/authentication) · [segurança dos dados](https://nextjs.org/docs/app/guides/data-security) · [consulta de dados](https://nextjs.org/docs/app/getting-started/fetching-data).

---

## 7. Validação de entradas, SQL Injection, XSS e Webhooks

### 7.1. Entradas não confiáveis

| Origem | Verificar |
| --- | --- |
| `page.tsx` / `generateMetadata` | `params`, `searchParams` e identificadores derivados |
| Server Functions / Actions | `FormData`, argumentos e permissões |
| `route.ts` | método, headers, query, body, autenticação e autorização |
| Webhooks | assinatura/autenticidade, evento, integridade e idempotência |
| Integrações externas | esquema de resposta, limites e valores não esperados |

TypeScript **não valida** conteúdo recebido pela rede. Validar com schema ou regras equivalentes **na fronteira do servidor**. Validação de cliente melhora UX, mas não substitui validação no servidor.

### 7.2. SQL Injection

- **Obrigatório:** utilizar consultas parametrizadas ou APIs seguras do ORM/query builder.
- **Proibido:** concatenar valores de usuário em instruções SQL, mesmo após `trim`, verificações de tipo ou sanitizações genéricas.
- Para SQL dinâmico estrutural (ordenação, coluna etc.), usar allowlists; parâmetros SQL não substituem validação da estrutura.

### 7.3. XSS

- Preferir renderização normal do React, que trata o conteúdo como texto.
- Evitar `dangerouslySetInnerHTML` com conteúdo externo; quando necessário, utilizar estratégia comprovada de sanitização para **o contexto HTML específico**.
- Diferenciar validação de formato, escape de saída, sanitização de HTML e SQL parametrizado: são controles com propósitos diferentes.

### 7.4. Webhooks

1. Receber em Route Handler apropriado.
2. Validar assinatura ou prova fornecida pelo provedor **antes** de confiar no conteúdo; quando o provedor exigir, usar o corpo bruto da requisição.
3. Verificar estrutura e tipo do evento.
4. Implementar idempotência/deduplicação por identificador do evento para evitar duplicação de efeitos em retries.
5. Registrar resultado e falhas com dados sensíveis minimizados.

A exigência de idempotência é **padrão arquitetural de integração**, não uma promessa automática do Next.js.

**Referências:** [segurança dos dados](https://nextjs.org/docs/app/guides/data-security) · [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) · [JSON-LD seguro](https://nextjs.org/docs/app/guides/json-ld).

---

## 8. Segredos, dados pessoais e contrato servidor → cliente

- **Obrigatório:** manter chaves e credenciais fora do código e fora do navegador; utilizar `process.env` em módulos servidores e `server-only` quando adequado.
- `NEXT_PUBLIC_` **expõe o valor ao cliente** e pode incorporá-lo ao bundle; usar somente para configuração realmente pública. Não utilizar para segredos.
- **Obrigatório:** enviar ao cliente apenas a projeção de dados requerida; DTOs e seleção de colunas servem para impedir vazamento involuntário.
- Dados recebidos do servidor por Client Components precisam respeitar o contrato de serialização do React.
- Quando o caso envolver PII, estabelecer necessidade, retenção, acesso e proteção de logs de acordo com requisitos do produto e legislação aplicável.
- Recursos como React Taint API e detectores de informações sensíveis podem ser usados como **defesa adicional** quando suportados; não substituem DTO, autorização nem testes.
- Redaction pode auxiliar logs/processamento, mas não é uma política completa de proteção de dados.

**Referências:** [ambientes e variáveis](https://nextjs.org/docs/app/guides/environment-variables) · [limite Server/Client e `server-only`](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [DAL/DTO](https://nextjs.org/docs/app/guides/authentication).

---

## 9. Dependências e segurança do desenvolvimento

- **Obrigatório:** fixar as versões resolvidas em **um lockfile** do gerenciador escolhido (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` etc.) e realizar instalações reprodutíveis no CI.
- Conferir dependências diretas e transitivas e analisar avisos de segurança aplicáveis à versão instalada.
- Atualizar versões com planejamento e testes; acompanhar alertas de segurança do Next.js/React, sobretudo os que envolvem Server Components ou Server Functions.
- Examinar licenças quando há redistribuição ou uso comercial.
- Evitar pacotes sem valor técnico claro, mantendo o ganho real de utilidades e abstrações necessárias.
- Bloquear inclusão de segredos em commits e artefatos de build por ferramentas ou processos apropriados.
- Não aplicar automaticamente uma correção de dependência que introduza breaking changes sem validação funcional.

**Referências:** [atualização](https://nextjs.org/docs/app/getting-started/upgrading) · [guia de versão 16](https://nextjs.org/docs/app/guides/upgrading/version-16).

---

## 10. Navegação, imagens, fontes e carregamento de scripts

| Recurso | Regra |
| --- | --- |
| `next/link` | Preferir para navegação interna; utilizar prefetch conforme impacto real |
| `next/image` | Preferir quando houver otimização aplicável; definir dimensões/layout e `alt` adequado |
| `next/font` | Preferir para carregar e hospedar fontes integradas, evitando mudanças visuais de carregamento |
| `next/script` | Utilizar estratégia adequada para scripts de terceiros, quando forem necessários |
| `next/dynamic` | Adiar partes pesadas não exigidas no carregamento inicial; verificar custo no bundle |

Para imagens remotas, configurar origens aceitas via `remotePatterns` e não abrir padrões excessivamente amplos sem necessidade. Para a imagem essencial ao LCP, avaliar carregamento prioritário; não aplicar lazy loading indiscriminado a todo elemento visual.

`Link` e prefetch são otimizações: não executar efeitos colaterais de negócio durante a renderização de páginas que possam ser pré-buscadas.

**Referências:** [navegação](https://nextjs.org/docs/app/getting-started/linking-and-navigating) · [imagens](https://nextjs.org/docs/app/getting-started/images) · [fontes](https://nextjs.org/docs/app/getting-started/fonts) · [prefetch](https://nextjs.org/docs/app/guides/prefetching).

---

## 11. Estilização com Tailwind CSS

**Decisão institucional mantida:** usar **Tailwind CSS** como padrão de estilização de aplicações abrangidas por esta especificação.

- Preferir utilitários do Tailwind quando atendem à necessidade e manter classes legíveis.
- Evitar CSS adicional criado apenas para repetir recursos já oferecidos pelas classes utilitárias.
- Extrair componentes visuais para evitar repetição excessiva de estruturas longas e inconsistentes.
- Preservar semântica, acessibilidade, contraste e comportamento responsivo; Tailwind não substitui essas obrigações.
- CSS Modules ou CSS específico continuam admissíveis quando possuem justificativa concreta.

Esta regra é uma **escolha de projeto**, não um requisito do App Router.

**Referência:** [CSS e Tailwind](https://nextjs.org/docs/app/getting-started/css).

---

## 12. Política de renderização, Cache Components e invalidação

> **Seção substituída e ampliada.** A enumeração anterior de *Request Memoization / Data Cache / Full Route Cache / Router Cache* não é suficiente como política para novas aplicações com Cache Components. Ela permanece relevante para compreender o **modelo anterior**, mas não deve governar a implementação atual sem distinguir as versões.

### 12.1. Baseline de novas aplicações

**Preferencial para Next.js 16.4+:** habilitar/confirmar o modelo de **Cache Components** e **Partial Prefetching**, seguindo a configuração suportada pela versão instalada. Exemplo alinhado ao modelo 16.4:

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
};

export default nextConfig;
```

`partialPrefetching` requer `cacheComponents: true` e deve ser configurado explicitamente na versão de referência. Nos projetos criados com os defaults recomendados de `create-next-app`, ambos já são ativados. Revisar essas flags a cada upgrade, pois a documentação prevê alteração no próximo major. **Fonte:** [Caching — configuração atual](https://nextjs.org/docs/app/getting-started/caching) · [partialPrefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching).

### 12.2. Vocabulário de renderização

| Estratégia / conceito | Decisão de arquitetura |
| --- | --- |
| SSR / renderização no momento da requisição | Dados atualizados ou vinculados à requisição exigem trabalho no servidor quando solicitados |
| SSG / pré-renderização | Conteúdo independente da requisição pode ser produzido antes e reutilizado |
| ISR / revalidação | Conteúdo cacheado pode ser atualizado por tempo ou evento, de acordo com a semântica do cache |
| Streaming | Usar `Suspense`/`loading.tsx` para disponibilizar UI progressivamente sem bloquear toda a página |
| PPR / Cache Components | Misturar **shell estático**, trechos cacheados e conteúdo dinâmico numa mesma rota |

Esses nomes descrevem **estratégias**, não uma exigência de `getServerSideProps`/`getStaticProps` (APIs do Pages Router). No App Router moderno, a estratégia deve ser construída com seus próprios mecanismos.

### 12.3. Diretrizes obrigatórias de cache

1. **Decidir se cada dado precisa de frescor por requisição, pode tolerar desatualização ou pode ser pré-renderizado.**
2. Utilizar `'use cache'` intencionalmente em funções/componentes elegíveis; controlar tempo com `cacheLife` e invalidação com `cacheTag` quando pertinente.
3. **Nunca permitir compartilhamento não autorizado de conteúdo privado entre usuários/tenants.** Cache de dados personalizados só é aceitável quando chave, escopo e controle de acesso são corretamente isolados e testados.
4. Não transportar objetos de sessão, segredos ou APIs de requisição diretamente para um escopo cacheado incompatível; seguir as restrições da diretiva e as estratégias suportadas para dados privados.
5. Preferir invalidação granular por tag quando representa o recurso; `revalidatePath` é adequado quando o escopo é uma rota.
6. Após mutação, definir se a UX exige **read-your-own-writes** imediato ou aceita *stale-while-revalidate*.
7. Evitar tanto cache indiscriminado quanto invalidação geral que destrói desempenho sem necessidade.

### 12.4. Exemplo de cache compartilhável por catálogo

```ts
// src/data-access/catalog.ts
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';

export async function listPublicProducts() {
  'use cache';
  cacheLife('hours');
  cacheTag('catalog-products');

  return db.product.findMany({
    where: { published: true },
    select: { id: true, name: true, slug: true },
  });
}
```

**Atenção:** o exemplo representa conteúdo **público**. Não utilizar automaticamente o mesmo padrão com dados privados ou segmentados por autorização.

### 12.5. Revalidação após mutação

- `updateTag`: adequado para expiração imediata da tag e leitura atualizada após escrita; disponível **somente em Server Actions**.
- `revalidateTag(tag, 'max')`: adequado quando o sistema admite atualização posterior no padrão *stale-while-revalidate*; aplicável a contextos suportados como Server Actions e Route Handlers.
- `revalidatePath`: usar quando o escopo de atualização é melhor descrito por uma rota.
- `cache()` do React para memoização durante renderização **não é** a mesma coisa que cache compartilhado e persistente.

### 12.6. Projetos legados sem Cache Components

Se a aplicação ainda utilizar o modelo anterior, documentar explicitamente a configuração de `fetch`, route segment config, `force-cache`, `revalidate` e regras correspondentes. **Não misturar** automaticamente `dynamic`, `revalidate`, `fetchCache` ou `unstable_cache` do modelo anterior com as diretrizes de Cache Components.

### 12.7. Segmentos dinâmicos pré-gerados

Usar `generateStaticParams()` quando fizer sentido pré-gerar determinadas combinações de segmentos dinâmicos (por exemplo, produtos/categorias de maior tráfego). **No modelo Cache Components, a função deve retornar pelo menos um conjunto de parâmetros**; retornar `[]`, como em alguns exemplos do modelo anterior, gera erro de build. A lista de parâmetros não substitui a política de cache dos dados nem o tratamento de recursos inexistentes.

**Referência:** [`generateStaticParams` — seção With Cache Components](https://nextjs.org/docs/app/api-reference/functions/generate-static-params).

### 12.8. Lazy loading

Utilizar `next/dynamic` quando um modal/editor/gráfico pesado não faz parte da primeira interação. Não adicionar lazy loading a componentes baratos sem evidência de benefício; verificar com análise de bundle e experiência real.

**Referências oficiais:** [Cache Components e Partial Prefetching](https://nextjs.org/docs/app/getting-started/caching) · [`use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache) · [revalidação](https://nextjs.org/docs/app/getting-started/revalidating) · [migração do cache anterior](https://nextjs.org/docs/app/guides/migrating-to-cache-components) · [caching — modelo anterior](https://nextjs.org/docs/app/guides/caching-without-cache-components) · [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag).

---

## 13. SEO: HTML semântico e metadados

### 13.1. HTML semântico

Utilizar `nav`, `main`, `aside`, `section`, `header`, listas e títulos em hierarquia coerente, de acordo com a função real do conteúdo. Evitar tratar a semântica como um conjunto de tags para satisfazer auditoria: a estrutura deve fazer sentido para pessoas e tecnologias assistivas.

### 13.2. Metadados globais

Utilizar `metadata` exportado de Server Components (layout/page), incluindo valores globais e padrões de título/descrição compartilhados. Para URLs absolutas em metadados, considerar `metadataBase`. Não definir a mesma URL canônica global para **todas** as páginas por herança indevida.

Campos conforme a finalidade: `title`, `description`, `openGraph`, `twitter`, `alternates`, `robots` e `keywords` quando justificado; não exigir todos em todas as rotas.

### 13.3. Metadados específicos

Páginas indexáveis com conteúdo próprio devem produzir título, descrição, URL canônica e prévia de compartilhamento específicos quando pertinentes.

### 13.4. Open Graph e Twitter

Definir imagem/título/descrição que representem o conteúdo. Reutilizar imagem institucional como fallback, não como substituição indiscriminada de imagens de produtos/conteúdos específicos.

### 13.5. Canonical

A URL canônica deve representar o conteúdo efetivo da página, inclusive slug e parâmetros significativos. A decisão sobre paginação, filtros e variantes indexáveis deve ser explícita.

### 13.6. PWA

Manifesto, ícones e metadados de instalação são **condicionais** a um projeto com finalidade de PWA; não fazem parte do mínimo exigido para toda aplicação.

**Referências:** [Metadata e imagens OG](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) · [referência de `generateMetadata` e `metadataBase`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

---

## 14. SEO em rotas dinâmicas e parâmetros assíncronos

Para `/products/[slug]`, utilizar `generateMetadata` quando o conteúdo determina título, descrição e compartilhamento.

**Obrigatório para a versão de referência:** observar o contrato assíncrono de `params`, `searchParams` e APIs de requisição relacionadas. Preferir os helpers gerados de rota (`PageProps`, `LayoutProps`, `RouteContext`) quando aplicáveis.

```tsx
// app/(public)/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicProduct } from '@/data-access/products';

// Neste exemplo público, getPublicProduct utiliza uma política de cache
// compatível com Cache Components. Se a consulta for dinâmica e não
// cacheável, estruturar os limites de Suspense e os metadados conforme a
// documentação de Cache Components, em vez de bloquear o shell estático.

export async function generateMetadata(
  { params }: PageProps<'/products/[slug]'>
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) notFound();

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function Page({ params }: PageProps<'/products/[slug]'>) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) notFound();

  return <main><h1>{product.name}</h1></main>;
}
```

A configuração de `metadataBase` em layout deve permitir resolver caminhos relativos corretamente. Quando um item não existe, não simplesmente retornar metadados genéricos e continuar a servir uma página de produto aparentemente válida; tratar o recurso inexistente com a semântica adequada (`notFound()`).

Se `generateMetadata` e a página buscarem o mesmo registro, considerar memoização apropriada **por renderização**, sem eliminar as verificações de acesso ou transformar dados privados em cache global. **Com Cache Components**, uma leitura assíncrona não cacheada pode exigir um limite de `Suspense` e tratamento específico de metadata; o exemplo pressupõe um produto público que pode ser cacheado.

**Referências:** [Metadata dinâmica](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) · [helpers tipados do App Router](https://nextjs.org/docs/app/api-reference/config/typescript) · [função `notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found).

---

## 15. Robots, Sitemap e indexação

### 15.1. `app/robots.ts`

Gerar regras de rastreamento e o endereço do sitemap. Diretivas para `/api` e `/dashboard` são possíveis conforme necessidade, mas **não substituem autenticação, autorização ou cabeçalhos**.

### 15.2. `app/sitemap.ts`

Incluir URLs relevantes e acessíveis publicamente. `lastModified`, `changeFrequency` e `priority` podem ser fornecidos quando possuem significado para o conteúdo; não inventar prioridade ou frequência só para preencher campos. Para catálogos grandes, avaliar divisão ou geração dinâmica por segmentos.

### 15.3. Metadata `robots`

Usar `robots` por página quando uma rota não deve ser indexada. Rotas privadas não devem ser expostas no sitemap. A estratégia de indexação deve refletir o conteúdo efetivo e a política do produto.

**Referências:** [`robots` file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) · [`sitemap` file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) · [Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

---

## 16. Dados estruturados (JSON-LD)

### 16.1. Catálogo

Para listagem de produtos, `ItemList` pode descrever nome, URL e elementos da lista, com posições coerentes com o conteúdo visível.

### 16.2. Detalhe

Em produto específico, `Product` pode descrever nome, descrição, oferta, preço, moeda e avaliações **quando existirem de verdade**. Não inserir informações estruturadas inexistentes ou inconsistentes com o conteúdo apresentado.

### 16.3. Inserção segura

A documentação oficial recomenda renderizar JSON-LD em `<script type="application/ld+json">`; `JSON.stringify()` **sozinho não protege contra injeção** dentro de script HTML. Para campos externos, usar serialização segura para esse contexto. Exemplo documentado: neutralizar `<` com `\u003c`.

```tsx
export function ProductStructuredData({ name }: { name: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  );
}
```

Esse trecho trata **apenas** a serialização para script JSON-LD e não constitui sanitizador HTML genérico. Dados da origem continuam sujeitos a validação.

**Referência:** [JSON-LD no Next.js](https://nextjs.org/docs/app/guides/json-ld).

---

## 17. Proteções de aplicação, cabeçalhos e monitoramento de segurança

### 17.1. Content Security Policy

**Condicional segundo exposição e risco:** definir CSP e demais cabeçalhos, considerando scripts externos, estilos, fontes, imagens e o impacto no modelo de renderização/cache. Políticas baseadas em nonce dependem de características da requisição e podem afetar pré-renderização; não copiar políticas incompatíveis com a arquitetura.

### 17.2. Rate limiting e proteção contra abuso

Aplicar nos pontos sujeitos a abuso (login, recuperação de senha, formulários públicos, endpoints de alto custo). Escolher política por rota e origem apropriada; evitar limites globais arbitrários. Em múltiplas instâncias, garantir consistência da contagem quando necessário.

### 17.3. Monitoramento de defesa

Monitorar bloqueios e falsos positivos de soluções como Arcjet, se utilizadas. Separar métricas da defesa de métricas de negócio, falhas e latência da aplicação.

### 17.4. Auditoria

Auditorias externas, testes de intrusão e revisões especiais são condicionais ao risco e ao orçamento. Nenhuma ferramenta isolada substitui autenticação/autorização, tratamento correto de dados e testes.

**Referências:** [guia de CSP](https://nextjs.org/docs/app/guides/content-security-policy) · [self-hosting e reverse proxy](https://nextjs.org/docs/app/guides/self-hosting).

---

## 18. Checklist de entrega e publicação

### Arquitetura e versionamento

- [ ] Next.js/React/TypeScript/Node.js e gerenciador de pacotes possuem versões compatíveis e registradas.
- [ ] App Router, convenções de rotas e fronteiras Server/Client estão coerentes.
- [ ] `proxy.ts`, se houver, usa matcher intencional e não substitui autorização.
- [ ] APIs assíncronas (`params`, `searchParams`, `cookies`, `headers`) seguem a versão adotada.
- [ ] Build não depende de convenções removidas (`next lint`, `middleware.ts` como referência nova etc.).

### Autenticação, autorização e dados

- [ ] A sessão é validada no servidor antes de acessar recursos protegidos.
- [ ] Existe autorização por operação e recurso/tenant, inclusive para mutações e exclusões.
- [ ] DAL/serviços mantêm o escopo de dados autorizado e os DTOs minimizam a saída.
- [ ] Server Functions e Route Handlers validam entrada e autorização independente da interface.
- [ ] Webhooks validam autenticidade e suportam retries sem efeitos duplicados.
- [ ] SQL utiliza parâmetros/ORM seguro e HTML externo recebe tratamento contextual.
- [ ] Segredos e PII não estão em bundle, logs ou payloads indevidos.

### Renderização, cache e SEO

- [ ] Modelo de cache atual ou legado está explicitamente definido, sem regras conflitantes.
- [ ] Conteúdo privado não é exposto por cache compartilhado ou chave insuficiente.
- [ ] Existe estratégia de invalidação após mutações que exigem consistência.
- [ ] `Suspense`/`loading.tsx` são usados nos pontos de espera relevantes.
- [ ] Recursos inexistentes usam `notFound()`/resposta adequada.
- [ ] Rotas indexáveis possuem metadata/canonical corretas; privadas não são publicadas no sitemap.
- [ ] JSON-LD é coerente com conteúdo real e serializado com segurança.
- [ ] Imagens e fontes cumprem otimização sem prejudicar LCP/CLS.

### Qualidade e operação

- [ ] Typecheck, lint, testes exigidos e build passam em CI.
- [ ] E2E cobre fluxos críticos e negativas de permissão.
- [ ] Core Web Vitals e bundle são avaliados nas alterações relevantes.
- [ ] Erros e logs possuem rastreabilidade sem vazar dados.
- [ ] Dependências, vulnerabilidades e licenças foram revisadas.
- [ ] Ambientes, configuração e infraestrutura foram validados; se distribuído, cache, chave de Actions e versões de deploy estão coordenados.

---

## 19. Limites explícitos da especificação

Este documento estabelece diretrizes aplicáveis à stack, sem inventar detalhes que dependem do negócio ou da infraestrutura:

- Não obriga um fornecedor de autenticação, banco, ORM ou WAF.
- Não descreve o fluxo criptográfico completo de JWT; exige que a sessão seja verificada de forma efetiva.
- Não define RBAC/ABAC universal, mas exige controle consistente por operação e recurso.
- Não fixa números universais para TTL, rate limiting, latência, cobertura percentual de testes ou configuração CSP.
- Não exige ferramentas experimentais ou tratamento de problemas inexistentes no projeto.
- Não assume monorepo, microfrontend, implantação Edge ou Kubernetes como padrões universais.
- Não confunde SEO/robots, layouts ou ocultação no cliente com segurança.
- Não transforma o modelo legado de cache do App Router em norma para novos projetos Next.js 16.4+.

---

## 20. TypeScript: convenções de tipagem e legibilidade

**Obrigatório:** usar `strict: true` em `tsconfig.json` para projetos novos e executar typecheck na validação contínua. A disciplina aqui é preservar **contratos verificáveis**, não exigir anotações redundantes.

### Regras

1. Não utilizar `any` para escapar de tipagem em fronteiras importantes; exceções exigem justificativa e escopo limitado.
2. Preferir `unknown` para dados de origem externa antes da validação.
3. Utilizar tipos explícitos em contratos públicos, parâmetros não triviais e retornos cuja estabilidade seja relevante para consumidores.
4. Não forçar tipagem em todas as variáveis locais quando a inferência já é clara e segura.
5. Não usar `as Tipo` para simular validação de respostas externas; `as` é uma afirmação ao compilador, não valida dado em tempo de execução.
6. Preferir unions discriminadas para representar estados finitos de fluxos assíncronos ou de domínio.
7. Usar `PageProps<'/rota'>`, `LayoutProps<'/rota'>` e `RouteContext<'/rota'>` para contratos de rotas quando viável.
8. Habilitar `typedRoutes` para detecção de links inválidos em TypeScript.

**Antes — tipo presumido, sem validação:**

```ts
const response = await fetch(url);
const user = (await response.json()) as User;
```

**Depois — tipo de entrada desconhecido e contrato verificado:**

```ts
const response = await fetch(url);
if (!response.ok) throw new Error('Falha ao buscar usuário');

const payload: unknown = await response.json();
const user = userSchema.parse(payload);
```

`userSchema` é um validador de esquema do projeto, como Zod. **Não** tomar o exemplo como obrigação de validar todos os objetos internos com a mesma biblioteca.

**Referências:** [TypeScript no Next.js](https://nextjs.org/docs/app/api-reference/config/typescript) · [typedRoutes](https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes) · [tipos de segmentos dinâmicos](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes).

---

## 21. Server Functions, Server Actions e Route Handlers

### 21.1. Separação de responsabilidade

| Mecanismo | Preferência |
| --- | --- |
| Server Component | Consultar e renderizar dados da aplicação |
| DAL/serviço de domínio | Garantir autorização, leitura/mutação e regra de negócio |
| Server Function / Server Action | Mutação disparada pela interface, formulários e transições relevantes |
| Route Handler (`route.ts`) | Contrato HTTP explícito, integrações, Webhooks e consumidores externos |
| Client Component | Interação, estado local, feedback e recursos do navegador |

**Obrigatório:** evitar usar Server Actions como substituto padrão para consultas. Elas são voltadas ao processamento de mutações e possuem semântica de requisição/execução própria.

### 21.2. Contrato de mutação

1. Receber dados não confiáveis.
2. Validar esquema, tamanho e valores.
3. Resolver sessão e autorizar a operação e o recurso.
4. Executar mutação por serviço/DAL; usar transação quando preciso.
5. Retornar resultado tipado ou erro esperado tratado de modo consistente.
6. Revalidar cache/rota pertinente, se houver cache.
7. Exibir estado pendente, sucesso e falha no cliente; evitar duplo envio quando afeta o negócio.

### 21.3. Exemplo mínimo

```ts
// src/actions/tickets.ts
'use server';

import { revalidatePath } from 'next/cache';
import { updateMyTicket } from '@/data-access/tickets';
import { ticketInputSchema } from '@/lib/validations/ticket';

export async function changeTicket(formData: FormData) {
  const parsed = ticketInputSchema.safeParse({
    id: formData.get('id'),
    question: formData.get('question'),
  });

  if (!parsed.success) {
    return { ok: false as const, reason: 'invalid-input' as const };
  }

  // O serviço valida sessão/autorização sobre esse ticket.
  await updateMyTicket(parsed.data);
  revalidatePath('/dashboard');

  return { ok: true as const };
}
```

O exemplo ilustra **contrato**, não uma implementação pronta: autenticação, autorização e persistência dependem da implementação do serviço. Para dados cacheados por tags, preferir invalidação específica quando aplicável.

### 21.4. Considerações de segurança e contrato HTTP

- Server Functions podem ser chamadas por requisições **diretas**, não apenas pelo formulário apresentado. Não confiar na visibilidade de um botão.
- Route Handlers devem retornar códigos coerentes (`400`, `401`, `403`, `404`, `409`, `500` etc.) conforme a semântica da operação.
- Tratar `Origin`/CSRF e restrições de origem conforme os mecanismos do Next.js e a topologia de Proxy; não permitir origens indiscriminadamente.
- Não transformar a Action em um endpoint REST público sem necessidade: quando houver consumidores externos, preferir `route.ts` com um contrato HTTP explícito.

**Referências:** [mutações e Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) · [formulários](https://nextjs.org/docs/app/guides/forms) · [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) · [autorização](https://nextjs.org/docs/app/guides/authentication).

---

## 22. Erros, estados vazios, loading e streaming

- **Erro esperado** (validação, conflito, recurso indisponível de forma prevista): representar como retorno/estado de interface ou resposta HTTP coerente, sem transformar sempre em exceção inesperada.
- **Erro inesperado**: registrar com contexto técnico e deixar que `error.tsx` ou `global-error.tsx` forneça fallback de falha conforme o segmento.
- **Recurso não encontrado**: utilizar `notFound()` ou HTTP 404 real, não apenas texto de erro numa página 200.
- **Carregamento:** `loading.tsx` define fallback de um segmento; `Suspense` serve para subárvores que podem evoluir independentemente.
- **Estado vazio:** diferencia consulta sem resultados de falha de consulta, sem esconder erro real como lista vazia.
- **Estado pendente de mutação:** considerar `useActionState`/`useFormStatus` para impedir múltiplos envios indevidos e esclarecer o resultado.

`error.tsx` é Client Component; deve fornecer recuperação apropriada (ex.: `reset`) sem expor stack traces ou segredos ao usuário final.

**Referências:** [tratamento de erros](https://nextjs.org/docs/app/getting-started/error-handling) · [error.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/error) · [loading/streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading).

---

## 23. Estratégia de testes

**Obrigatório:** adotar testes conforme risco, com automação proporcional à criticidade. Não exigir percentual arbitrário de cobertura ou testes redundantes só para aumentar contagem.

| Nível | Ferramentas exemplificativas | Foco mínimo |
| --- | --- | --- |
| Unitário | Vitest | Validações, regras determinísticas, transformações, helpers |
| Componente | React Testing Library + Vitest | Estado, interação e acessibilidade essencial de componentes clientes |
| Integração | Vitest e ambiente controlado | DAL, políticas de autorização, mutações e persistência |
| E2E | Playwright | Login, navegação, formulário, recurso ausente e caminhos críticos |
| Regressão de segurança | Integração + E2E | Usuário não autenticado, não autorizado e isolamento entre contas/tenants |

**Diretrizes:**

- Testar os comportamentos observáveis, não detalhes privados de implementação.
- Não depender de produção ou de dados reais nos ambientes de teste.
- Preferir fixtures determinísticas e limpeza de estado entre testes.
- Para **Server Components assíncronos**, seguir a recomendação oficial de favorecer E2E, pois o suporte de ferramentas unitárias é limitado.
- Incluir cenários negativos de autenticação/escopo; testes apenas do fluxo feliz não dão confiança à DAL.
- E2E crítico deve executar contra build/ambiente compatível com produção quando viável, e não apenas em modo de desenvolvimento.

**Referências:** [estratégia de testes](https://nextjs.org/docs/app/guides/testing) · [Vitest](https://nextjs.org/docs/app/guides/testing/vitest) · [Playwright e CI](https://nextjs.org/docs/app/guides/testing/playwright).

---

## 24. ESLint, DX e critérios de revisão de código

### 24.1. Ferramentas e gates

**Obrigatório para Next.js 16+:** invocar lint por ferramenta própria (`eslint` ou alternativa institucional), pois `next lint` foi removido e `next build` não executa lint automaticamente. Verificar TypeScript separadamente.

Scripts de referência (gerenciador de pacotes indiferente):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

Os scripts de teste são exemplos: somente incluir pacotes realmente adotados e configurados.

### 24.2. Regras de lint com ganho real

- Impedir imports incompatíveis com a fronteira servidor/cliente.
- Aplicar regras oficiais do Next.js e React pertinentes ao projeto.
- Evitar `any` injustificado, imports sem uso, promessas ignoradas em operações críticas e supressões indiscriminadas de avisos.
- Aplicar verificações customizadas somente quando um padrão incorreto e recorrente justificar seu custo de manutenção.
- Não criar regras de lint para impor preferências de estilo sem efeito na compreensão ou segurança do sistema.

### 24.3. Critérios de code review

Toda alteração relevante deve responder: **(a)** onde executa (servidor/cliente), **(b)** quem pode acessar, **(c)** como valida dados, **(d)** se utiliza cache e como invalida, **(e)** como falha e **(f)** qual teste comprova o comportamento. Revisar impacto no bundle e nas rotas quando a mudança afetar carregamento.

**Referências:** [instalação/scripts de lint](https://nextjs.org/docs/app/getting-started/installation) · [upgrade 16](https://nextjs.org/docs/app/guides/upgrading/version-16) · [ESLint](https://nextjs.org/docs/app/api-reference/config/eslint).

---

## 25. CI/CD, ambientes e implantação

### 25.1. Pipeline mínimo de qualidade

1. Obter código e instalar com lockfile de maneira reproduzível.
2. Executar lint.
3. Executar typecheck.
4. Executar testes unitários e de integração pertinentes.
5. Executar `next build` no ambiente-alvo.
6. Executar E2E dos fluxos prioritários em pipeline/ambiente apropriado.
7. Publicar artefato imutável e validar sua inicialização/saúde antes de liberar tráfego.

O encadeamento pode usar paralelismo; a exigência é que **falhas críticas bloqueiem promoção**, não que todas as etapas executem em série.

### 25.2. Separação de ambientes

- Definir desenvolvimento, homologação e produção com configuração e segredos próprios.
- Evitar valores de ambiente público embutidos de modo incompatível com a política de promoção do artefato; validar o momento em que `NEXT_PUBLIC_` é incorporado ao build.
- Testar integrações e autenticação em topologia semelhante à produção sempre que a diferença puder afetar comportamento.

### 25.3. Deploy e modos suportados

- Node server, container e provedores com suporte adequado podem executar recursos dinâmicos.
- **Static export** não substitui servidor quando são necessários Server Actions, Proxy, SSR dinâmico ou ISR.
- Validar compatibilidade do adaptador/plataforma antes de depender de recursos específicos do Next.js.

### 25.4. Deploy em múltiplas instâncias (condicional)

Quando usar múltiplos pods/servidores, avaliar explicitamente:

- Compartilhamento e invalidação coordenada de cache; cache local por instância pode gerar leituras divergentes.
- Chave de criptografia consistente para Server Functions entre instâncias da mesma versão/build.
- `deploymentId`/proteção contra **version skew** durante rolling deployment.
- Consistência do build e de recursos estáticos; evitar construir o mesmo release de maneiras diferentes por instância.
- Comportamento de CDN/reverse proxy e cabeçalhos de cache para HTML dinâmico.

Não presumir que o Next.js coordena sozinho caches e chaves em múltiplos pods.

**Referências:** [deploy](https://nextjs.org/docs/app/getting-started/deploying) · [self-hosting](https://nextjs.org/docs/app/guides/self-hosting) · [static export](https://nextjs.org/docs/app/guides/static-exports) · [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId).

---

## 26. Auditoria de desempenho e Core Web Vitals

**Obrigatório:** utilizar critérios mensuráveis em alterações com impacto potencial de carregamento/navegação, em vez de confiar apenas na presença de `next/image`, lazy loading ou cache.

| Métrica | O que representa | Referência operacional inicial |
| --- | --- | --- |
| LCP | Carregamento do maior conteúdo principal visível | ≤ 2,5 s |
| INP | Capacidade de resposta às interações | ≤ 200 ms |
| CLS | Estabilidade visual | ≤ 0,1 |

As referências são metas gerais de Core Web Vitals, **não garantias** derivadas do Next.js. Medir o percentil 75 quando houver amostra real suficiente; os limiares vêm do padrão de Web Vitals, e devem ser revisados junto às necessidades de produto.

- Usar Lighthouse/laboratório para reproduzir e diagnosticar regressões, sem tratar score 100 como requisito universal.
- Coletar métricas reais quando a aplicação tiver tráfego suficiente, usando soluções compatíveis com `useReportWebVitals`.
- Inspecionar bundle JS, hidratação, imagens LCP, fontes, third-party scripts, prefetch e waterfalls de dados em mudanças relevantes.
- Priorizar a redução de JS cliente e chamadas duplicadas antes de introduzir otimizações complexas.
- Documentar baseline e regressões quando uma mudança piorar significativamente indicadores observados.

**Referências:** [`useReportWebVitals`](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals) · [otimização de imagens](https://nextjs.org/docs/app/getting-started/images) · [prefetch](https://nextjs.org/docs/app/guides/prefetching) · [instrumentação do cliente](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client).

---

## 27. Observabilidade da aplicação

**Obrigatório para serviços em produção:** diagnosticar falhas sem depender somente do painel de segurança externa.

- Registrar exceções inesperadas com correlação de requisição/operação, rota, versão de deploy e informações não sensíveis necessárias ao diagnóstico.
- Observar latência de renderização e acessos externos críticos; diferenciar erro de negócio de falha técnica.
- Considerar `instrumentation.ts` para configuração/integração de telemetria no servidor e `instrumentation-client.ts` para monitoramento pré-hidratação e transições relevantes.
- Utilizar OpenTelemetry ou solução equivalente quando o sistema/distribuição justificar tracing e métricas.
- Remover ou mascarar segredos, tokens, PII e payloads indevidos.
- Definir alerta para falha significativa, e não simplesmente coletar logs sem responsáveis ou critério de ação.

**Referências:** [instrumentation do servidor](https://nextjs.org/docs/app/guides/instrumentation) · [instrumentation-client](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client) · [error handling](https://nextjs.org/docs/app/getting-started/error-handling).

---

## 28. Monorepo e Turborepo (condicional)

**Não obrigatório em toda aplicação.** Adotar monorepo/Turborepo quando houver múltiplas aplicações/pacotes com compartilhamento real e governança coordenada.

Se adotado:

- Explicitar dependências entre `apps/` e `packages/`; prevenir ciclos e importações entre camadas sem contrato.
- Centralizar versões compatíveis do Next.js/React/TypeScript, evitando múltiplas cópias inconsistentes de React e problemas de resolução.
- Configurar tarefas (`lint`, `typecheck`, `test`, `build`) e suas dependências/caching na ferramenta de orquestração.
- Revisar entradas e saídas de cache de build e **variáveis de ambiente que afetam o resultado**, para não reutilizar artefatos indevidamente.
- Utilizar `transpilePackages` quando necessário para compartilhar código local que precise ser transpilado pelo Next.js.
- Não compartilhar módulos marcados `server-only` com pacotes destinados ao cliente.

A escolha por Turborepo é **arquitetural/institucional**, não uma exigência da documentação do Next.js.

**Referências:** [transpilePackages](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages) · [estrutura de projeto](https://nextjs.org/docs/app/getting-started/project-structure) · [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack).

---

## 29. Critérios técnicos de contratação e curadoria de pull requests

Esta seção é uma **política de avaliação**, não uma funcionalidade nativa do Next.js.

A avaliação técnica deve preferir problemas que revelem raciocínio e domínio das fronteiras do framework, em lugar de memorização de APIs:

| Competência | Evidência verificável |
| --- | --- |
| App Router | Rotas dinâmicas, layouts, não encontrados e erros adequados |
| Server / Client | Interatividade isolada sem transformar a página inteira em cliente |
| Segurança | DAL com autorização por operação/recurso; sessão não substitui permissão |
| Mutações | Action com validação, estados de formulário e consistência após escrita |
| Cache | Escolha explícita de frescor, escopo e invalidação |
| TypeScript | Contratos seguros, validação de entrada e ausência de casts enganadores |
| Testes | Caso feliz e negativos relevantes em unit/integração/E2E |
| Qualidade | Typecheck, lint, build e justificativa clara das decisões |

**Critérios de reprovação objetiva:** vazamento de dados privados por falta de escopo; credenciais no cliente; mutação sem autorização; dependência de validação apenas no front-end; SQL concatenado com entrada externa; fraude de tipos em fronteiras de dados; cache privado compartilhado indevidamente.

Não reprovar por escolha de nomes ou estilos alternativos quando o contrato técnico e a legibilidade estiverem preservados.

---

## 30. Node.js versus Edge Runtime

**Padrão recomendado pela documentação oficial:** utilizar **Node.js Runtime** para renderização. Escolher Edge apenas quando houver motivo técnico e compatibilidade real de bibliotecas e serviços.

- `proxy.ts` no Next.js 16 utiliza Node.js e não aceita configuração `runtime: 'edge'`.
- Em `page.tsx`, `layout.tsx` e `route.ts`, a opção de segmento `runtime` permite escolher Node.js ou Edge **nos cenários suportados**.
- **Cache Components não oferece suporte a `runtime: 'edge'`.** Portanto, não selecionar Edge para rotas que dependam do modelo Cache Components.
- Recursos limitados do Edge Runtime devem ser verificados antes de adotar bibliotecas que dependam de APIs específicas do Node.js.
- Não utilizar Edge como sinônimo automático de melhor desempenho; proximidade de execução, acesso a banco, latência e estratégia de cache determinam o resultado real.

**Referências:** [Route Segment Config — runtime](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) · [Proxy runtime](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) · [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge).

---

## 31. Governança da fonte de verdade e exceções

1. Para **questionar ou substituir regra existente do Next.js**, citar **obrigatoriamente** uma seção específica de <https://nextjs.org/docs> e indicar a versão relevante. Não elevar preferência de implementação à condição de requisito oficial.
2. Para novas diretrizes arquiteturais **institucionais**, declarar o problema prevenido e quando se aplicam.
3. Priorizar mudanças por impacto efetivo: **P0** segurança/correção de comportamento; **P1** consistência, manutenção ou desempenho material; **P2** melhoria contextual/optativa.
4. Mudanças de versão devem revisar obrigatoriamente: convenções de arquivos, caching/renderização, Server Functions, TypeScript e comandos de CI.
5. Exceções a regras obrigatórias devem registrar motivação, escopo, riscos e critério de revisão.
6. Não ampliar esta especificação com assuntos irrelevantes à stack ou com listas de ferramentas sem critério de adoção.

### Quadro de decisões finais

| Decisão | Classificação |
| --- | --- |
| App Router, TypeScript, Server Components por padrão | Obrigatório |
| DAL e autorização de recursos / mínimo de dados enviados | Obrigatório |
| `proxy.ts` em vez de `middleware.ts` para novos projetos Next.js 16 | Convenção atual; uso do Proxy é condicional |
| Cache Components em novos projetos 16.4+ | Preferencial conforme documentação vigente |
| Tailwind CSS | Padrão institucional |
| Vitest / React Testing Library / Playwright | Stack de testes recomendada; ferramentas equivalentes são possíveis |
| Turborepo | Condicional a monorepo |
| Arcjet, Taint API, ferramentas experimentais | Opcionais/condicionais |
| ESLint, typecheck, testes pertinentes e build no CI | Obrigatório |
| SEO/JSON-LD/PWA | Condicional à finalidade das páginas e produto |

---

## Apêndice A — Principais mudanças em relação ao documento original

| Origem | Curadoria aplicada | Fundamentação oficial |
| --- | --- | --- |
| § 2 e § 5 (`middleware.ts`) | Convenção atualizada para `proxy.ts`; uso condicional e sem autorização definitiva | [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) |
| § 4–6 (cookie/sessão) | Diferenciar cookie, sessão válida e autorização por recurso | [Authentication](https://nextjs.org/docs/app/guides/authentication) |
| § 6 (DAL) | Exigir autorização por operação e escopo, não apenas login | [Authentication / DAL](https://nextjs.org/docs/app/guides/authentication) |
| § 3 (Server/Client) | Tornar explícita a fronteira do grafo cliente e a serialização | [Server/Client](https://nextjs.org/docs/app/getting-started/server-and-client-components) |
| § 7/14 (`params` e `searchParams`) | Exigir contrato assíncrono e helpers de rota | [TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript) |
| § 12 (caches antigos) | Diferenciar modelo legado de Cache Components e PPR | [Cache Components](https://nextjs.org/docs/app/getting-started/caching) · [modelo anterior](https://nextjs.org/docs/app/guides/caching-without-cache-components) |
| § 14 (produto ausente) | `notFound()` no lugar de continuar com página de produto inexistente | [notFound](https://nextjs.org/docs/app/api-reference/functions/not-found) |
| § 16 (JSON-LD) | Documentar escape seguro do payload em script | [JSON-LD](https://nextjs.org/docs/app/guides/json-ld) |
| § 9/18 (qualidade) | Acrescentar lint explícito, typecheck, testes e build | [upgrade 16](https://nextjs.org/docs/app/guides/upgrading/version-16) · [testing](https://nextjs.org/docs/app/guides/testing) |
| Novas §§ 20–30 | Completar TypeScript, mutações, erros, testes, CI/CD, performance, observabilidade, runtimes e critérios de curadoria | Links oficiais nas próprias seções |

---

## Apêndice B — Índice das fontes oficiais primárias

- [App Router — Getting Started](https://nextjs.org/docs/app/getting-started)
- [Next.js — Installation](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js — Upgrading](https://nextjs.org/docs/app/getting-started/upgrading)
- [Next.js — Version 16 Upgrade](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js — Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js — Authentication / DAL / Authorization](https://nextjs.org/docs/app/guides/authentication)
- [Next.js — Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Next.js — Cache Components](https://nextjs.org/docs/app/getting-started/caching)
- [Next.js — Revalidating](https://nextjs.org/docs/app/getting-started/revalidating)
- [Next.js — Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data)
- [Next.js — Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Next.js — Testing](https://nextjs.org/docs/app/guides/testing)
- [Next.js — Self-Hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [Next.js — TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript)
- [Next.js — Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

---

## Sinais de bom uso e de uso ruim

### Sinais de bom uso

- Server Components são utilizados por padrão; Client Components são introduzidos somente quando necessários.
- A estrutura de rotas e componentes facilita a localização das responsabilidades sem criar abstrações desnecessárias.
- TypeScript mantém contratos claros, com tipagem segura e validação dos dados externos.
- Server Actions, Route Handlers e DAL possuem responsabilidades bem definidas, com autenticação e autorização efetivas.
- As estratégias de renderização, cache e invalidação são escolhidas conforme a natureza e a necessidade de atualização dos dados.
- Os recursos nativos do Next.js são priorizados antes da introdução de dependências externas.
- Testes automatizados protegem os fluxos críticos; lint, tipagem e build são verificados no CI.
- Erros são tratados adequadamente, e logs, métricas e rastreamento permitem diagnosticar problemas reais.
- Desempenho e Core Web Vitals são monitorados e otimizados com base em evidências.
- A arquitetura evolui conforme a complexidade do sistema, sem comprometer simplicidade, segurança ou manutenção.

### Sinais de uso ruim

- Utilizar `"use client"` indiscriminadamente, transferindo responsabilidades do servidor para o navegador sem necessidade.
- Concentrar regras de negócio, acesso a dados, autenticação e apresentação em um mesmo componente.
- Utilizar `any`, type assertions ou contratos genéricos para contornar problemas de tipagem.
- Confiar apenas em cookies, redirecionamentos ou verificações visuais para proteger operações e dados.
- Utilizar Server Actions sem validação, autorização ou tratamento adequado de erros.
- Configurar cache indiscriminadamente, expondo dados privados ou apresentando informações desatualizadas.
- Realizar consultas redundantes ou transferir dados e JavaScript desnecessários ao cliente.
- Criar abstrações, hooks, providers ou dependências antes de existir uma necessidade concreta.
- Tratar erros genericamente, ocultando falhas ou dificultando diagnósticos.
- Publicar alterações sem testes pertinentes, verificação de tipos, lint ou build de produção.
- Aplicar otimizações sem medições ou seguir padrões depreciados sem considerar a versão do framework.
- Transformar preferências pessoais em regras obrigatórias sem demonstrar ganho técnico relevante.

---

## Regra final

Este guia existe para orientar o uso consistente da stack Next.js, não para impor burocracia, abstrações desnecessárias ou complexidade artificial.

> Construir aplicações Next.js claras, seguras, tipadas, testáveis, observáveis, performáticas e sustentáveis, utilizando corretamente os recursos do framework e respeitando as necessidades reais do sistema.

A arquitetura deve servir ao problema. Aplicações simples devem permanecer simples; aplicações complexas devem possuir separação de responsabilidades e mecanismos proporcionais às suas necessidades.

**Regra operacional final:** cada rota, componente, consulta e mutação deve explicitar onde executa, quem pode acessá-la, que dados recebe ou expõe, se admite cache, como invalida e como falha. A implementação deve demonstrar essas garantias em verificações automatizadas proporcionais ao risco.

**Regras de comportamento para o agente de IA e para a curadoria técnica:**

1. **Respeitar os padrões estabelecidos:** não substituir decisões arquiteturais existentes apenas por preferência de implementação.
2. **Fundamentar questionamentos:** toda contestação de uma regra existente relacionada ao Next.js deve ser sustentada exclusivamente pela documentação oficial em <https://nextjs.org/docs>.
3. **Priorizar versões atuais:** considerar preferencialmente a versão estável mais recente do Next.js, respeitando a compatibilidade da versão utilizada pelo projeto.
4. **Identificar lacunas relevantes:** priorizar problemas concretos de segurança, correção, arquitetura, legibilidade, desempenho, testabilidade e manutenção.
5. **Distinguir exigências de preferências:** não apresentar recomendações arquiteturais como obrigações oficiais do framework.
6. **Preservar a simplicidade:** não introduzir ferramentas, bibliotecas, camadas ou padrões sem necessidade técnica demonstrável.
7. **Respeitar o contexto do projeto:** considerar arquitetura existente, convenções, dependências e requisitos antes de recomendar alterações.
8. **Exigir justificativa proporcional:** quanto maior o impacto da mudança proposta, maior deve ser a evidência de seu benefício.
9. **Evitar mudanças cosméticas:** não questionar implementações tecnicamente corretas quando a alternativa não apresentar ganho significativo.
10. **Priorizar evolução sustentável:** recomendar soluções que resolvam o problema atual sem criar acoplamento ou complexidade desnecessária para o futuro.
