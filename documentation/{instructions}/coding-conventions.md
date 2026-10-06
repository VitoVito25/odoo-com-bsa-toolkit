---
title: Coding Conventions — Odoo BSA Toolkit
date: 2026-10-06
tags:
  - instructions
  - conventions
  - standards
  - claude
aliases:
  - code-standards
  - dev-guidelines
---

# Coding Conventions

> **Para Claude:** Nota especialista em padrões de escrita de código. Define nomenclatura, estrutura de arquivo, estado, performance e comentários. Leia antes de escrever qualquer código novo.

---

> *"Menos é mais — mas ainda funciona."*

---

## Nomenclatura

Google Apps Script (runtime V8, JavaScript ES2019+). Todos os arquivos `.gs` compartilham ==escopo global único== — nomes precisam ser únicos no projeto inteiro.

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Arquivo | `PascalCase.gs` + sufixo de camada | `ProjectsRepo.gs`, `OdooClient.gs`, `RecordingOrganizer.gs` |
| Módulo (namespace) | objeto `PascalCase` igual ao arquivo | `const ProjectsRepo = { listActive() {...} }` |
| Função pública (menu/trigger/handler) | `camelCase`, verbo | `runRecordingOrganizer`, `testOdooConnection` |
| Função privada | `camelCase` + sufixo `_` (oculta do menu Executar e de `google.script.run`) | `findProjectForFolder_` |
| Constantes | `UPPER_SNAKE_CASE` | `SHEET_MAIN`, `LOG_MAX_ROWS` |
| ID de tool | `UPPER_SNAKE_CASE` | `ORGANIZAR_GRAVACOES` |
| Chave de Properties | `kebab:escopo` | `odoo:api-key`, `trigger:ORGANIZAR_GRAVACOES` |
| Texto de UI / log | português | `"⚠️ PENDENTE: sem correspondência"` |

---

## Estrutura de arquivo

```js
// 1. Constantes locais do módulo (globais vão em config/Constants.gs)
// 2. Namespace do módulo: const NomeModulo = { ... }
// 3. Funções públicas (entry points de menu/trigger) — só em Main.gs e tools/
// 4. Funções privadas com sufixo _
```

---

## Estado

| Situação | Onde guardar |
|----------|-------------|
| Dados editáveis pelo usuário (projetos, agendamentos, conexão) | Planilha — lida via `*Repo.gs` |
| Chave API Odoo (runtime) | Célula `CONF!B5` — decisão do usuário, risco aceito ([[conf-tab]]). Ler via `ConfRepo`, `trim()`, ==nunca escrever no log== |
| Chave API Odoo (testes locais do agente) | `.env` na raiz — ignorado pelo git |
| Outros segredos | `PropertiesService.getUserProperties()` |
| Metadados internos (IDs de gatilho) | `PropertiesService.getScriptProperties()` |
| Cache curto (uid Odoo da sessão) | `CacheService.getUserCache()` (máx. 6h) |
| Histórico de execuções | Aba `CONF` via `LogRepo` |

---

## Performance

Ver checklist completo em [[performance-audit]]. Regras base:
- Ler/escrever planilha em ==lote== (`getValues`/`setValues` de range inteiro) — nunca célula a célula em loop
- Execução máxima 6 min (contas consumer) — tools longas devem processar em lotes e retomar
- Agrupar chamadas Odoo (`search_read` com lista de IDs) em vez de 1 chamada por item

---

## Comentários no código

- Comentar só o **porquê**, nunca o **o quê**
- TODOs com contexto: `// TODO: [motivo] — [quando será resolvido]`
- Não deixar código comentado sem explicação — ou remove, ou documenta motivo

---

## Reutilização — padrão visual da planilha

Antes de criar formato novo na planilha (cor, emoji de status, dropdown, checkbox):

1. Procurar padrão existente nas abas MAIN/TOOLS/CONF
2. Match exato → reutilizar
3. Match parcial → perguntar ao usuário
4. Nenhum match → criar e registrar aqui

Padrões estabelecidos:
- Status: `✅` sucesso · `⚠️` pendência/aviso · `❌` erro · `⏸` manual
- Cabeçalho: negrito, fundo cinza claro, linha congelada, cell note explicativa
- Vermelho (`#F4C7C3`) = ação necessária do usuário

> [!warning] Nunca criar variante inline silenciosa
> Cor ou emoji diferente do padrão quebra a leitura rápida do status. Confirmar antes de divergir.

---

## O que NÃO fazer

- Não adicionar features, abstrações ou refatorações além do que a tarefa pede
- Não criar error handling para cenários impossíveis — mas ==todo item de lote== (pasta, tarefa) tem try/catch próprio para um erro não abortar o resto
- Não hardcodar IDs de pasta, tarefa ou URL — vêm da planilha
- Não escrever docstrings multi-linha — no máximo uma linha curta

---

## Stack técnica

| Decisão | Padrão |
|---------|--------|
| Runtime | Google Apps Script V8, container-bound na planilha |
| Interface | Google Sheets (abas MAIN / TOOLS / CONF), menu customizado `BSA Toolkit` |
| Serviços Google | `SpreadsheetApp`, `DriveApp`, `MailApp`, `ScriptApp` (gatilhos), `PropertiesService`, `CacheService` |
| Integração Odoo | `UrlFetchApp` → API JSON-2 do odoo.com (`POST /json/2/<model>/<method>`, `Authorization: bearer <chave>`, body = kwargs nomeados). Produção |
| Deploy | Cópia manual de `apps-script/` para o editor — [[deploy-apps-script]] |
| Testes | `node --check` (sintaxe) + execução manual com `dryRun` — ver [[ai-best-practices#13. Testing Policy]] |
| Dependências externas | Nenhuma (sem bibliotecas Apps Script) |

---

Ver também: [[dead-code-audit]] | [[dry-refactoring]] | [[project-overview]]
