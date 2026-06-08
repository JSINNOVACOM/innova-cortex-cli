# innova-cortex

> Instala e versiona o harness **Innova Cortex** (`.cortex/`) no seu projeto, de maneira rápida e prática.

<!-- badges sugeridos (confirmar antes de publicar):-->
[![npm version](https://img.shields.io/npm/v/innova-cortex.svg)](https://www.npmjs.com/package/innova-cortex)
[![node](https://img.shields.io/node/v/innova-cortex.svg)](https://www.npmjs.com/package/innova-cortex)
[![license](https://img.shields.io/npm/l/innova-cortex.svg)](./LICENSE)


```bash
npx innova-cortex init
```

> ⚠️ **Não rode `npm install innova-cortex`.** Isto é uma CLI de scaffolding, não uma dependência — `npm install` só baixa o pacote para `node_modules/` e **não cria** o `.cortex/`. Use sempre **`npx innova-cortex init`** dentro do seu projeto.

---

## O que é o Innova Cortex

**Innova Cortex** é um harness leve que transforma o Claude (e assistentes de código similares) em um colaborador disciplinado: adiciona **governança** (regras, limites, quality gates), **memória** (contexto de projeto persistente entre sessões) e **fluxo** (workflows nomeados para novos projetos, features, refatorações, revisões e handoffs).

A governança vive numa pasta `.cortex/` dentro do seu projeto, referenciada por path relativo, o projeto viaja junto com o harness, versionável e compatível com CI/CD.

**Este pacote é o CLI** que instala e mantém esse `.cortex/` pra você. Ele não é o harness em si, é a ferramenta que coloca o harness no seu projeto.

---

## O que o CLI resolve

Antes, instalar o Innova Cortex era manual: clonar o repositório, copiar as pastas certas pra `.cortex/`, criar o `CLAUDE.md` a partir do template, montar `docs/` e `memory/`. Esse processo arrastava arquivos errados (`examples/`, `LICENSE`) e deixava projetos do mesmo dev em versões divergentes, sem ninguém perceber.

O `init` faz tudo isso por construção, e grava um arquivo `.cortex/VERSION` que torna a versão instalada **rastreável e auditável**.

---

## Uso

Sem instalar nada (recomendado):

```bash
npx innova-cortex init
```

Ou instale global:

```bash
npm i -g innova-cortex
innova-cortex init
```

### `init`

```bash
innova-cortex init [opções] [caminho]
```

Instala o `.cortex/` no diretório de destino (o atual, se `caminho` for omitido).

| Opção | Descrição | Default |
|---|---|---|
| `--ref <tag-ou-commit>` | Fixa numa release/commit (reprodutibilidade) | latest da branch principal |
| `--name <nome>` | Nome do projeto (preenche o `CLAUDE.md`) | placeholder com `<!-- TODO -->` |
| `--objective <texto>` | Objetivo do projeto em uma linha | placeholder com `<!-- TODO -->` |
| `caminho` | Diretório de destino | diretório atual |

**Exemplos:**

```bash
# instala no diretório atual, da origem oficial, na versão mais recente
npx innova-cortex init

# fixa numa release específica (reprodutível)
npx innova-cortex init --ref v0.3.0

# já preenche nome e objetivo no CLAUDE.md
npx innova-cortex init --name "meu-projeto" --objective "API de cobranças"

```

---

## O que o `init` cria

```text
meu-projeto/
├── .cortex/                  ← governança (regras, agentes, skills, templates, workflows)
│   ├── 01-regras/
│   ├── 02-agentes/
│   ├── 03-skills/
│   ├── 04-templates/
│   ├── 08-orquestracao/
│   ├── 10-padroes-tecnicos/
│   ├── Claude.md             ← arquivo central de orientação
│   └── VERSION               ← versão instalada (rastreabilidade)
├── CLAUDE.md                 ← ponte do projeto para ./.cortex/Claude.md
├── docs/
│   ├── context/
│   └── analysis/
└── memory/
```

Copia **só o núcleo** da governança — `examples/`, `LICENSE` e o README do harness ficam de fora por construção.

### `.cortex/VERSION`

Gravado ao final do `init`, em YAML, versionado no Git do seu projeto:

```yaml
source: <origem>
ref: v0.3.0
commit: b9bdd90
installed_at: 2026-06-06T10:23:00Z
cli_version: 0.2.1
```

É o que permite saber — e auditar — qual versão da governança está ativa em cada projeto.

---

## Garantias

- **Não sobrescreve `.cortex/` existente.** Se a pasta já existe, o `init` aborta e orienta — nunca destrói customização em silêncio.
- **Não toca trabalho preexistente.** `CLAUDE.md`, `docs/` e `memory/` já presentes são preservados; o `init` só cria o que falta.
- **Escrita atômica.** Falha de rede, permissão ou ref inválida aborta antes de tocar o destino; nada de `.cortex/` pela metade.
- **Sem placeholder inventado.** Sem `--name`/`--objective`, o `CLAUDE.md` mantém o placeholder visível com `<!-- TODO -->`.

---

## Requisitos

- **Node** `>= 20`
- **git** no `PATH` (o `init` clona a origem)
- Roda em **Windows, macOS e Linux**.

---

## Próximos passos (depois do `init`)

Abra o projeto no Claude e mande a primeira mensagem:

```text
Leia o CLAUDE.md local e use o fluxo Init Project para iniciar este projeto.
```
ou
```text
Quero iniciar um projeto
```
O assistente lê o `CLAUDE.md`, segue até `./.cortex/Claude.md` e passa a operar dentro do harness.

---

## Em breve

| Comando | O que faz |
|---|---|
| `doctor` | Diagnostica a instalação: compara a versão local com a origem e lista arquivos modificados localmente. |
| `update` | Atualiza o `.cortex/` preservando suas customizações (estratégia conservadora por default). |

---

## O que **não** é

- **Não é gerador de scaffold de aplicação.** Instala a governança, não cria o código do seu app.
- **Não é uma biblioteca de prompts.** O harness molda como o assistente *opera*.
- **Não é específico de framework.** O layout é opinativo; a stack é sua.

---
