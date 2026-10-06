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
| D4 | Deploy do código | ==clasp== (revisado 2026-10-06 a pedido do usuário) — script vinculado `1z0Gy39yf_fZ1GpS6H1h4e-xsTL-Lk5IOhY0O5qnriWxaFqCeseP6eYuS`, `.clasp.json` no repo. Cópia manual fica como alternativa — [[deploy-apps-script]] | |
| D5 | Match reunião → projeto | Coluna `Nome Reunião` (aliases com `;`); termo inteiro, sem maiúsculas/acentos; mais longo vence se contém os outros, senão ambíguo | [[recording-routing-rule]] |
| D6 | Arquivos soltos na origem | Não — só pastas | |
| D7 | E-mail de relatório | Opcional, checkbox `CONF!B12`, padrão desligado | |
| D8 | Local da planilha | Raiz do Drive | |
| D9 | Pasta de origem das gravações | ID em `CONF!B11` (substitui busca por nome `Google Meet`) | |
| D11 | Fonte da lista de projetos | Projeto QS `(PS-BR) Quickstart` (id 9273) em `CONF!B13`; tarefas principais do usuário | [[project-sync-rule]] |
| D12 | Conta Google do toolkit | PROD na conta Odoo `vito@odoo.com` (onde estão as gravações); ==DEV/origem na conta pessoal== para futuros updates | [[deploy-apps-script]] |
| D13 | Deploy no PROD | Cópia manual — clasp bloqueado pela TI da Odoo | |
| D10 | Protocolo API Odoo | ==JSON-2== (`/json/2/<model>/<method>`, `Authorization: bearer`). odoo.com = `saas~19.3`; `context_get` HTTP 200 com chave real | |

---

## Tier 1 — Criar planilha e estrutura ✅ (2026-10-06)
Feito pelo agente via MCP Google Drive/Sheets. Planilha ID `1aZaUFqrxflo6lRWzY7mWOo3j8KDrkBCVUTl4TSpBd0w`.

Resultado: fuso `America/Sao_Paulo`; 3 abas; notas em todos os cabeçalhos/rótulos; vermelho/verde na MAIN verificado (sem data → vermelho); checkboxes `MAIN!G5:G500`, `TOOLS!D2:D100`, `CONF!B8`, `CONF!B12`; dropdown `TOOLS!E2:E100`; proteções warning-only em colunas do script; linha `ORGANIZAR_GRAVACOES` pré-criada em TOOLS. Achado: locale pt_BR exige fórmulas em português com `;` ([[coding-conventions]]).

- Criar spreadsheet `BSA Toolkit` na raiz do Drive
- Abas `MAIN`, `TOOLS`, `CONF` (nesta ordem); cabeçalhos, larguras, linha congelada
- `MAIN`: bloco status `A1:B2` + fórmula + formatação condicional vermelha; tabela projetos `A4:G4` com ==cell notes== nos cabeçalhos; checkbox `Ativo` — [[main-tab]]
- `TOOLS`: tabela com dropdown `Agendamento`, checkbox `Executar`, proteção (warning-only) nas colunas de sistema — [[tools-tab]]
- `CONF`: bloco conexão `A1:B8`, parâmetros `A10:B12`, cabeçalho do log `A14:F14` — [[conf-tab]]
- Risco: zero (planilha nova). Verificar: `get_spreadsheet` mostra 3 abas + validações

## Tier 2 — Carga inicial de projetos ✅ (2026-10-06)
Resultado: 41 projetos em `MAIN!A5:G45` (GS Plast com alias `GS Plast; GS Metal Plast`); `CONF!B11` = `1aYqJa-Q5so8w2kGLr25nWgQLui_XmqUc` (pasta `Google Meet` na raiz, informada pelo usuário e confirmada via Drive).

- 41 projetos do legado em `MAIN` (42 chaves; `GS Plast` + `GS Metal Plast` viram 1 projeto com `Nome Reunião` = `GS Plast; GS Metal Plast`): `Nome` = `Nome Reunião` = chave do dicionário; `Pasta Gravação` = `https://drive.google.com/drive/folders/<id>`; `Ativo` = ✓
- `CONF!B11` = ID da pasta `Google Meet` atual (agente localiza via Drive e confirma com usuário)
- Colunas de tarefa Odoo vazias — usuário preenche
- Risco: baixo. Verificar: 41 linhas, URLs abrem

## Tier 3 — Esqueleto do Apps Script ✅ (2026-10-06)
Resultado: `clasp push` de 13 arquivos; `setup()` executado e autorizado pelo usuário; menu `BSA Toolkit` aparece; log em CONF e resultado em TOOLS gravados na 1ª execução.


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
├── services/TriggerService.gs ← criar/apagar/reconciliar gatilhos (Tier 6 — ainda não criado)
├── services/OdooClient.gs     ← auth, call(model, method, args), assertKeyFresh
└── tools/ToolRegistry.gs      ← {id, nome, descrição, handler, usaOdoo}
    tools/runTool.gs           ← wrapper: try/catch, log, atualiza TOOLS
