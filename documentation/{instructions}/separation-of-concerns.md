---
title: Separation of Concerns — Odoo BSA Toolkit
date: 2026-10-06
tags:
  - instructions
  - architecture
  - layered
  - claude
aliases:
  - soc
  - layered-architecture
---

# Separation of Concerns

> **Para Claude:** Nota especialista em separação de responsabilidades. Leia antes de qualquer sessão de refatoração arquitetural.

---

> [!warning] Regra obrigatória
> **Nunca executar refatoração sem aprovação explícita do usuário.** Mudanças de arquitetura afetam múltiplos arquivos — apresentar plano completo antes de executar qualquer linha.

> [!important] Workflow de execução — mudanças grandes e complexas
> Quando a refatoração envolve múltiplos arquivos ou tiers:
> 1. Apresentar plano completo (arquivos, tiers, estimativas de linhas)
> 2. Aguardar aprovação explícita
> 3. Executar **um tier de cada vez**
> 4. Retornar ao usuário após cada tier para validação
> 5. Aguardar "ok" antes de avançar ao próximo tier

---

## O que verificar

### 1. Coordenadas de planilha fora dos repos
`getRange("B5")`, índices de coluna ou nomes de aba fora de `sheets/*Repo.gs` / `config/Constants.gs`. Mover a planilha de lugar deve exigir mudança só nesses arquivos.

### 2. Regra de negócio em services ou repos
Decisão de domínio (qual projeto casa com qual pasta, se chave está vencida) dentro de `DriveService`/`OdooClient`/`*Repo`. Services só executam I/O; repos só traduzem linhas ↔ objetos.

### 3. Tool chamando API Google/Odoo direto
`DriveApp.*`, `UrlFetchApp.*`, `ScriptApp.*` dentro de `tools/`. Deve passar por `services/`.

### 4. Entry point fazendo trabalho
Funções de menu/trigger em `Main.gs` com lógica além de rotear para `runTool(id)`.

---

## Padrão do projeto — camadas

```
Main.gs                    ← entry points: onOpen, onEditInstalled, funções de menu → só roteiam
    ↓
tools/runTool.gs           ← wrapper: try/catch, log, atualiza linha em TOOLS
    ↓
tools/<Tool>.gs            ← regra de negócio da tool; recebe ctx {dryRun, origin}
    ↓ objetos JS            ↓ chamadas
sheets/*Repo.gs            services/*.gs
(planilha ↔ objetos)       (DriveApp, MailApp, ScriptApp, UrlFetchApp/Odoo)
```

- Funções puras de decisão (ex: `findProjectForFolder_`) ficam na tool e não recebem objetos `Folder`/`Range` — só strings/objetos → testáveis
- `config/Constants.gs` é a única fonte de nomes de aba, linhas e colunas

---

## Resultados do audit

> Resultados registrados em [[separation-of-concerns-report]] — não armazenar aqui.

---

## Prompt de audit periódico

```
Examine apps-script/ e identifique onde a separação de camadas pode ser melhorada:
1. Coordenadas de planilha (ranges, colunas, nomes de aba) fora de sheets/ e config/
2. Regras de negócio dentro de services/ ou sheets/
3. Chamadas DriveApp/UrlFetchApp/ScriptApp dentro de tools/
4. Entry points em Main.gs com lógica além de roteamento

Sugira refatorações. Não execute nada sem aprovação do usuário.
```

---

Ver também: [[coding-conventions]] | [[performance-audit]] | [[dry-refactoring]]
