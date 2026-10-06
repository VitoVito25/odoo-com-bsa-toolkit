---
title: Performance Audit — [NOME DO PROJETO]
date: YYYY-MM-DD
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

> **Para Claude:** Nota especialista em identificar e corrigir problemas de performance. Leia antes de qualquer sessão de otimização.

---

> [!warning] Regra obrigatória
> **Nunca aplicar otimizações sem aprovação explícita do usuário.** Apresentar lista com impacto estimado, aguardar confirmação, executar em lotes pequenos.

---

## O que verificar

> **[COMO PREENCHER]**
> As seções abaixo cobrem problemas comuns de performance em projetos React/frontend.
> Remova ou substitua seções que não se aplicam à stack do projeto.
> Adicione categorias específicas da stack (ex: N+1 queries para backend, bundle splitting para frontend).

### 1. Componentes — memoização desnecessária de renders
Candidatos: componentes que recebem as mesmas props mas re-renderizam por causa do pai.
- Subcomponentes puros definidos fora do componente pai
- Componentes de lista (itens de tabela, cards)
- Componentes de badge/ícone usados muitas vezes por render

**Sinal de problema:** componente renderiza toda vez que o pai atualiza state não relacionado ao filho.

### 2. Handlers — callbacks recriados a cada render
Candidatos: funções passadas como props ou usadas em deps de effects.
- Handlers de eventos definidos inline
- Funções que dependem de state/props e são passadas para filhos

**Sinal de problema:** filho usa memoização mas ainda re-renderiza — handler inline cria nova referência a cada render do pai.

### 3. Cálculos pesados — sem memoização
Candidatos: derivações de dados que rodam em toda renderização.
- Agregações de arrays grandes (sum, filter, reduce, sort)
- Combinação de múltiplos datasets
- Formatação/transformação de dados para gráficos

**Sinal de problema:** cálculo lento sem cache = recalcula em todo re-render, mesmo quando deps não mudaram.

### 4. Listas grandes — sem virtualização
Candidatos: listas com 50+ itens visíveis simultaneamente.

**Sinal de problema:** scroll lento, frames dropped ao renderizar lista grande.

### 5. Assets não otimizados
- Imagens sem dimensões explícitas (causam layout shift)
- Imagens grandes carregadas sem lazy loading
- Assets sem compressão / formato moderno (WebP, AVIF)

### 6. Queries de banco — N+1 e falta de índices

> **[COMO PREENCHER]**
> Se o projeto tem backend com banco de dados, adicione verificações específicas:
> - N+1 queries (loop que faz query por item)
> - Queries sem índice em colunas filtradas frequentemente
> - Joins desnecessários / dados não usados retornados

---

## Prompt de audit periódico

```
Identifique problemas de performance e oportunidades de otimização. Procure por:
1. Componentes que renderizam frequentemente sem necessidade
2. Funções recriadas em cada renderização
3. Cálculos pesados sem cache/memoização
4. Listas grandes sem virtualização
5. Assets não otimizados (imagens, fontes, scripts)
6. Queries de banco sem índice ou com N+1

Sugira melhorias concretas para cada problema encontrado,
explicando o impacto estimado na performance.
Não execute nada sem aprovação do usuário.
```

---

## Resultados

> Registre os resultados de cada audit em [[performace-audit-report]], não aqui.
> Mantém este arquivo pequeno e reduz consumo de tokens por sessão.

---

Ver também: [[coding-conventions]] | [[dry-refactoring]] | [[performace-audit-report]]
