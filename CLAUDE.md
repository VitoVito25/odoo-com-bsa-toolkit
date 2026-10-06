# Prompt de Inicialização — Vibcode Documentation Kit

> **Execute uma vez.** Após a primeira sessão os templates estarão configurados para o projeto e este prompt não deve ser executado novamente.

---

## O que este prompt faz

Substitui todos os placeholders genéricos dos templates pelo contexto real do projeto:

- `[NOME DO PROJETO]` → nome real em todos os frontmatters
- `YYYY-MM-DD` → data atual em todos os arquivos
- Seções de stack → adaptadas para as tecnologias do projeto
- Estrutura de pastas → caminhos reais do projeto
- Blocos `> **[COMO PREENCHER]**` → removidos após cada seção preenchida

**Arquivos que serão modificados:**
```
documentation/{instructions}/ai-best-practices.md
documentation/{instructions}/coding-conventions.md
documentation/{instructions}/dry-refactoring.md
documentation/{instructions}/separation-of-concerns.md
documentation/{instructions}/dead-code-audit.md
documentation/{instructions}/performance-audit.md
documentation/{reports}/separation-of-concerns-report.md
documentation/{reports}/performace-audit-report.md
```

---

## Passo 1 — Coletar informações

Preciso de 5 informações antes de começar:

**1. Nome do projeto**
Usado em todos os frontmatters como título.
Ex: `"Bloxslab"`, `"Dashboard Financeiro"`, `"Portal RH"`

**2. Resumo do projeto**
2-4 frases descrevendo o que o projeto faz, para quem, e qual o problema que resolve.
Ex: `"Plataforma de gestão de times para pequenas empresas. Permite controlar presença, férias e pagamentos em um painel único. Público: RH de empresas com 10-100 funcionários."`

**3. Stack técnica**
Linguagem, framework principal, state management, test runner, bundler, estilização, componentes base.
Ex: `"React + TypeScript, Zustand, Vitest, Vite, Tailwind CSS, shadcn/ui"`

**4. Estrutura de pastas**
Raiz do projeto + caminho dos utils + caminho dos componentes compartilhados.
Ex: raiz `src/`, utils em `src/lib/`, componentes em `src/components/shared/`

**5. Padrão arquitetural**
Como o código é organizado.
Ex: `"container/presentational"`, `"feature-based"`, `"MVC"`, `"clean architecture"`

---

## Passo 2 — Execução por arquivo

### `ai-best-practices.md`
- Frontmatter `date:` → substituir `YYYY-MM-DD` pela data atual
- Seção 3 (Granularidade de Aprovação) → adaptar o exemplo de caminho `src/lib/` para o caminho de utils real (info 4)
- Seção 8 (Escalabilidade) → remover bullets sobre tecnologias não usadas, adaptar para a stack real (info 3)
- Seção 10 (Lógica de Negócio Ambígua) → substituir `{info}bussiness-rule/` pelo caminho real de regras de negócio no vault
- Seção 13 (Testing Policy) → substituir placeholder pelo comando de build/test real do projeto (ex: `tsc --noEmit`, `npm run build`, `pytest`)
- Seção 14 (Documentação) → substituir caminhos genéricos da tabela pelos caminhos reais do vault
- Referências finais → verificar se wikilinks apontam para os nomes reais dos arquivos no vault

### `coding-conventions.md`
- Frontmatter `title:` → substituir `[NOME DO PROJETO]` pelo nome real (info 1)
- Frontmatter `date:` → substituir `YYYY-MM-DD` pela data atual
- Seção Nomenclatura → adaptar tabela para a linguagem/framework do projeto (info 3); preencher coluna Exemplo com padrões reais
- Seção Estrutura de componente → adaptar bloco de código para a linguagem/framework (info 3)
- Seção State management → adaptar tabela para o state management do projeto (info 3)
- Seção Performance → adaptar bullets para as otimizações relevantes à stack (info 3)
- Seção Stack técnica → preencher tabela completa com as decisões tecnológicas reais (info 3)

### `dry-refactoring.md`
- Frontmatter `title:` → substituir `[NOME DO PROJETO]` (info 1)
- Frontmatter `date:` → substituir `YYYY-MM-DD` pela data atual
- Seção "Estrutura atual" cabeçalho → substituir `YYYY-MM-DD` pela data atual
- Bloco de estrutura de pastas → substituir `[RAIZ DO PROJETO]`, `[pasta de componentes compartilhados]`, `[pasta de utils]` pelos caminhos reais (info 4)
- Manter `[ComponenteA].tsx` e `[ComponenteB].tsx` como exemplos de formato — não preencher com componentes reais ainda

### `separation-of-concerns.md`
- Frontmatter `title:` → substituir `[NOME DO PROJETO]` (info 1)
- Frontmatter `date:` → substituir `YYYY-MM-DD` pela data atual
- Adaptar terminologia e exemplos para o padrão arquitetural do projeto (info 5)

### `dead-code-audit.md`
- Frontmatter `title:` → substituir `[NOME DO PROJETO]` (info 1)
- Frontmatter `date:` → substituir `YYYY-MM-DD` pela data atual

### `performance-audit.md`
- Frontmatter `title:` → substituir `[NOME DO PROJETO]` (info 1)
- Frontmatter `date:` → substituir `YYYY-MM-DD` pela data atual
- Seções de checklist → remover ou substituir categorias que não se aplicam à stack; adicionar categorias específicas da stack (info 3)

### `separation-of-concerns-report.md`
- Frontmatter `title:` → substituir `[NOME DO PROJETO]` (info 1)

### `performace-audit-report.md`
- Frontmatter `title:` → substituir `[NOME DO PROJETO]` (info 1)

---

## Passo 3 — Limpeza

Após preencher cada seção, remover o bloco `> **[COMO PREENCHER]** ...` correspondente.

Não remover blocos de instrução de seções que **não foram preenchidas** — eles sinalizam trabalho pendente para o usuário.

---

## Passo 4 — Verificação final

Confirmar que nenhum destes itens permanece nos arquivos preenchidos:

- [ ] `[NOME DO PROJETO]` em qualquer frontmatter `title:`
- [ ] `YYYY-MM-DD` em qualquer frontmatter `date:` ou corpo de arquivo
- [ ] `[RAIZ DO PROJETO]` em `dry-refactoring.md`
- [ ] `[pasta de componentes compartilhados]` em `dry-refactoring.md`
- [ ] `[pasta de utils]` em `dry-refactoring.md`
- [ ] Linhas `[ex: ...]` na tabela de Stack técnica de `coding-conventions.md`
- [ ] Blocos `> **[COMO PREENCHER]**` nas seções que foram preenchidas

