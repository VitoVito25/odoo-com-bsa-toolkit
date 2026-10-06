---
title: Papéis das tarefas Odoo por projeto
date: 2026-10-06
tags:
  - business-rule
  - odoo
  - project
---

# Papéis das tarefas Odoo por projeto

## Definição
Cada projeto em [[main-tab]] referencia até ==três tarefas== (`project.task`) no odoo.com, cada uma com papel fixo:

| Tarefa | Papel | Quem escreve |
|--------|-------|--------------|
| `Tarefa QS Principal` | Tarefa-mãe do projeto (Quick Start) — escopo, status, horas | BSA |
| `Tarefa de Comunicação` | Toda comunicação com o cliente (e-mails, chatter) | BSA / cliente |
| `Tarefa de LOG` | Resumos de reunião e documentação gerados pela IA | ==Somente automações== |

## Contexto
Separar LOG da comunicação evita poluir o histórico com o cliente com mensagens automáticas e dá um único lugar para a IA documentar o projeto.

## Comportamento por cenário
- Tool de resumo de reunião (backlog) posta **apenas** na `Tarefa de LOG` via `message_post` (nota interna).
- Campo vazio → tool que precisa daquela tarefa pula o projeto e loga `⚠️ sem tarefa de LOG`.

## Exemplos
URL colada: `https://www.odoo.com/odoo/project/123/tasks/456789` → script extrai ID `456789` (último número da URL). Formato legado `.../web#id=456789&model=project.task` também suportado.

## Impacto no código
`apps-script/sheets/ProjectsRepo.gs` → `parseTaskId_(url)` (planejado).

## Relacionado
- [[main-tab]]
- [[odoo-api-key-rotation]]
