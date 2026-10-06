---
title: DRY — Divergências Intencionais
date: 2026-10-06
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

| Item | Arquivo divergente | Motivo da divergência |
|------|--------------------|----------------------|
| `matchesWholeTerm_` vs `matchesTaskTerm_` | `tools/RecordingOrganizer.gs` / `tools/ProjectSync.gs` | Gravações exigem palavra inteira sempre (títulos livres de reunião); sincronização aceita prefixo para termos ≥ 5 chars ("passaporte" → "Passaportes Poloneses") e ignora `<>`. Unificar quebraria um dos dois casos. |

> [!note] Por que documentar divergências intencionais?
> Sem este registro, o agente (ou outro dev) pode tentar unificar código que parece duplicado mas tem diferenças sutis e intencionais. O registro protege decisões de design.

---

Ver também: [[dry-refactoring]] | [[dry-refac-duplications-solved]] | [[dry-refac-extraction-pendings]]
