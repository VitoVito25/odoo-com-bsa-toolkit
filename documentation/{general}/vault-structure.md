---
title: Vault Structure
date: 2026-10-06
tags:
  - general
  - vault
  - structure
aliases:
  - vault-index
  - documentation-structure
---

# Vault Structure

Mapa completo do vault `documentation/`. Referência para o agente ao criar notas novas. Ponto de entrada do projeto: [[project-overview]].

---

## Estrutura de pastas

```
documentation/
├── {general}/                          → overviews, índices, entry points
│   ├── vault-structure.md              → este arquivo — mapa do vault
│   ├── project-overview.md             → o que é o toolkit, abas, arquitetura, tools
│   ├── tool-organizador-gravacoes.md   → tool de gravações Meet (legado + alvo)
│   └── deploy-apps-script.md           → como colar o código no editor
│
├── {instructions}/                     → protocolos carregados TODA sessão (manter lean)
│   ├── ai-best-practices.md            → contrato de comportamento do agente
│   ├── coding-conventions.md           → nomenclatura, estrutura, stack Apps Script
│   ├── dry-refactoring.md              → protocolo DRY e estrutura de services/repos
│   ├── separation-of-concerns.md       → camadas Main → tools → sheets/services
│   ├── dead-code-audit.md              → identificação e remoção de código morto
│   └── performance-audit.md            → checklist de performance e cotas Apps Script
│
├── {page}/                             → uma nota por aba da planilha
│   ├── main-tab.md                     → MAIN: status da chave + projetos
│   ├── tools-tab.md                    → TOOLS: catálogo, execução, agendamentos
│   └── conf-tab.md                     → CONF: conexão Odoo, chave, log
│
├── {info}/                             → regras de negócio
│   ├── odoo-api-key-rotation.md        → chave diária, sinalização vermelha
│   ├── recording-routing-rule.md       → gravação → projeto
│   ├── odoo-task-roles.md              → QS Principal / Comunicação / LOG
│   └── project-sync-rule.md            → sincronização de projetos com o Odoo
│
└── {reports}/                          → resultados e planos (carregar sob demanda)
    ├── implementation-plan.md          → plano em tiers + decisões pendentes
    ├── dry-refac-duplications-solved.md
    ├── dry-refac-extraction-pendings.md
    ├── dry-refac-intentionals-devergencies.md
    ├── separation-of-concerns-report.md
    ├── dead-code-audit-report.md
    ├── dead-code-todos.md
    ├── dead-code-unused-modules.md
    └── performace-audit-report.md
```

> [!note] Manutenção
> Atualize este arquivo sempre que adicionar notas estruturais. Nova aba → `{page}`; nova tool → `{general}/tool-*.md`; nova regra → `{info}`.

---

## Convenção de prefixos

| Prefixo | Propósito | Carregado por sessão? |
|---------|-----------|----------------------|
| `{general}` | Overviews, índices, documentação de tools | Sob demanda |
| `{instructions}` | Protocolos de audit e contratos de comportamento | **Sim — toda sessão** |
| `{reports}` | Resultados de execução dos audits, planos | Sob demanda |
| `{info}` | Regras de negócio, glossário, contexto | Sob demanda |
| `{page}` | Documentação de abas da planilha | Sob demanda |

> [!warning] `{instructions}` sempre lean
> Notas em `{instructions}` são carregadas em toda sessão — não armazenar resultados aqui. Resultados vão em `{reports}`.

---

## Regra de pareamento tools → reports

| Tool | Report |
|------|--------|
| `{instructions}/dry-refactoring.md` | `{reports}/dry-refac-*.md` |
| `{instructions}/separation-of-concerns.md` | `{reports}/separation-of-concerns-report.md` |
| `{instructions}/dead-code-audit.md` | `{reports}/dead-code-audit-report.md` + `dead-code-todos.md` + `dead-code-unused-modules.md` |
| `{instructions}/performance-audit.md` | `{reports}/performace-audit-report.md` |

---

## Onde criar notas novas

| Tipo de conteúdo | Pasta |
|------------------|-------|
| Nova aba da planilha | `{page}/[aba]-tab.md` |
| Nova tool do script | `{general}/tool-[nome].md` |
| Nova regra de negócio | `{info}/[nome].md` |
| Novo protocolo de audit | `{instructions}/[nome].md` + par em `{reports}/` |
| Resultado de audit / plano | `{reports}/[nome]-report.md` |

---

## Relacionado

- [[project-overview]] — entry point do projeto
- [[ai-best-practices]] — contrato de comportamento do agente
- [[coding-conventions]] — padrões de código do projeto
