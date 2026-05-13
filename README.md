# GitHub Issues & Dependabot Aggregator

CLI tool escrita em TypeScript para consolidar Issues abertas e Dependabot Alerts ativos de um repositório privado do GitHub em relatórios Markdown estruturados. Facilita auditorias de segurança, rastreamento de SLA e revisão offline sem precisar navegar manualmente pela interface do GitHub.

## Pré-requisitos

- **Node.js** >= 18 (LTS)
- **npm** >= 9
- **Personal Access Token (PAT)** do GitHub com os escopos:
  - `repo` — acesso a repositórios privados (Issues)
  - `security_events` — acesso a Dependabot Alerts

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositório>
cd solve-github-issues-with-sdd

# Instale as dependências
npm install

# Compile o projeto
npm run build
```

## Configuração

Crie um arquivo `.env` na raiz do projeto a partir do exemplo:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
# PAT com escopos repo e security_events
GITHUB_TOKEN=seu_token_aqui

# Organização ou usuário dono do repositório
GITHUB_OWNER=nome-da-organizacao

# Nome do repositório
GITHUB_REPO=nome-do-repositorio
```

> O arquivo `.env` nunca deve ser commitado. Ele já está incluído no `.gitignore`.

## Comandos disponíveis

### Listar Issues abertas

Busca e exibe no terminal todas as Issues abertas do repositório:

```bash
node dist/cli.js fetch-issues
```

Saída esperada:

```
Found 3 open issues:
  #42 - Corrigir validação de CPF
  #38 - Implementar retry na integração fiscal
  #21 - Atualizar dependências do módulo de emissão
```

### Listar Dependabot Alerts ativos

Busca e exibe no terminal todos os Dependabot Alerts ativos do repositório:

```bash
node dist/cli.js fetch-dependabot-alerts
```

Saída esperada:

```
Found 2 active Dependabot alerts:
  #7 - lodash (high)
  #3 - axios (critical)
```

### Gerar relatório de Issues em Markdown

Agrega todas as Issues abertas em um arquivo `issues-report.md` no diretório atual:

```bash
node dist/cli.js aggregate-issues
```

Cada entrada recebe um índice sequencial e é separada por `---`. Exemplo de saída:

```markdown
# 1. Corrigir validação de CPF

**Issue #42**
**URL:** https://github.com/org/repo/issues/42
**Labels:** bug, validation
**Assignees:** dev1

Descrição completa da issue...

---

# 2. Implementar retry na integração fiscal

**Issue #38**
...
```

### Gerar relatório de Dependabot Alerts em Markdown

Agrega todos os Dependabot Alerts ativos em um arquivo `dependabot-report.md` no diretório atual:

```bash
node dist/cli.js aggregate-alerts
```

Cada entrada inclui número do alert, nome da dependência, severidade, CVE (quando disponível), URL da advisory e faixa de versões vulneráveis. Exemplo:

```markdown
# 1. lodash - HIGH

**Alert #7**
**Dependency:** lodash
**Vulnerable Versions:** >= 4.0.0, < 4.17.21
**Patched Version:** 4.17.21
**Severity:** high
**CVE:** CVE-2021-23337
**Advisory:** https://github.com/advisories/GHSA-xxxx
**Summary:** Command injection vulnerability in lodash...

---

# 2. axios - CRITICAL
...
```

## Desenvolvimento

```bash
# Executar testes unitários
npm run test:unit

# Executar testes de integração (requer .env com token válido)
npm run test:integration

# Executar todos os testes
npm test

# Compilar TypeScript
npm run build
```

## Estrutura do projeto

```
src/
  domain/           # Entidades, Value Objects e interfaces de repositório
  application/      # Use Cases (FetchIssues, FetchDependabotAlerts, Aggregate*)
  infrastructure/   # Adaptadores HTTP, repositórios GitHub, leitor de config
  shared/           # Classes de erro compartilhadas
tests/
  unit/             # Testes unitários (sem I/O real)
  integration/      # Testes de integração contra a API real do GitHub
```
