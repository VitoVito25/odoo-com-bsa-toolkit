---
title: Odoo BSA Toolkit — Visão Geral
date: 2026-10-06
tags:
  - general
  - overview
  - apps-script
aliases:
  - project-overview
  - bsa-toolkit
---

# Odoo BSA Toolkit — Visão Geral

## O que é
Google Sheet + Apps Script (container-bound) que funciona como ==kit de ferramentas do BSA==. A planilha é a interface: cadastro de projetos, catálogo de tools com agendamento e configuração da conexão com o Odoo (odoo.com). O script automatiza tarefas repetitivas entre Google Drive/Gmail/Meet e as tarefas de projeto no Odoo.

## Para quem
BSA (Business Solution Analyst) da Odoo que conduz vários projetos de implantação em paralelo. Uso individual — uma planilha por BSA, script roda com a conta do próprio usuário.

## Problema que resolve
- Gravações do Meet caem todas numa pasta de origem → precisam ir para a pasta de cada cliente
- Mapeamento cliente → pasta estava ==hardcoded== no script ([[tool-organizador-gravacoes]])
- Comunicação/documentação de projeto vive em tarefas do Odoo — automações precisam saber qual tarefa usar por projeto ([[odoo-task-roles]])

## Abas da planilha

| Aba | Função | Nota |
|-----|--------|------|
| `MAIN` | Status da chave API + cadastro de projetos | [[main-tab]] |
| `TOOLS` | Catálogo de tools, execução manual e agendamento | [[tools-tab]] |
| `CONF` | Conexão Odoo, chave API, log de execuções | [[conf-tab]] |

## Arquitetura

```
Planilha (UI + dados)          ← usuário edita MAIN / TOOLS / CONF
    ↓ leitura/escrita via repos
apps-script/sheets/*Repo.gs    ← único lugar que conhece linhas/colunas
    ↓ objetos JS simples
apps-script/tools/*.gs         ← orquestração de cada tool (regra de negócio)
    ↓ chamadas
apps-script/services/*.gs      ← DriveApp, MailApp, ScriptApp, UrlFetchApp (Odoo)
```

Detalhes do padrão em [[separation-of-concerns]]. Convenções em [[coding-conventions]]. Código é copiado manualmente para o editor — [[deploy-apps-script]].

> [!danger] Produção
> odoo.com é produção. Escritas na API exigem aprovação — ver [[ai-best-practices#Odoo é produção]].

## Tools

| Tool | Status | Nota |
|------|--------|------|
| Organizar gravações Meet | Legado hardcoded → migrar | [[tool-organizador-gravacoes]] |
| Testar conexão Odoo | Planejado | [[conf-tab]] |
| Sincronizar agendamentos | Planejado | [[tools-tab]] |

## Regras de negócio
- [[odoo-api-key-rotation]] — chave diária, sinalização em vermelho
- [[recording-routing-rule]] — como uma gravação é associada a um projeto
- [[odoo-task-roles]] — papel de cada tarefa Odoo do projeto

## Plano de implementação
Ver [[implementation-plan]].
