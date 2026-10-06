---
title: Separation of Concerns — [NOME DO PROJETO]
date: YYYY-MM-DD
tags:
  - instructions
  - architecture
  - container-presentational
  - claude
aliases:
  - soc
  - container-pattern
---

# Separation of Concerns

> **Para Claude:** Nota especialista em separação de lógica e apresentação. Leia antes de qualquer sessão de refatoração arquitetural.

---

> [!warning] Regra obrigatória
> **Nunca executar refatoração sem aprovação explícita do usuário.** Mudanças de arquitetura afetam múltiplos arquivos — apresentar plano completo antes de executar qualquer linha.

> [!important] Workflow de execução — mudanças grandes e complexas
> Quando a refatoração envolve múltiplos arquivos ou tiers:
> 1. Apresentar plano completo (arquivos, tiers, estimativas de linhas)
> 2. Aguardar aprovação explícita
> 3. Executar **um tier de cada vez**
> 4. Retornar ao usuário após cada tier para validação
> 5. Aguardar "ok" antes de avançar ao próximo tier
>
> Nunca encadear todos os tiers automaticamente. O usuário precisa confirmar que nada quebrou entre cada etapa.

---

## O que verificar

### 1. Business logic em componentes de UI
Regras de negócio (cálculos, filtros, validações) embutidas diretamente no template/JSX ou em componentes de apresentação pura.

### 2. Chamadas de API em componentes de apresentação
Acesso a banco/API dentro de componentes que deveriam só receber dados como props/parâmetros.

### 3. Componentes container/presentational misturados
Um componente único fazendo: fetch → transformação → renderização. Deveria ser: hook/container faz fetch+transform, componente recebe dados e renderiza.

---

## Padrão recomendado para este projeto

> **[COMO PREENCHER]**
> Descreva aqui o padrão arquitetural adotado no projeto. O exemplo abaixo é para React com custom hooks.
> Adapte para a stack real: Vue (composables), Angular (services), backend (repository pattern), etc.

```
[useNomeDoRecursoData()]   ← custom hook/service: fetch + parse + memoize
    ↓ dados
[NomeDoRecursoPage]        ← container: orquestra estado de UI (filtros, sort, expanded)
    ↓ props
[NomeDoRecursoTable]       ← presentational: recebe dados, renderiza
    ↓ props
[ItemRow]                  ← presentational: um item da lista
```

**Instruções de preenchimento:**
- Substitua `[NomeDoRecurso]` pelo nome real do domínio (ex: `Pedidos`, `Usuarios`, `Produtos`)
- Ajuste os níveis da hierarquia conforme a complexidade real do projeto
- Documente se o projeto usa um padrão diferente (ex: só pages + components sem hooks separados)

---

## Resultados do audit

> Resultados registrados em [[separation-of-concerns-report]] — não armazenar aqui.

---

## Prompt de audit periódico

```
Examine a estrutura dos componentes e identifique onde a separação
entre lógica e apresentação pode ser melhorada. Procure por:
1. Componentes de UI com regras de negócio embutidas
2. Chamadas de API diretamente em componentes de apresentação
3. Componentes que poderiam seguir o padrão container/presentational

Sugira refatorações para melhorar a separação de responsabilidades,
tornando os componentes mais reutilizáveis e testáveis.
Não execute nada sem aprovação do usuário.
```

---

Ver também: [[coding-conventions]] | [[performance-audit]] | [[dry-refactoring]]
