---
title: Sincronização de projetos com o Odoo
date: 2026-10-06
tags:
  - business-rule
  - odoo
  - project
aliases:
  - SINCRONIZAR_PROJETOS
---

# Sincronização de projetos com o Odoo

## Definição
Puxa do projeto QS (`CONF!B13`) as ==tarefas principais== (`parent_id = false`) em que o usuário logado é responsável (`user_ids` contém o uid) e atualiza a tabela da [[main-tab]]. Odoo é ==somente leitura==; só a planilha é escrita.

## Contexto
- No odoo.com, o projeto `(PS-BR) Quickstart` (id 9273) tem uma tarefa principal por cliente; `[COMUNICAÇÃO] X <> Odoo`, `F0 - KickOff`, `Buffer` etc. são ==subtarefas== dela (verificado 2026-10-06: 313 tarefas do usuário, 55 principais).
- Pedido do usuário: se o nome bater, não inserir linha nova; concluído/cancelado → desmarcar `Ativo`.

## Algoritmo
Para cada tarefa principal, achar a linha da MAIN:
1. **Por ID** — linha cuja `Tarefa QS Principal` aponta para a tarefa
2. **Por nome** — `Nome` normalizado == nome da tarefa normalizado
3. **Por termo** — `Nome` e termos de `Nome Reunião` (sem `<>`) aparecem no nome da tarefa:
   - termo com < 5 caracteres → palavra inteira (`pr` casa "PR DE SOUZA", não "PRODUTOS")
   - termo com ≥ 5 → prefixo de palavra (`passaporte` casa "Passaportes Poloneses")
   - mais longo vence se contém os outros; senão ==ambíguo== (nada alterado, aviso no log)
   - linhas já ligadas a outra tarefa por ID não entram neste passo

Resultado por tarefa:

| Caso | Ação na MAIN |
|------|--------------|
| Casou | `Ativo` = estado não é `1_done`/`1_canceled`; preenche `Tarefa QS Principal` e `Tarefa de Comunicação` ==só se vazias== |
| Não casou | Linha nova: `Nome` = nome da tarefa, links QS/Comunicação, `Ativo` conforme estado. `Nome Reunião` e `Pasta Gravação` ficam vazios → organizador ignora até o usuário preencher |
| Ambíguo / linha já usada | Nada alterado; `⚠️` no log |
| Linha da MAIN sem tarefa | Intocada (ex: projeto de outro responsável) |

`Tarefa de Comunicação` = primeira subtarefa cujo nome contém "comunica" (`ilike`).

> [!warning] Ativo é sobrescrito
> A cada sincronização, `Ativo` volta a refletir o estado da tarefa no Odoo. Desmarcar manualmente um projeto em andamento não persiste.

## Exemplos (execução real 2026-10-06)
- 1ª rodada: `55 tarefas: 38 atualizadas (26 desativadas), 17 novas, 0 avisos`
- 2ª rodada: `0 atualizadas, 0 novas` — idempotente
- `[PR <>]` ← "PR DE SOUZA GOMES JUNIOR LTDA" (termo `pr`, palavra inteira)
- `[GS Plast]` ← "GS Metal Plast" (alias `GS Metal Plast`)
- Emporio, Bento, Ana Carms: sem tarefa principal do usuário → intocados

## Impacto no código
`apps-script/tools/ProjectSync.gs` — `runProjectSync_` (I/O), `planProjectSync_` e `findRowForTask_` (puras, testadas em Node com os dados reais).

## Relacionado
- [[main-tab]]
- [[odoo-task-roles]]
- [[recording-routing-rule]]
