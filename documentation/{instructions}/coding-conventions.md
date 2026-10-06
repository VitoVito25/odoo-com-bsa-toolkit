---
title: Coding Conventions — [NOME DO PROJETO]
date: YYYY-MM-DD
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

> **Para Claude:** Nota especialista em padrões de escrita de código. Define nomenclatura, estrutura de componente, state management, performance e comentários. Leia antes de escrever qualquer código novo.

---

> *"Menos é mais — mas ainda funciona."*

---

> **[COMO PREENCHER]**
> Este arquivo define os padrões de código do projeto. Preencha cada seção com as convenções reais adotadas.
> Seções marcadas com `[COMO PREENCHER]` precisam de adaptação para o projeto específico.
> Após preencher, remova os blocos de instrução.

---

## Nomenclatura

> **[COMO PREENCHER]**
> Defina as convenções de nomenclatura do projeto. A tabela abaixo é um exemplo para projetos React/TypeScript.
> Adapte as linhas para a linguagem e framework do projeto. Adicione ou remova tipos conforme necessário.
> Inclua exemplos reais do projeto — não exemplos genéricos.

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes | `PascalCase` | `[ExemploDeComponente]` |
| Hooks | `camelCase` + prefixo `use` | `use[NomeDoHook]` |
| Arquivos de página | `PascalCase` + sufixo descritivo | `[Nome]Page.tsx` |
| Utilitários/helpers | `camelCase` | `[nome]Utils.ts` |
| Constantes | `UPPER_SNAKE_CASE` | `[NOME_DA_CONSTANTE]` |

---

## Estrutura de componente

> **[COMO PREENCHER]**
> Defina a ordem de seções dentro de um componente/arquivo.
> O exemplo abaixo é para React/TypeScript — adapte para a linguagem do projeto.

```tsx
// 1. Imports externos
// 2. Imports internos (tipos, utils, hooks, componentes)
// 3. Tipos/interfaces locais
// 4. Constantes locais
// 5. Componente principal
// 6. Subcomponentes locais (se pequenos e acoplados)
```

---

## State management

> **[COMO PREENCHER]**
> Defina quando usar cada abordagem de estado. A tabela abaixo é para React — adapte para o framework do projeto.
> Ex: se usa Redux, Zustand, Pinia, MobX etc., documente aqui quando cada um se aplica.

| Situação | Padrão |
|----------|--------|
| Estado local simples | `useState` |
| Estado derivado | `useMemo` — nunca `useState` redundante |
| Efeito colateral | `useEffect` com deps explícitas |
| Estado global do módulo | `[nome]Context` ou `[store]` |

---

## Performance

> **[COMO PREENCHER]**
> Liste as regras de performance do projeto. Exemplos abaixo são para React — adapte conforme necessário.

- Re-renders: funções em handlers → `useCallback`; objetos/arrays derivados → `useMemo`
- Não criar objetos inline em props que causam re-render desnecessário
- Listas longas: verificar se precisam de virtualização

---

## Comentários no código

- Comentar só o **porquê**, nunca o **o quê**
- TODOs com contexto: `// TODO: [motivo] — [quando será resolvido]`
- Não deixar código comentado sem explicação — ou remove, ou documenta motivo

---

## Reutilização de componentes — brand guideline

Antes de criar qualquer componente, card, badge, botão, formatação ou elemento visual **novo**:

1. **Varrer o codebase** por componente existente com mesmo propósito ou visual similar
2. **Match exato** → reutilizar. Não duplicar.
3. **Match parcial ou ambíguo** → perguntar ao usuário:
   > "Esse componente novo, você quer parecido com `{ComponenteEncontrado}`?"
4. **Nenhum match** → criar novo e registrar no vault como padrão estabelecido

**Objetivo:** brand guideline — mesmos botões, badges, cards, ícones e estilos em todo o codebase. Consistência visual depende de não criar variantes ad-hoc.

> [!warning] Nunca criar variante inline silenciosa
> Se criar um elemento levemente diferente do padrão existente sem perguntar, o guideline quebra. Sempre confirmar antes de divergir do padrão.

---

## O que NÃO fazer

- Não adicionar features, abstrações ou refatorações além do que a tarefa pede
- Não criar error handling para cenários impossíveis
- Não usar feature flags ou shims de retrocompatibilidade quando dá pra mudar o código
- Não escrever docstrings multi-linha — no máximo uma linha curta

---

## Stack técnica

> **[COMO PREENCHER]**
> Preencha a tabela abaixo com as decisões tecnológicas reais do projeto.
> Cada linha deve ser uma decisão que pode ser contestada — registrar aqui elimina debates recorrentes.

| Decisão | Padrão |
|---------|--------|
| Estilização | `[ex: Tailwind CSS / CSS Modules / styled-components]` |
| Componentes base | `[ex: shadcn/ui / Material UI / Radix]` |
| Gráficos | `[ex: Recharts / Chart.js / D3]` |
| Animações | `[ex: framer-motion / CSS transitions]` |
| Roteamento | `[ex: react-router-dom v6 / Next.js App Router]` |
| Auth | `[ex: Supabase / Auth0 / NextAuth]` |
| Build | `[ex: Vite / Next.js / Webpack]` |
| Banco de dados | `[ex: Supabase / PostgreSQL / MongoDB]` |

Ver stack completa: [[obsidian-documentation]]

---

Ver também: [[dead-code-audit]] | [[dry-refactoring]] | [[project-structure]]
