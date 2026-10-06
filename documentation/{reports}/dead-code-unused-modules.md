---
title: Dead Code — Componentes e Módulos Não Utilizados
date: YYYY-MM-DD
tags:
  - reports
  - dead-code
  - audit
aliases:
  - unused-modules
---

# Componentes e Módulos Nunca Utilizados

Exportados que não aparecem em nenhum `import` ativo no projeto.

> [!warning] Cuidado com falsos positivos
> Ferramentas de análise de imports podem reportar falsos positivos em:
> - Componentes de UI scaffolded reservados para uso futuro
> - Arquivos que são importados dinamicamente
> - Entry points que não aparecem em imports mas são usados pelo bundler

---

## Falsos positivos conhecidos

> **[COMO PREENCHER]** — Após o primeiro audit, liste aqui os arquivos confirmados como falso positivo. Exemplo: `src/components/ui/accordion.tsx` — instalado pelo shadcn, reservado para uso futuro.

| Arquivo | Motivo do falso positivo |
|---------|--------------------------|
| `[caminho/arquivo]` | [ex: Scaffolded pelo shadcn — reservado para uso futuro] |

---

## Módulos confirmados como dead code

> **[COMO PREENCHER]** — Liste os módulos confirmados para remoção após análise. Risco: Baixo = sem dependentes; Médio = dependentes internos; Alto = pode afetar bundler/entry point.

| Arquivo | Exporta | Risco de remoção | Status |
|---------|---------|-----------------|--------|
| `[caminho/arquivo]` | `[NomeDaExportação]` | Baixo / Médio / Alto | Pendente / Removido |

---

Ver também: [[dead-code-audit]] | [[dead-code-audit-report]] | [[dead-code-todos]]
