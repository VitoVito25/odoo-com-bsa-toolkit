---
title: Vault Structure
date: YYYY-MM-DD
tags:
  - general
  - vault
  - structure
aliases:
  - vault-index
  - documentation-structure
---

# Vault Structure

Mapa completo do vault `documentation/`. Referência para o agente ao criar notas novas.

---

## Estrutura de pastas

```
documentation/
├── {general}/                        → overviews, índices, entry points por módulo
│   └── vault-structure.md            → este arquivo — mapa do vault
│
├── {instructions}/                          → protocolos de audit carregados por sessão (manter lean)
│   ├── ai-best-practices.md          → contrato de comportamento do agente
│   ├── coding-conventions.md         → nomenclatura, estrutura, stack
│   ├── dry-refactoring.md            → protocolo DRY e rastreamento de utils
│   ├── separation-of-concerns.md     → padrão container/presentational
│   ├── dead-code-audit.md            → identificação e remoção de código morto
│   └── performance-audit.md          → checklist de otimizações
│
├── {reports}/                        → resultados de audits (carregar sob demanda)
│   ├── dry-refac-duplications-solved.md
│   ├── dry-refac-extraction-pendings.md
│   ├── dry-refac-intentionals-devergencies.md
│   ├── separation-of-concerns-report.md
│   ├── dead-code-audit-report.md
│   ├── dead-code-todos.md
│   └── performace-audit-report.md
│
├── {instructions}/                   → meta-docs e instruções para o agente
│
├── {info}/                           → regras de negócio, glossário, contexto de domínio
│
└── {page}/                           → documentação por página / tela / view do produto
```

> **[COMO PREENCHER]**
> Atualize este arquivo sempre que adicionar novas pastas ou notas estruturais ao vault. Adicione módulos de `{page}` e `{info}` conforme o projeto crescer.

---

## Convenção de prefixos

| Prefixo | Propósito | Carregado por sessão? |
|---------|-----------|----------------------|
| `{general}` | Overviews, índices, entry points | Sob demanda |
| `{instructions}` | Protocolos de audit e contratos de comportamento | **Sim — toda sessão** |
| `{reports}` | Resultados de execução dos tools | Sob demanda |
| `{instructions}` | Meta-docs e instruções ao agente | Sob demanda |
| `{info}` | Regras de negócio, glossário, contexto | Sob demanda |
| `{page}` | Documentação de páginas/telas/views | Sob demanda |

> [!warning] `{instructions}` sempre lean
> Notas em `{instructions}` são carregadas em toda sessão — não armazenar resultados aqui. Resultados vão em `{reports}`.

---

## Regra de pareamento tools → reports

Cada nota de tool tem um arquivo report correspondente:

| Tool | Report |
|------|--------|
| `{instructions}/dry-refactoring.md` | `{reports}/dry-refac-*.md` |
| `{instructions}/separation-of-concerns.md` | `{reports}/separation-of-concerns-report.md` |
| `{instructions}/dead-code-audit.md` | `{reports}/dead-code-audit-report.md` + `dead-code-todos.md` |
| `{instructions}/performance-audit.md` | `{reports}/performace-audit-report.md` |

---

## Onde criar notas novas

| Tipo de conteúdo | Pasta |
|------------------|-------|
| Nova página / tela / view | `{page}/[nome].md` |
| Nova regra de negócio | `{info}/[nome].md` |
| Novo protocolo de audit | `{instructions}/[nome].md` + criar par em `{reports}/` |
| Resultado de audit | `{reports}/[tool-name]-report.md` |
| Overview de módulo | `{general}/[modulo].md` |
| Instrução ao agente | `{instructions}/[nome].md` |

---

## Relacionado

- [[ai-best-practices]] — contrato de comportamento do agente
- [[coding-conventions]] — padrões de código do projeto
