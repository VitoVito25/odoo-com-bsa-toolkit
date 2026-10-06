---
title: Aba CONF
date: 2026-10-06
tags:
  - page
  - sheet/conf
  - odoo
aliases:
  - CONF
---

# Aba CONF

## O que é
Conexão com o Odoo (odoo.com, ==produção==), chave API diária, teste de conexão, parâmetros das tools e ==log de todas as execuções==.

## Para quem
BSA dono da planilha.

## Layout

### Bloco Conexão Odoo (`A1:B8`, cabeçalho teal)

| Linha | Rótulo (A) | Valor (B) | Quem edita |
|-------|-----------|-----------|------------|
| 2 | URL Odoo | `https://www.odoo.com` | usuário |
| 3 | Banco (DB) — opcional | vazio; se preenchido vai no header `X-Odoo-Database` | usuário |
| 4 | Usuário conectado | ==nome no Odoo== (ex: `Victor Tomazoni Renaud (vito)`) — usado na saudação da MAIN | script |
| 5 | Chave API | chave colada diariamente | usuário |
| 6 | Chave atualizada em | data/hora | script (ao editar `B5`) |
| 7 | Status conexão | `✅ OK · uid N · pt_BR` / `❌ ...` | script |
| 8 | Testar conexão | checkbox | usuário marca → script testa e desmarca |

### Bloco Parâmetros (`A10:B13`, cabeçalho teal)

| Linha | Rótulo (A) | Valor (B) | Usado por |
|-------|-----------|-----------|-----------|
| 11 | Pasta origem gravações (ID) | ID da pasta onde o Meet salva as reuniões | [[tool-organizador-gravacoes]] |
| 12 | Enviar e-mail de relatório | checkbox (padrão desmarcado) | todas as tools |
| 13 | Projeto QS (link) | `https://www.odoo.com/odoo/project/9273/tasks` — `(PS-BR) Quickstart` | [[project-sync-rule]] |

### Bloco Log (cabeçalho `A15:F15`, dados a partir de `A16`)

Colunas: Data/hora · Tool (ID) · Origem (`Manual`/`Agendado`) · Status · Resumo · Detalhe. Mais recente no topo; limite 1000 linhas; faixas alternadas.

Legibilidade (corrigido 2026-10-06): linha nova é inserida logo abaixo do cabeçalho e ==herdava texto branco== do cabeçalho roxo. `LogRepo.append` agora força texto `#374151`, fundo da faixa, `CLIP` e ==altura fixa de 22 px== (`LOG_ROW_HEIGHT`) — sem isso o Detalhe multilinha esticava a linha. Detalhe completo: clicar na célula e ler na barra de fórmulas.

## Como funciona — chave API
1. Usuário cola a chave em `B5`
2. `onEditInstalled` → `B6 = now()` → teste de conexão → `B4` nome, `B7` status + linha no log
3. [[main-tab]] fica verde e mostra "Olá, <nome>! 👋"

> [!warning] Risco aceito — chave em célula (decisão 2026-10-06)
> Histórico de versões guarda chaves antigas e quem acessa a planilha vê a chave. ==Não compartilhar a planilha==; chave expira em 1 dia. Agente: nunca ler o range `CONF!B5` pela API (o valor entra no contexto).

## Como funciona — teste de conexão
`OdooClient.currentUser()` → `context_get` + `res.users.read([uid], ["name"])` via JSON-2. Somente leitura.

## Regras de negócio
- [[odoo-api-key-rotation]]
- [[recording-routing-rule]] — usa `B11`
- [[project-sync-rule]] — usa `B13`

## Decisões técnicas
- Checkbox + `onEdit` instalável em vez de botão desenhado (drawings não são criáveis por API).
- Pasta de origem por ID; log na planilha; e-mail opcional (decisões 2026-10-06).
- Coordenadas em `Constants.gs`: `CONF_RANGE = B2:B13`, `LOG_HEADER_ROW = 15`.

## Edge cases conhecidos
- Execução agendada com chave de ontem → não chama API; log `❌ chave expirada`.
