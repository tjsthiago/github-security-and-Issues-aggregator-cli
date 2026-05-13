---
name: generateSecurityDependabotAggregationAsMarkdown
description: 'Gera um relatório Markdown consolidado com todos os alertas abertos do Dependabot para um repositório GitHub. Use quando: quiser listar vulnerabilidades de dependências, gerar relatório de segurança Dependabot, auditar alertas de dependabot, agregar alertas de segurança em markdown, consultar alertas abertos de dependabot de um repositório.'
argument-hint: 'Nome completo do repositório no formato owner/repo (ex: nome-do-owner/nome-do-repositorio)'
---

# Generate Security Dependabot Aggregation as Markdown

## Objetivo

Consultar todos os alertas do Dependabot de um repositório GitHub via GitHub CLI, filtrar apenas os alertas com status `open` e gerar um arquivo Markdown estruturado com índice auto-incremental para cada alerta.

## Quando Usar

- Auditar vulnerabilidades de dependências de um repositório
- Gerar relatório de segurança baseado nos alertas do Dependabot
- Consolidar alertas abertos em um documento rastreável
- Revisar CVEs e recomendações de atualização de pacotes

## Pré-requisitos

- GitHub CLI (`gh`) instalado e autenticado (`gh auth status`)
- Permissão de leitura no repositório alvo

## Procedimento

### Passo 1 — Obter o repositório alvo

Se o usuário informou o repositório no prompt (formato `owner/repo`), use diretamente.
Caso contrário, pergunte ao usuário:

> "Qual é o repositório no formato `owner/repo`? (ex: `nome-do-owner/nome-do-repositorio`)"

### Passo 2 — Buscar todos os alertas do Dependabot

Execute o comando abaixo no terminal, substituindo `{owner}/{repo}` pelo valor fornecido:

```bash
gh api repos/{owner}/{repo}/dependabot/alerts --paginate
```

O parâmetro `--paginate` garante que todos os alertas sejam retornados, mesmo em repositórios com muitos alertas.

### Passo 3 — Filtrar apenas alertas abertos

Da resposta JSON obtida, filtre somente os objetos onde `"state": "open"`.

Caso prefira filtrar direto via CLI:

```bash
gh api repos/{owner}/{repo}/dependabot/alerts --paginate \
  --jq '[.[] | select(.state == "open")]'
```

### Passo 4 — Determinar o caminho e nome do arquivo de saída

O arquivo deve ser salvo em:

```
.github/specs/issues/dependabot-alerts/opened-dependabot-alerts-at-<yyyymmdd>.md
```

Onde `<yyyymmdd>` é a data atual no momento da execução. Obtenha-a com:

```bash
date +%Y%m%d
```

O caminho base do arquivo será:

```
.github/specs/issues/dependabot-alerts/opened-dependabot-alerts-at-YYYYMMDD.md
```

**Resolução de conflitos de nome:** Antes de criar o arquivo, verifique se já existe um arquivo com o mesmo nome no diretório de destino. Use a seguinte lógica de incremento:

1. Tente `opened-dependabot-alerts-at-YYYYMMDD.md` — se não existir, use este nome.
2. Se existir, tente `opened-dependabot-alerts-at-YYYYMMDD-1.md`.
3. Se existir, tente `opened-dependabot-alerts-at-YYYYMMDD-2.md`.
4. Continue incrementando até encontrar um nome disponível.

Exemplo de verificação via terminal:

```bash
DATETAG=$(date +%Y%m%d)
DIR=".github/specs/issues/dependabot-alerts"
BASE="opened-dependabot-alerts-at-${DATETAG}"
FILE="${DIR}/${BASE}.md"

if [ -f "$FILE" ]; then
  COUNTER=1
  while [ -f "${DIR}/${BASE}-${COUNTER}.md" ]; do
    COUNTER=$((COUNTER + 1))
  done
  FILE="${DIR}/${BASE}-${COUNTER}.md"
fi

echo "Arquivo de saída: $FILE"
```

Crie o diretório de destino caso não exista:

```bash
mkdir -p .github/specs/issues/dependabot-alerts
```

### Passo 5 — Gerar o arquivo Markdown

Crie o arquivo no caminho resolvido no passo anterior com a seguinte estrutura:

```markdown
# Relatório de Alertas de Segurança — Dependabot

**Repositório:** `owner/repo`
**Data de geração:** YYYY-MM-DD
**Total de alertas abertos:** N

---

## Alerta #1

| Campo              | Valor                            |
|--------------------|----------------------------------|
| **Número**         | 1                                |
| **Pacote**         | nome-do-pacote                   |
| **Ecossistema**    | npm / pip / maven / etc.         |
| **Versão afetada** | x.y.z                            |
| **Versão segura**  | a.b.c                            |
| **Severidade**     | critical / high / medium / low   |
| **CVE / GHSA**     | CVE-XXXX-XXXX ou GHSA-xxxx-xxxx  |
| **Resumo**         | Breve descrição da vulnerabilidade |
| **URL**            | Link para o advisory             |
| **Status**         | open                             |

---

## Alerta #2

...
```

Repita o bloco `## Alerta #N` para cada alerta aberto, usando índice auto-incremental a partir de 1.

### Passo 6 — Salvar o arquivo

Salve o arquivo gerado no caminho resolvido no Passo 4.

Confirme ao usuário com uma mensagem como:

> "Arquivo `.github/specs/issues/dependabot-alerts/opened-dependabot-alerts-at-YYYYMMDD.md` gerado com sucesso com N alertas abertos do repositório `owner/repo`."

## Mapeamento dos campos JSON → Markdown

| Campo Markdown     | Caminho no JSON                                              |
|--------------------|--------------------------------------------------------------|
| Número             | `.number`                                                    |
| Pacote             | `.dependency.package.name`                                   |
| Ecossistema        | `.dependency.package.ecosystem`                              |
| Versão afetada     | `.dependency.manifest_path` + `.security_vulnerability.vulnerable_version_range` |
| Versão segura      | `.security_vulnerability.first_patched_version.identifier`  |
| Severidade         | `.security_advisory.severity`                                |
| CVE / GHSA         | `.security_advisory.cve_id` ou `.security_advisory.ghsa_id` |
| Resumo             | `.security_advisory.summary`                                 |
| URL                | `.html_url`                                                  |
| Status             | `.state`                                                     |

## Tratamento de Casos Especiais

- Se **nenhum alerta aberto** for encontrado, gere o arquivo informando: `Nenhum alerta aberto encontrado para este repositório.`
- Se o campo `first_patched_version` for `null`, exiba `Sem correção disponível`.
- Se `cve_id` for `null`, use o valor de `ghsa_id` como identificador.
- Se a API retornar erro 404, informe ao usuário que o repositório não existe ou que você não tem permissão de acesso.
- Se a API retornar erro 403, informe que é necessário autenticar com `gh auth login` e ter permissão `security_events` no repositório.
