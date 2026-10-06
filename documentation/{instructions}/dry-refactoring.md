---
title: DRY Refactoring — Odoo BSA Toolkit
date: 2026-10-06
tags:
  - instructions
  - refactoring
  - dry
  - claude
aliases:
  - dry
  - duplications
---

# DRY Refactoring

> **Para Claude:** Nota especialista em identificar e eliminar código duplicado. Leia antes de qualquer sessão de refatoração por duplicação.

---

**Princípio DRY:** *Don't Repeat Yourself* — se código aparece em 2+ lugares, ele pertence a um lugar só.

> [!warning] Regra obrigatória
> Nunca executar refatoração sem aprovação. Apresentar análise, aguardar ok, executar em tiers pequenos com build entre cada um.

---

## Estrutura atual — atualizada em 2026-10-06

Atualize esta seção sempre que um service/repo for criado ou uma extração for concluída. Marque arquivos removidos com `~~Nome.gs~~` e a data de remoção.

```
apps-script/
├── config/Constants.gs         ← criado 2026-10-06 — coordenadas de abas/linhas/colunas, TOOL_ID, ORIGIN, STATUS
├── sheets/
│   ├── ProjectsRepo.gs         ← criado 2026-10-06 — listActive, readAll, write, setSyncInfo, parseDriveFolderId_, parseTaskId_, parseProjectId_
│   ├── ConfRepo.gs             ← criado 2026-10-06 — ConfRepo.get/setKeyDate/setConnection/uncheckTest
│   ├── LogRepo.gs              ← criado 2026-10-06 — LogRepo.append
│   └── ToolsRepo.gs            ← criado 2026-10-06 — ToolsRepo.ensureRows/idAtRow/updateResult/uncheckRun
├── services/
│   ├── DriveService.gs         ← criado 2026-10-06 — listSubfolders, moveFolder
│   ├── MailService.gs          ← criado 2026-10-06 — sendReport
│   ├── OdooClient.gs           ← criado 2026-10-06 — call, searchRead, currentUser, taskUrl, isToday_
│   └── TriggerService.gs       ← criado 2026-10-06 — syncTool, syncAll, refreshStatuses, nextRun_
└── tools/
    ├── ToolRegistry.gs         ← criado 2026-10-06 — getToolRegistry_
    ├── runTool.gs              ← criado 2026-10-06 — runTool (lock + log + resultado + e-mail + refresh agendamentos)
    ├── ProjectSync.gs          ← criado 2026-10-06 — runProjectSync_, planProjectSync_, findRowForTask_
    └── RecordingOrganizer.gs   ← criado 2026-10-06 — runRecordingOrganizer_, findProjectForFolder_, normalizeText_
legacy/organizador-videos.gs    ← referência, não colar no editor
```

**Instruções de preenchimento:**
- Liste cada arquivo de utils/helpers com seus exports principais
- Registre a data de criação para rastreabilidade
- Documente divergências intencionais entre utils de domínios diferentes (ver seção abaixo)

---

## Duplicações resolvidas

Histórico de extrações concluídas — função/componente extraído, arquivos de origem, data.
Consultar e atualizar em: [[dry-refac-duplications-solved]]

---

## Divergências intencionais — NÃO compartilhadas

Código que PARECE duplicado mas é intencional manter separado. Registrar antes de qualquer audit para evitar que o agente "corrija" decisões de design deliberadas.
Consultar e atualizar em: [[dry-refac-intentionals-devergencies]]

---

## Pendências de extração

Duplicações identificadas ainda não extraídas — aguardando aprovação ou desbloqueio.
Consultar e atualizar em: [[dry-refac-extraction-pendings]]

---

## Prompt de audit periódico — DRY

```
Identifique padrões de código duplicados no projeto.
Procure por funções, componentes ou blocos de código que aparecem
em vários lugares, com pouca ou nenhuma alteração.

Sugira refatorações para criar componentes reutilizáveis, hooks
personalizados ou funções utilitárias — seguindo DRY.

Também revise organização de pastas e arquivos para estrutura profissional.
Não execute nada sem aprovação.
```

---

Ver também: [[dead-code-audit]] | [[coding-conventions]] | [[project-overview]]
