---
title: Deploy manual do Apps Script
date: 2026-10-06
tags:
  - general
  - deploy
  - apps-script
aliases:
  - deploy
  - como-publicar-codigo
---

# Deploy manual do Apps Script

## Decisão
Código versionado em `apps-script/` neste repo; ==usuário copia e cola manualmente== no editor do Apps Script (decisão 2026-10-06 — sem `clasp`). O repo é a fonte da verdade: alteração feita direto no editor deve voltar para o repo.

## Onde fica cada arquivo

| Arquivo no repo | Nome do arquivo no editor | Observação |
|-----------------|---------------------------|------------|
| `apps-script/appsscript.json` | `appsscript.json` | Configurações do projeto → marcar "Mostrar arquivo de manifesto appsscript.json no editor" |
| `apps-script/Main.gs` | `Main` | entry points: menu, gatilhos |
| `apps-script/config/Constants.gs` | `config/Constants` | `/` no nome vira pasta no editor |
| `apps-script/sheets/*.gs` | `sheets/<Nome>` | repos |
| `apps-script/services/*.gs` | `services/<Nome>` | Drive, Odoo, gatilhos |
| `apps-script/tools/*.gs` | `tools/<Nome>` | tools e registry |

Editor: planilha → **Extensões → Apps Script** → `+` → **Script** → digitar nome sem `.gs`.

## Passo a passo — primeira instalação
1. Abrir a planilha `BSA Toolkit` → Extensões → Apps Script
2. Apagar o `Código.gs` padrão
3. Colar `appsscript.json` (manifesto)
4. Criar cada arquivo da tabela acima e colar o conteúdo
5. Salvar (`Ctrl+S`)
6. Selecionar função `setup` → **Executar** → autorizar escopos (cria gatilho `onEdit` instalável)
7. Recarregar a planilha → menu `BSA Toolkit` aparece

## Passo a passo — atualização
1. Agente informa a lista de arquivos alterados no fim do tier (ex: "alterados: `tools/RecordingOrganizer.gs`, `config/Constants.gs`")
2. Colar só esses arquivos no editor, salvar
3. Se o tier mudou `appsscript.json` (novos escopos) → rodar qualquer função uma vez para reautorizar
4. Testar pelo menu e conferir log em [[conf-tab]]

> [!warning] Escopo global único
> Todos os `.gs` compartilham o mesmo escopo e a ordem de carregamento não é garantida. Código no topo do arquivo só declara `const Modulo = {...}` — nunca chama outro módulo fora de função.

> [!warning] Script legado
> O projeto Apps Script antigo (com `organizarGravacoesMeet`) pode ter um gatilho agendado. Desativar esse gatilho ao ativar a nova tool para não mover pastas duas vezes — ver [[implementation-plan]] Tier 6.

## Relacionado
- [[implementation-plan]]
- [[coding-conventions]]
