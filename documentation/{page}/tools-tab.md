---
title: Aba TOOLS
date: 2026-10-06
tags:
  - page
  - sheet/tools
  - triggers
aliases:
  - TOOLS
---

# Aba TOOLS

## O que é
Catálogo de todas as tools do script, com ==execução manual== e ==agendamento por dropdown==.

## Para quem
BSA dono da planilha.

## Colunas

| Coluna | Campo | Editável? | Descrição |
|--------|-------|-----------|-----------|
| A | `ID` | não | Chave estável (`ORGANIZAR_GRAVACOES`, `SINCRONIZAR_PROJETOS`) — liga a linha ao `ToolRegistry.gs` |
| B | `Tool` | não | Nome amigável |
| C | `Descrição` | não | O que faz |
| D | `Executar` | sim (checkbox) | Marcar = roda agora (==real, sem confirmação==); script desmarca |
| E | `Agendamento` | sim (dropdown) | `Manual` · `A cada hora` · `A cada 6h` · `Diário 08h` · `Diário 18h` · `Semanal (seg 08h)` |
| F | `Status agendamento` | não | `✅ Ativo` (verde) · `⏸ Manual` · `⚠️ Divergente — use Sincronizar agendamentos` (amarelo) |
| G | `Próxima execução (aprox.)` | não | `~ dd/MM HH:mm` |
| H | `Última execução` | não | Data/hora |
| I | `Último resultado` | não | `✅`/`⚠️`/`❌` + resumo (`❌` em vermelho) |

## Agendamentos — implementação (2026-10-06)

> [!info] Limitação da API
> `ScriptApp.getProjectTriggers()` não expõe frequência/horário. A planilha é a fonte da verdade; `TriggerService` reconcilia.

- Trocar o dropdown → `onEditInstalled` → `TriggerService.syncTool(id, rótulo)`: apaga o gatilho da tool e cria `timeBased()` novo com handler único `runScheduledTool`
- `ScriptProperties`: `trigger:<id>` = uid · `triggerTool:<uid>` = id · `triggerLabel:<id>` · `triggerCreated:<id>`
- `runScheduledTool(e)` descobre a tool por `e.triggerUid` → `runTool(id, {origin: Agendado})`
- `refreshStatuses()` escreve F/G após cada execução, ao abrir a planilha (`onOpenInstalled`) e ao trocar o dropdown
- Menu `Sincronizar agendamentos` → `syncAll()`: recria gatilhos faltantes/divergentes e apaga órfãos
- `nextRun_()` (pura): a cada N horas = criação + k×intervalo; diário/semanal = próximo horário fixo

Verificado 2026-10-06: `Diário 18h` → `✅ Ativo` / `~ 06/10 18:00`; de volta para `Manual` → `⏸ Manual`.

> [!warning] Horário aproximado
> O Google roda gatilhos de tempo numa janela de ~15 min.

> [!note] Por que antes "não funcionava"
> Até a Tier 6 só existia o dropdown na planilha — nenhum código lia a coluna; status e próxima execução eram texto fixo.

## Regras de negócio
- Tools que usam Odoo verificam [[odoo-api-key-rotation]] antes de rodar; agendamento das 08h falha se a chave do dia ainda não foi colada.
- Tools que movem arquivos têm modo simulação no menu.

## Decisões técnicas
- Registry em código (`ToolRegistry.gs`); `ensureRows` recria linhas faltantes no setup/abertura.
- `onEdit` e `onOpen` ==instaláveis== (simple triggers não podem criar/ler gatilhos).

## Edge cases conhecidos
- Limite de 20 gatilhos por usuário por script.
- Gatilhos rodam com a conta de quem rodou o setup.
