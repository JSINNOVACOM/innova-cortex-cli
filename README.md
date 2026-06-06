# innova-cortex

CLI que instala e versiona o `.cortex/` (governança Innova Cortex) em projetos adopters — substituindo o fluxo manual `git clone + cp -r`.

## Instalação

Nenhuma instalação necessária. Use diretamente via `npx`:

```sh
npx innova-cortex <comando>
```

**Requisitos:** Node ≥ 20, git disponível no PATH.

---

## Comandos

### `init` — instala a governança

```sh
npx innova-cortex init [opções] [path]
```

Clona a origem, copia o núcleo da governança para `.cortex/`, grava o `VERSION` e cria a estrutura mínima do projeto.

**Opções:**

| Opção | Descrição | Default |
|---|---|---|
| `--from <url>` | URL git ou caminho local da origem | `https://github.com/JSINNOVACOM/innova-cortex` |
| `--ref <tag>` | Tag ou branch a instalar | branch default da origem |
| `--name <nome>` | Nome do projeto (substitui placeholder no `CLAUDE.md`) | placeholder visível |
| `--objective <texto>` | Objetivo do projeto (substitui placeholder no `CLAUDE.md`) | placeholder visível |
| `path` | Diretório de destino | diretório atual |

**Exemplo:**

```sh
npx innova-cortex init --name "meu-projeto" --objective "descrever objetivo" ./meu-projeto
```

**O que o `init` produz:**

- `.cortex/` — núcleo da governança instalado
- `.cortex/VERSION` — rastreabilidade: origem, ref, commit, data, versão do CLI
- `CLAUDE.md` — ponte entre o projeto e a governança (criado se não existir)
- `docs/context/`, `docs/analysis/`, `memory/` — estrutura mínima (criada se não existir)

---

## O que é instalado

<!-- GENERATED-START: install-manifest -->
**Diretórios copiados:**
  - `01-regras/`
  - `02-agentes/`
  - `03-skills/`
  - `04-templates/`
  - `08-orquestracao/`
  - `10-padroes-tecnicos/`

**Arquivos avulsos da raiz:**
  - `Claude.md`

**Nunca copiados:**
  - `examples/`
  - `LICENSE`
  - `README.md`
  - `.gitignore`
  - `.git/`
<!-- GENERATED-END: install-manifest -->

---

## Rastreabilidade

Após o `init`, `.cortex/VERSION` registra:

```yaml
# .cortex/VERSION
source: https://github.com/JSINNOVACOM/innova-cortex
ref: latest
commit: abc1234
installed_at: 2026-06-06T00:00:00.000Z
cli_version: 0.2.0
```

---

## Licença

MIT
