---
title: DRY — Divergências Intencionais
date: YYYY-MM-DD
tags:
  - reports
  - dry
  - refactoring
---

# Divergências Intencionais — NÃO compartilhadas

> **[COMO PREENCHER]**
> Documente aqui casos onde código PARECE duplicado mas é intencional manter separado.
> Isso evita que o agente "corrija" uma divergência que foi uma decisão deliberada.
>
> | Item | Arquivo divergente | Motivo da divergência |
> |------|--------------------|----------------------|
> | `[nome]` | `[arquivo]` | `[ex: threshold diferente, design distinto, tipo incompatível]` |

> [!note] Por que documentar divergências intencionais?
> Sem este registro, o agente (ou outro dev) pode tentar unificar código que parece duplicado mas tem diferenças sutis e intencionais. O registro protege decisões de design.

---

Ver também: [[dry-refactoring]] | [[dry-refac-duplications-solved]] | [[dry-refac-extraction-pendings]]
