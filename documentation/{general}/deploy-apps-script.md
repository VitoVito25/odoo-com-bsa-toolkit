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

## Ambientes (decisão 2026-10-06)

| | DEV (origem) | PROD |
|-|--------------|------|
| Conta Google | `victortomazonir@gmail.com` (pessoal) | `vito@odoo.com` (corporativa) |
| Planilha | `1aZaUFqrxflo6lRWzY7mWOo3j8KDrkBCVUTl4TSpBd0w` | `1BqGcIfE51PbA2eiG41uwU9tC_0hr-IdeXhyIHfOqkqs` |
| Script vinculado | `1z0Gy39yf_fZ1GpS6H1h4e-xsTL-Lk5IOhY0O5qnriWxaFqCeseP6eYuS` (`.clasp.json`) | copiado junto com a planilha (ID no editor da cópia) |
| Deploy | `npx @google/clasp push --force` | ==cópia manual== dos arquivos alterados no editor |
| Pasta Meet (`CONF!B11`) | `1aYqJa-…` (vazia — teste) | `1J8ZTQ9iO_kSYA09albhdH_CLfbWmPlsh` (real) |
| Pastas dos projetos | ==inacessíveis== (são da conta Odoo) | acessíveis |
| Agendamentos | manter `Manual` | conforme uso |

> [!warning] Por que PROD não usa clasp
> A TI da Odoo bloqueia o app clasp na conta corporativa: "Acesso bloqueado: o admin da sua instituição precisa analisar o app clasp" (`Erro 400: access_not_configured`, 2026-10-06). Não contornar.

### Fluxo de atualização
1. Alterar código em `apps-script/` → `node --check` → `clasp push` para DEV
2. Testar no DEV (menus, simulação, log). Organizador no DEV só valida lógica — pastas reais não existem lá
3. Agente lista os arquivos alterados → usuário cola no editor do PROD (Extensões → Apps Script) → salvar
4. Se mudou `appsscript.json` (escopos) ou gatilhos: rodar `BSA Toolkit → Instalar gatilhos (setup)` no PROD e autorizar
5. Se mudou a estrutura da planilha (linhas/colunas/visual): replicar no PROD — via API só no DEV (conector Drive/Sheets do agente é da conta pessoal); no PROD pelo Chrome ou recopiando a planilha

## Decisão
Código versionado em `apps-script/` neste repo e enviado com ==`clasp push`== (revisado 2026-10-06 — antes era cópia manual). O repo é a fonte da verdade: alteração feita direto no editor é sobrescrita no próximo push — trazer de volta com `npx @google/clasp pull` antes.

## Via clasp (padrão)
- Projeto vinculado: script `1z0Gy39yf_fZ1GpS6H1h4e-xsTL-Lk5IOhY0O5qnriWxaFqCeseP6eYuS` → planilha `BSA Toolkit`. Config em `.clasp.json` (raiz, sem segredo, `rootDir: apps-script`)
- Pré-requisitos (1x por máquina): API do Apps Script ativada em `script.google.com/home/usersettings`; `npx @google/clasp login` (token em `~/.clasprc.json`, fora do repo)
- Enviar: `npx @google/clasp push --force` na raiz do repo
- Se `appsscript.json` mudar escopos: rodar qualquer função no editor para reautorizar

> [!warning] `clasp create` sobrescreve o manifesto
> Ao criar um projeto novo, o clasp baixa o `appsscript.json` padrão (fuso `America/New_York`, sem escopos) por cima do nosso. Fazer backup antes e restaurar antes do push.

## Via cópia manual (alternativa)

## Onde fica cada arquivo

| Arquivo no repo | Nome do arquivo no editor | Observação |
|-----------------|---------------------------|------------|
| `apps-script/appsscript.json` | `appsscript.json` | Configurações do projeto → marcar "Mostrar arquivo de manifesto appsscript.json no editor" |
| `apps-script/Main.gs` | `Main` | entry points: menu, gatilhos |
| `apps-script/config/Constants.gs` | `config/Constants` | `/` no nome vira pasta no editor |
| `apps-script/sheets/ProjectsRepo.gs` | `sheets/ProjectsRepo` | lê MAIN |
| `apps-script/sheets/ConfRepo.gs` | `sheets/ConfRepo` | lê/escreve CONF |
| `apps-script/sheets/LogRepo.gs` | `sheets/LogRepo` | log em CONF |
| `apps-script/sheets/ToolsRepo.gs` | `sheets/ToolsRepo` | linhas de TOOLS |
| `apps-script/services/DriveService.gs` | `services/DriveService` | listar/mover pastas |
| `apps-script/services/MailService.gs` | `services/MailService` | e-mail opcional |
| `apps-script/services/OdooClient.gs` | `services/OdooClient` | API JSON-2 |
| `apps-script/tools/ToolRegistry.gs` | `tools/ToolRegistry` | catálogo de tools |
| `apps-script/tools/runTool.gs` | `tools/runTool` | wrapper: lock, log, resultado |
| `apps-script/tools/RecordingOrganizer.gs` | `tools/RecordingOrganizer` | organizador de gravações |

Total: 1 manifesto + 12 arquivos `.gs`.

Editor: planilha → **Extensões → Apps Script** → `+` → **Script** → digitar nome sem `.gs`.

## Passo a passo — primeira instalação
1. Abrir a planilha `BSA Toolkit` → Extensões → Apps Script
2. Apagar o `Código.gs` padrão
3. Colar `appsscript.json` (manifesto)
4. Criar cada arquivo da tabela acima e colar o conteúdo
5. Salvar (`Ctrl+S`)
6. Selecionar função `setup` → **Executar** → autorizar escopos (cria gatilho `onEdit` instalável)
7. Recarregar a planilha → menu `BSA Toolkit` aparece
8. Colar a chave do dia em `CONF!B5` → `B6` recebe a data, `B7` mostra `✅ OK`, MAIN fica verde
9. Menu `BSA Toolkit → Organizar gravações — simulação` → conferir log em CONF (linhas `🔎 MOVERIA` / `⚠️ PENDENTE`)
10. Só depois de revisar: `Organizar gravações — executar`

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
