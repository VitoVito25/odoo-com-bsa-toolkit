---
title: Plano de Implementação — Planilha + Apps Script
date: 2026-10-06
tags:
  - reports
  - plan
  - apps-script
aliases:
  - implementation-plan
  - plano
---

# Plano de Implementação — Planilha + Apps Script

> Status por tier: ⬜ pendente · 🟨 em andamento · ✅ concluído. Cada tier exige aprovação antes de começar ([[ai-best-practices]]).

> [!danger] Produção
> odoo.com é ==ambiente de produção==. Agente só faz chamadas de leitura (autenticar, `read`, `search_read`) sem aprovação. Qualquer escrita (`write`, `create`, `message_post`) exige aprovação explícita por execução.

---

## Decisões

| # | Pergunta | Decisão (2026-10-06) | Notas |
|---|----------|----------------------|-------|
| D1 | Onde a chave API é inserida? | ==Célula `CONF!B5`== | Risco aceito: histórico de versões + visibilidade — [[conf-tab]] |
| D2 | Instância Odoo | odoo.com (produção). Chave local do agente em `.env` (ignorado pelo git; modelo em `.env.example`) | |
| D3 | DB e login | ==Não necessários== com JSON-2. DB opcional (`CONF!B3`) | |
| D4 | Deploy do código | ==Cópia manual== no editor — [[deploy-apps-script]] | Sem clasp |
| D5 | Match reunião → projeto | Coluna `Nome Reunião` (aliases com `;`); termo inteiro, sem maiúsculas/acentos; mais longo vence se contém os outros, senão ambíguo | [[recording-routing-rule]] |
| D6 | Arquivos soltos na origem | Não — só pastas | |
| D7 | E-mail de relatório | Opcional, checkbox `CONF!B12`, padrão desligado | |
| D8 | Local da planilha | Raiz do Drive | |
| D9 | Pasta de origem das gravações | ID em `CONF!B11` (substitui busca por nome `Google Meet`) | |
| D10 | Protocolo API Odoo | ==JSON-2== (`/json/2/<model>/<method>`, `Authorization: bearer`). odoo.com = `saas~19.3`; `context_get` HTTP 200 com chave real | |

---

## Tier 1 — Criar planilha e estrutura ⬜
Feito pelo agente via MCP Google Drive/Sheets.

- Criar spreadsheet `BSA Toolkit` na raiz do Drive
- Abas `MAIN`, `TOOLS`, `CONF` (nesta ordem); cabeçalhos, larguras, linha congelada
- `MAIN`: bloco status `A1:B2` + fórmula + formatação condicional vermelha; tabela projetos `A4:G4` com ==cell notes== nos cabeçalhos; checkbox `Ativo` — [[main-tab]]
- `TOOLS`: tabela com dropdown `Agendamento`, checkbox `Executar`, proteção (warning-only) nas colunas de sistema — [[tools-tab]]
- `CONF`: bloco conexão `A1:B8`, parâmetros `A10:B12`, cabeçalho do log `A14:F14` — [[conf-tab]]
- Risco: zero (planilha nova). Verificar: `get_spreadsheet` mostra 3 abas + validações

## Tier 2 — Carga inicial de projetos ⬜
- 41 projetos do legado em `MAIN` (42 chaves; `GS Plast` + `GS Metal Plast` viram 1 projeto com `Nome Reunião` = `GS Plast; GS Metal Plast`): `Nome` = `Nome Reunião` = chave do dicionário; `Pasta Gravação` = `https://drive.google.com/drive/folders/<id>`; `Ativo` = ✓
- `CONF!B11` = ID da pasta `Google Meet` atual (agente localiza via Drive e confirma com usuário)
- Colunas de tarefa Odoo vazias — usuário preenche
- Risco: baixo. Verificar: 41 linhas, URLs abrem

## Tier 3 — Esqueleto do Apps Script ⬜

```
apps-script/
├── appsscript.json            ← timezone America/Sao_Paulo, V8, scopes explícitos
├── Main.gs                    ← onOpen (menu), onEditInstalled (roteia edições), setup()
├── config/Constants.gs        ← nomes de aba, linhas/colunas, IDs de tool
├── sheets/ProjectsRepo.gs     ← lê MAIN → [{name, meetingName, folderId, taskQsId, taskCommId, taskLogId, active}]
├── sheets/ToolsRepo.gs        ← lê/escreve linhas de TOOLS
├── sheets/ConfRepo.gs         ← conexão, chave, parâmetros
├── sheets/LogRepo.gs          ← append no topo, corta em 1000
├── services/DriveService.gs   ← listar/mover pastas
├── services/MailService.gs    ← relatório opcional
├── services/TriggerService.gs ← criar/apagar/reconciliar gatilhos
├── services/OdooClient.gs     ← auth, call(model, method, args), assertKeyFresh
└── tools/ToolRegistry.gs      ← {id, nome, descrição, handler, usaOdoo}
    tools/runTool.gs           ← wrapper: try/catch, log, atualiza TOOLS
```

- Entrega: arquivos no repo + lista para colar ([[deploy-apps-script]])
- Risco: baixo. Verificar: `node --check` em todos `.gs`; usuário cola, roda `setup()`, menu aparece

## Tier 4 — CONF: chave + teste de conexão ⬜
- `onEdit` em `CONF!B5` → `B6 = now()` → teste automático → `B7` + log
- Checkbox `Testar conexão` (`B8`)
- Risco: médio (rede/autenticação, produção — só leitura). Verificar: teste OK com chave real; data de ontem em `B6` → MAIN vermelho

## Tier 5 — Migrar organizador de gravações ⬜
- `tools/RecordingOrganizer.gs` conforme [[tool-organizador-gravacoes]]
- Registrar em `ToolRegistry` como `ORGANIZAR_GRAVACOES`
- Mover `organizador-videos.gs` → `legacy/organizador-videos.gs` (referência)
- Risco: médio (move pastas reais do Drive). Verificar: ==primeira execução em `dryRun`== (só loga), usuário revisa, depois roda real

## Tier 6 — Agendamentos amigáveis na aba TOOLS ⬜
- `TriggerService.syncTool(id)` no `onEdit` do dropdown; menu `Sincronizar agendamentos`; coluna `Próxima execução (aprox.)`
- Desativar gatilho do projeto Apps Script legado (ação manual do usuário — ⚠️ confirmar antes)
- Risco: médio. Verificar: trocar dropdown → `ScriptApp.getProjectTriggers()` reflete; execução agendada grava log com origem `Agendado`

## Backlog
- Tool: resumo de reunião (notas Gemini da pasta da reunião) → `message_post` na `Tarefa de LOG` ([[odoo-task-roles]]) — escrita em produção, exige aprovação
- Tool: validar projetos (checar via API se IDs de tarefa existem, mostrar nome da tarefa)
- Organizador: mover também arquivos soltos (D6 reaberta)
- Botão desenhado em CONF (inserção manual)

---

## Ações manuais do usuário

| Quando | Ação |
|--------|------|
| Diário (dev) | Atualizar `ODOO_API_KEY` no `.env` quando o agente for testar contra o Odoo |
| T3 | Colar arquivos no editor e rodar `setup()` — [[deploy-apps-script]] |
| T6 | Desativar gatilho do script legado |
| Diário | Colar chave nova em `CONF!B5` |

---

Ver também: [[project-overview]] | [[tools-tab]] | [[conf-tab]] | [[main-tab]] | [[deploy-apps-script]]