```

- Entrega: arquivos no repo + lista para colar ([[deploy-apps-script]])
- Risco: baixo. Verificar: `node --check` em todos `.gs`; usuário cola, roda `setup()`, menu aparece

## Tier 4 — CONF: chave + teste de conexão ✅ (2026-10-06)
Resultado: colar chave em `B5` grava `B6` e testa; `B4` recebe o nome do Odoo; MAIN verde e "Olá, Victor! 👋".

- `onEdit` em `CONF!B5` → `B6 = now()` → teste automático → `B7` + log
- Checkbox `Testar conexão` (`B8`)
- Risco: médio (rede/autenticação, produção — só leitura). Verificar: teste OK com chave real; data de ontem em `B6` → MAIN vermelho

## Tier 5 — Migrar organizador de gravações 🟨 simulação rodou (0 pastas — origem vazia) — ==bloqueado: conta Google==

> [!danger] Bloqueio (2026-10-06)
> Planilha e script estão na conta `victortomazonir@gmail.com`. As pastas de destino do legado (ex: Lisco `1cX8eyjw…`, WNS `11KMDtTP…`) ==não existem/não são acessíveis== nessa conta, e a única pasta `Google Meet` dela foi criada hoje e está vazia. O legado provavelmente rodava em outra conta (ex: conta Google da Odoo). Decidir: mover toolkit para a conta certa ou compartilhar pastas.

- `tools/RecordingOrganizer.gs` conforme [[tool-organizador-gravacoes]]
- Registrar em `ToolRegistry` como `ORGANIZAR_GRAVACOES`
- ✅ `organizador-videos.gs` movido para `legacy/organizador-videos.gs`
- Risco: médio (move pastas reais do Drive). Verificar: ==primeira execução em `dryRun`== (só loga), usuário revisa, depois roda real

## Tier 6 — Agendamentos amigáveis na aba TOOLS ✅ (2026-10-06)
Resultado: `services/TriggerService.gs` + `runScheduledTool` + `onOpenInstalled`. Verificado: `Diário 18h` → `✅ Ativo ~ 06/10 18:00`; volta a `Manual` remove o gatilho. Ver [[tools-tab]].

- `TriggerService.syncTool(id)` no `onEdit` do dropdown; menu `Sincronizar agendamentos`; coluna `Próxima execução (aprox.)`
- Desativar gatilho do projeto Apps Script legado (ação manual do usuário — ⚠️ confirmar antes)
- Risco: médio. Verificar: trocar dropdown → `ScriptApp.getProjectTriggers()` reflete; execução agendada grava log com origem `Agendado`

## Tier 7 — Sincronizar projetos do Odoo + visual Odoo ✅ (2026-10-06)
- Tool `SINCRONIZAR_PROJETOS` (`tools/ProjectSync.gs`) — regra em [[project-sync-rule]]; checkbox `MAIN!F2` + menu + agendável
- `CONF!B13` = link do projeto QS (`(PS-BR) Quickstart`, id 9273); log desceu para `A15`
- MAIN: banner "Olá, <nome>! 👋", linha de última sincronização; tabela a partir da linha 6
- Identidade visual Odoo nas 3 abas — [[coding-conventions#Identidade visual Odoo]]
- Bug achado no teste: JSON-2 `limit: 0` = 0 registros → corrigido em `OdooClient.searchRead`
- Resultado real: 1ª sync `38 atualizadas (26 desativadas), 17 novas`; 2ª sync `0/0` (idempotente)

## Tier 7.1 — Ajustes de legibilidade ✅ (2026-10-06)
- Log: texto branco herdado do cabeçalho → cinza escuro; altura fixa 22 px
- MAIN: filtro só `Ativo` (22 de 58 visíveis), reaplicado pelo script
- MAIN: links cortados na largura da célula

## Tier 8 — Migrar para a conta das gravações 🟨 (2026-10-06)
Feito:
- Chave apagada do DEV; DEV compartilhado como leitor com `vito@odoo.com`
- Cópia feita pela conta Odoo → PROD `1BqGcIfE51PbA2eiG41uwU9tC_0hr-IdeXhyIHfOqkqs` (dados, visual, filtro e script vieram juntos). Primeira tentativa saiu pela conta gmail (Chrome com 2 contas) → cópia enviada à lixeira do gmail
- API do Apps Script ativada em `vito@odoo.com`; `clasp login` ==bloqueado pela TI== → deploy manual no PROD
- PROD: renomeada "BSA Toolkit"; `CONF!B11` = pasta Meet real `1J8ZTQ9iO_kSYA09albhdH_CLfbWmPlsh`

Pendente:
- Usuário autorizar o script no PROD (`setup`)
- Colar chave em `CONF!B5` do PROD; simulação do organizador; revisar; execução real
- Preencher `Nome Reunião` de projetos vindos da sync (ex: EMOB)
- Verificar gatilhos do script legado na conta Odoo
- DEV: agendamentos em `Manual` (log mostra sync "Agendado" às 17:57)

Plano original:
Decisão do usuário (2026-10-06): toolkit vai para a conta Google onde estão as gravações/pastas dos projetos.
- Pré-requisitos: conector Google Drive desta sessão na conta nova (ou planilha recriada via Chrome), API do Apps Script ativada nela, `clasp login` com ela
- Recriar planilha (estrutura + visual) e script (`clasp create-script --parentId` + restaurar manifesto + `push`)
- Copiar dados da MAIN atual (projetos + links Odoo); `CONF!B11` = pasta Meet da conta nova
- Simulação do organizador → revisar → execução real
- Desativar gatilho do script legado nessa conta

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
