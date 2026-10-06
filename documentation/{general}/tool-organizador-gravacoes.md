---
title: Tool — Organizar gravações Meet
date: 2026-10-06
tags:
  - general
  - tool
  - drive
  - meet
aliases:
  - organizador-videos
  - ORGANIZAR_GRAVACOES
---

# Tool — Organizar gravações Meet

## O que faz
Varre a ==pasta de origem== (ID em `CONF!B11`) e move cada pasta de reunião para a `Pasta Gravação` do projeto correspondente. Regra de associação em [[recording-routing-rule]].

## Legado
Arquivo: `legacy/organizador-videos.gs` (referência — não colar no editor novo). Função única `organizarGravacoesMeet()`.

### Análise do legado

| # | Achado | Linha | Resolução (decisões 2026-10-06) |
|---|--------|-------|---------------------------------|
| 1 | Mapeamento nome → ID de pasta ==hardcoded== (42 entradas) | `organizador-videos.gs:3-46` | Projetos vêm de [[main-tab]] |
| 2 | Primeiro match ganha, ordem do objeto | `:68-69` | Termo mais longo vence se contém os outros; senão pendente `⚠️ ambíguo` |
| 3 | Substring minúscula sobre nome do projeto | `:69` | Coluna `Nome Reunião`; termo inteiro normalizado ([[recording-routing-rule]]) |
| 4 | `getFoldersByName('Google Meet')` usa só a 1ª pasta com esse nome | `:50-55` | ID da pasta de origem em `CONF!B11` |
| 5 | `getFolderById` sem try/catch | `:71` | try/catch por pasta; erro não aborta o lote |
| 6 | Só processa subpastas; arquivos soltos ignorados | `:58` | ==Mantido== — só pastas por enquanto |
| 7 | `GS Plast` e `GS Metal Plast` → mesmo ID | `:8`, `:34` | Intencional (mesmo cliente) — manter |
| 8 | Log só por e-mail | `:98-111` | Log em [[conf-tab]]; e-mail opcional (`CONF!B12`) |
| 9 | Pasta de origem não encontrada → só `console.log` | `:115` | `❌` no log + linha em [[tools-tab]] |

## Implementação atual (2026-10-06)
`apps-script/tools/RecordingOrganizer.gs` — `runRecordingOrganizer_(ctx)`, chamada via `runTool()`:
1. `ConfRepo.get()` → `sourceFolderId`, `sendEmail`
2. `ProjectsRepo.listActive()` → projetos com `Nome Reunião` e `Pasta Gravação`
3. `DriveService.listSubfolders(sourceFolderId)`
4. Para cada pasta: `findProjectForFolder_(name, projects)` → 0, 1 ou N matches
5. 1 match → `DriveService.moveFolder()` (try/catch por item; `ctx.dryRun` só loga)
6. Resultado → `LogRepo.append()` + linha em [[tools-tab]]; se `sendEmail` → `MailApp`

Como rodar:
- Menu `BSA Toolkit → Organizar gravações — simulação` → `dryRun`, só loga `🔎 MOVERIA`
- Menu `BSA Toolkit → Organizar gravações — executar` → pede confirmação e move
- Checkbox `Executar` na linha `ORGANIZAR_GRAVACOES` da aba TOOLS → move ==sem confirmação==
- `LockService` impede duas execuções simultâneas

Agendamento sugerido (Tier 6): `A cada hora` via [[tools-tab]].

## Relacionado
- [[recording-routing-rule]]
- [[main-tab]]
- [[deploy-apps-script]]
- [[implementation-plan]]
