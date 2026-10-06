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
Configuração da conexão com o Odoo (odoo.com, ==produção==), chave API diária, teste de conexão, parâmetros das tools e ==log de todas as execuções==.

## Para quem
BSA dono da planilha.

## Layout

### Bloco Conexão Odoo (`A1:B8`)

| Linha | Rótulo (A) | Valor (B) | Quem edita |
|-------|-----------|-----------|------------|
| 1 | **Conexão Odoo** | — | — |
| 2 | URL Odoo | `https://www.odoo.com` | usuário |
| 3 | Banco (DB) — opcional | vazio (odoo.com resolve pelo domínio); se preenchido vai no header `X-Odoo-Database` | usuário |
| 4 | Usuário conectado | `uid` / idioma retornados pelo teste | script |
| 5 | Chave API | chave colada diariamente | usuário |
| 6 | Chave atualizada em | data/hora | ==script== (ao editar `B5`) — lida por [[main-tab]] |
| 7 | Status conexão | `✅ OK (uid 123)` / `❌ ...` | script |
| 8 | Testar conexão | checkbox | usuário marca → script testa e desmarca |

### Bloco Parâmetros das tools (`A10:B12`)

| Linha | Rótulo (A) | Valor (B) | Usado por |
|-------|-----------|-----------|-----------|
| 10 | **Parâmetros** | — | — |
| 11 | Pasta origem gravações (ID) | ID da pasta do Drive onde o Meet salva as reuniões | [[tool-organizador-gravacoes]] |
| 12 | Enviar e-mail de relatório | checkbox (padrão desmarcado) | todas as tools com relatório |

### Bloco Log (cabeçalho em `A14:F14`, dados a partir de `A15`)

| Coluna | Campo |
|--------|-------|
| A | Data/hora |
| B | Tool (ID) |
| C | Origem (`Manual` / `Agendado`) |
| D | Status (`✅` / `⚠️` / `❌`) |
| E | Resumo (1 linha) |
| F | Detalhe (texto completo — ex: lista de pastas movidas) |

Linhas novas inseridas ==no topo== (mais recente primeiro). Limite de 1000 linhas; excedente apagado.

## Como funciona — chave API
1. Usuário gera chave no odoo.com e cola em `B5`
2. Gatilho `onEdit` instalável detecta edição em `B5` → grava `now()` em `B6` → roda teste de conexão → resultado em `B7` + linha no log
3. [[main-tab]] fica verde

> [!warning] Risco aceito — chave em célula (decisão 2026-10-06)
> Usuário optou por célula em vez de `PropertiesService`. Consequências: histórico de versões do Sheets guarda chaves antigas e qualquer pessoa com acesso à planilha vê a chave. Mitigações: ==não compartilhar a planilha==; chave expira em 1 dia; nota no cabeçalho de `B5` lembrando disso.

## Como funciona — teste de conexão
`OdooClient.testConnection()` → `POST {URL}/json/2/res.users/context_get` com header `Authorization: bearer <chave>` → `B7` = `✅ OK` + `B4` = `uid N · pt_BR`, ou `❌ HTTP 401 ...` + linha no log. ==Somente leitura==.

> [!info] API JSON-2 (decisão 2026-10-06)
> odoo.com roda `saas~19.3` → API JSON-2 disponível. Só a chave autentica — sem login, sem `uid` prévio, sem DB. Verificado com chave real: HTTP 200 em `context_get`.

## Regras de negócio
- [[odoo-api-key-rotation]]
- [[recording-routing-rule]] — usa `B11`

## Decisões técnicas
- Checkbox + `onEdit` instalável em vez de botão desenhado: botões (drawings) não podem ser criados via API/script. Botão desenhado é opcional, inserido à mão (atribuir função `testOdooConnection`).
- Pasta de origem por ID (decisão 2026-10-06) em vez de busca por nome `Google Meet`.
- Log na planilha é o registro principal; e-mail opcional via `B12` (decisão 2026-10-06).

## Edge cases conhecidos
- `B5` editado por colagem com espaço/quebra de linha → script faz `trim()` antes de usar.
- Execução agendada com chave de ontem → não chama API; log `❌ chave expirada`.
