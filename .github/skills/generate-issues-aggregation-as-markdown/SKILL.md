---
name: generateIssuesAggregationAsMarkdown
description: 'Gera um relatório Markdown consolidado com todas as issues abertas de um repositório GitHub. Use quando: quiser listar issues abertas, gerar relatório de issues, agregar issues em markdown, consolidar apontamentos abertos de um repositório GitHub.'
argument-hint: 'Nome completo do repositório no formato owner/repo (ex: nome-do-owner/nome-do-repositorio)'
---

# Generate Issues Aggregation as Markdown

## Objetivo

Consultar todas as issues abertas de um repositório GitHub via GitHub CLI e gerar um arquivo Markdown estruturado com índice auto-incremental para cada issue.

## Quando Usar

- Consolidar issues abertas de um repositório em um documento rastreável
- Gerar relatório de apontamentos e achados de segurança abertos
- Auditar o estado atual das issues abertas de um repositório
- Revisar issues abertas por labels ou responsável

## Pré-requisitos

- GitHub CLI (`gh`) instalado e autenticado (`gh auth status`)
- Permissão de leitura no repositório alvo

## Procedimento

### Passo 1 — Obter o repositório alvo

Se o usuário informou o repositório no prompt (formato `owner/repo`), use diretamente.
Caso contrário, pergunte ao usuário:

> "Qual é o repositório no formato `owner/repo`? (ex: `nome-do-owner/nome-do-repositorio`)"

### Passo 2 — Buscar todas as issues abertas

Execute o comando abaixo no terminal, substituindo `{owner}/{repo}` pelo valor fornecido:

```bash
gh issue list --state open --repo {owner}/{repo} --json number,title,state,body,labels,assignees,url,createdAt,updatedAt --limit 1000
```

O parâmetro `--state open` garante que apenas issues abertas sejam retornadas.
O parâmetro `--limit 1000` evita truncamento em repositórios com muitas issues. Ajuste conforme necessário.

### Passo 3 — Determinar o caminho e nome do arquivo de saída

O arquivo deve ser salvo em:

```
.github/specs/issues/github-issues/opened-issues-at-<yyyymmdd>.md
```

Onde `<yyyymmdd>` é a data atual no momento da execução. Obtenha-a com:

```bash
date +%Y%m%d
```

**Resolução de conflitos de nome:** Antes de criar o arquivo, verifique se já existe um arquivo com o mesmo nome no diretório de destino. Use a seguinte lógica de incremento:

1. Tente `opened-issues-at-YYYYMMDD.md` — se não existir, use este nome.
2. Se existir, tente `opened-issues-at-YYYYMMDD-01.md`.
3. Se existir, tente `opened-issues-at-YYYYMMDD-02.md`.
4. Continue incrementando até encontrar um nome disponível.

Exemplo de verificação via terminal:

```bash
DATETAG=$(date +%Y%m%d)
DIR=".github/specs/issues/github-issues"
BASE="opened-issues-at-${DATETAG}"
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
mkdir -p .github/specs/issues/github-issues
```

### Passo 4 — Gerar o arquivo Markdown

Crie o arquivo no caminho resolvido no passo anterior com a seguinte estrutura:

```markdown
# Relatório de Issues Abertas — GitHub

**Repositório:** `owner/repo`
**Data de geração:** YYYY-MM-DD
**Total de issues abertas:** N

---

## Issue #1

| Campo              | Valor                              |
|--------------------|------------------------------------|
| **Número**         | 1                                  |
| **Título**         | Título da issue                    |
| **Estado**         | open / closed                      |
| **Labels**         | bug, security, enhancement / —     |
| **Responsáveis**   | usuario1, usuario2 / —             |
| **Criada em**      | YYYY-MM-DD                         |
| **Atualizada em**  | YYYY-MM-DD                         |
| **URL**            | Link para a issue                  |

**Descrição:**

Corpo completo da issue exatamente como está no GitHub, sem nenhuma modificação ou truncamento.

---

## Issue #2

...
```

Repita o bloco `## Issue #N` para cada issue, usando índice auto-incremental a partir de 1.

### Passo 5 — Salvar o arquivo

Salve o arquivo gerado no caminho resolvido no Passo 3.

Confirme ao usuário com uma mensagem como:

> "Arquivo `.github/specs/issues/github-issues/opened-issues-at-YYYYMMDD.md` gerado com sucesso com N issues abertas do repositório `owner/repo`."

## Mapeamento dos campos JSON → Markdown

| Campo Markdown     | Campo no JSON retornado pelo `gh issue list`   |
|--------------------|------------------------------------------------|
| Número             | `.number`                                      |
| Título             | `.title`                                       |
| Estado             | `.state`                                       |
| Labels             | `.labels[].name` (concatenados por `, `)       |
| Responsáveis       | `.assignees[].login` (concatenados por `, `)   |
| Criada em          | `.createdAt` (formatar como YYYY-MM-DD)        |
| Atualizada em      | `.updatedAt` (formatar como YYYY-MM-DD)        |
| URL                | `.url`                                         |
| Descrição          | `.body` (conteúdo completo, sem truncamento)      |

## Tratamento de Casos Especiais

- Se **nenhuma issue aberta** for encontrada, gere o arquivo informando: `Nenhuma issue aberta encontrada para este repositório.`
- Se o campo `body` for `null` ou vazio, exiba `Sem descrição disponível.`
- O campo `body` deve ser inserido **na íntegra**, sem truncamentos, resumos ou omissões. Todo o conteúdo disponível no GitHub deve estar presente no arquivo gerado.
- Se o campo `assignees` for vazio, exiba `—` na coluna de responsáveis.
- Se o campo `labels` for vazio, exiba `—` na coluna de labels.
- Se a CLI retornar erro de autenticação, informe ao usuário que é necessário autenticar com `gh auth login`.
- Se a CLI retornar erro de repositório não encontrado, informe que o repositório não existe ou que você não tem permissão de acesso.
