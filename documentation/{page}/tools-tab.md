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
Catálogo de todas as tools do script. Permite ==executar manualmente== e ==configurar agendamento== de forma amigável, sem abrir o editor do Apps Script.

## Para quem
BSA dono da planilha.

## Colunas

| Coluna | Campo | Editável? | Descrição |
|--------|-------|-----------|-----------|
| A | `ID` | não | Chave estável da tool (ex: `ORGANIZAR_GRAVACOES`). Liga a linha ao registro em `apps-script/tools/ToolRegistry.gs` |
| B | `Tool` | não | Nome amigável |
| C | `Descrição` | não | O que faz, em 1 frase |
| D | `Executar` | sim (checkbox) | Marcar = roda agora; script desmarca ao terminar |
| E | `Agendamento` | sim (dropdown) | `Manual` · `A cada hora` · `A cada 6h` · `Diário 08h` · `Diário 18h` · `Semanal (seg 08h)` |
| F | `Status agendamento` | não | `✅ Ativo` · `⏸ Manual` · `⚠️ Divergente` (gatilho real ≠ planilha) |
| G | `Próxima execução (aprox.)` | não | Calculada a partir do agendamento |
| H | `Última execução` | não | Data/hora da última execução |
| I | `Último resultado` | não | `✅ OK` / `⚠️ Pendências` / `❌ Erro` + resumo curto |

Colunas A–C, F–I protegidas (aviso ao editar).

## Agendamentos amigáveis — como funciona

> [!info] Limitação da API
> `ScriptApp.getProjectTriggers()` retorna função, tipo e ID do gatilho, mas ==não retorna a frequência/horário==. Por isso a planilha é a fonte da verdade e o script reconcilia.

Fluxo:
1. Usuário escolhe valor no dropdown `Agendamento`
2. Gatilho instalável `onEdit` chama `TriggerService.syncTool(id)`:
   - apaga gatilhos existentes daquela tool
   - cria novo `ScriptApp.newTrigger(...).timeBased()` conforme o dropdown
   - guarda o `triggerId` em `PropertiesService` (chave `trigger:<ID>`)
3. Menu `BSA Toolkit → Sincronizar agendamentos` reconcilia tudo e marca `⚠️ Divergente` se algum gatilho sumiu ou foi criado fora da planilha
4. Toda execução (manual ou agendada) grava `H`, `I` e uma linha no log de [[conf-tab]]

> [!warning] Horário aproximado
> Gatilhos de tempo do Apps Script rodam dentro de uma janela de ~15 min do horário escolhido. Coluna G deixa isso explícito ("~08:00").

## Execução manual
- Checkbox `Executar` (gatilho `onEdit` instalável) ou menu `BSA Toolkit → Executar tool…`
- Desenho/botão clicável: não dá para criar por API — opcional, usuário insere manualmente e atribui a função `runSelectedTool`

## Regras de negócio
- Tools que usam Odoo verificam [[odoo-api-key-rotation]] antes de rodar; chave vencida → `❌ Erro: chave expirada` sem chamar a API.
- Tools que escrevem no Odoo (produção) ou movem arquivos têm modo `dryRun`.

## Decisões técnicas
- Registro de tools em código (`ToolRegistry.gs`) e não só na planilha: evita que linha editada aponte para função inexistente. Script recria linhas faltantes no `onOpen`.
- Gatilho `onEdit` precisa ser ==instalável== (simple trigger não pode criar triggers nem chamar serviços autorizados).

## Edge cases conhecidos
- Limite de 20 gatilhos por usuário por script — suficiente para o catálogo planejado.
- Gatilhos rodam com a conta do dono; se outra pessoa editar a planilha, agendamentos continuam com a conta de quem criou.
