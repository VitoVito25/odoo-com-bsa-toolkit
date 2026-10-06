---
title: Performance Audit — Odoo BSA Toolkit
date: 2026-10-06
tags:
  - instructions
  - performance
  - optimization
  - claude
aliases:
  - perf-audit
  - performance
---

# Performance Audit

> **Para Claude:** Nota especialista em identificar e corrigir problemas de performance e cotas do Apps Script. Leia antes de qualquer sessão de otimização.

---

> [!warning] Regra obrigatória
> **Nunca aplicar otimizações sem aprovação explícita do usuário.** Apresentar lista com impacto estimado, aguardar confirmação, executar em lotes pequenos.

---

## O que verificar

### 1. Acesso à planilha célula a célula
`getValue`/`setValue`/`getRange` dentro de loop. Cada chamada é uma ida ao servidor (~50–200 ms).

**Fix:** um `getValues()` do range inteiro, processar em memória, um `setValues()`.

### 2. Limite de 6 minutos por execução
Tools que iteram muitas pastas/tarefas podem estourar.

**Sinal:** `Exceeded maximum execution time` no log. **Fix:** checar tempo decorrido, salvar cursor em `ScriptProperties`, reagendar continuação.

### 3. Chamadas Odoo uma a uma
`UrlFetchApp.fetch` por item em loop. **Fix:** `search_read` com domínio `[('id','in',ids)]`; `UrlFetchApp.fetchAll` para requisições independentes. Cota: 20 000 fetch/dia (consumer).

### 4. Leituras Odoo repetidas
Mesmo `read`/`search_read` chamado várias vezes por execução (ex: `context_get` antes de cada chamada). **Fix:** memoizar por execução; JSON-2 não precisa de passo de autenticação.

### 5. Iteração de Drive desnecessária
`getFolderById` repetido para o mesmo destino; busca por nome (`getFoldersByName`) em toda execução. **Fix:** memoizar por execução; preferir ID salvo.

### 6. Gatilhos em excesso
Gatilho de tempo mais frequente que o necessário consome cota de runtime (90 min/dia consumer). **Fix:** frequência mínima útil; tool sai cedo se não há trabalho.

### 7. Log crescendo sem limite
Aba CONF com milhares de linhas deixa a planilha lenta. **Fix:** `LogRepo` corta em `LOG_MAX_ROWS` (1000).

---

## Prompt de audit periódico

```
Analise apps-script/ e identifique problemas de performance e cota:
1. getValue/setValue/getRange dentro de loops
2. Tools que podem passar de 6 minutos
3. UrlFetchApp em loop sem batch/fetchAll
4. Leituras Odoo repetidas na mesma execução
5. Chamadas DriveApp repetidas para o mesmo recurso
6. Gatilhos com frequência maior que o necessário
7. Crescimento sem limite de abas de log

Sugira melhorias com impacto estimado. Não execute nada sem aprovação do usuário.
```

---

## Resultados

> Registre os resultados de cada audit em [[performace-audit-report]], não aqui.

---

Ver também: [[coding-conventions]] | [[dry-refactoring]] | [[performace-audit-report]]
