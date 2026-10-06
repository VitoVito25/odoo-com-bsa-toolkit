## Resumo do Projeto

[INPUT]

## Protocolo de Início de Sessão

Execute **nesta ordem**, sem pular etapas:

### 1. Carregar estrutura do vault

Ler `documentation/{general}/vault-structure.md` para mapear pastas, convenções de prefixo e regra de pareamento tools → reports.

### 2. Carregar todas as instruções

Ler **todos** os arquivos em `documentation/{instructions}/`:

- `ai-best-practices.md` — contrato de comportamento, fluxo obrigatório por sessão, regras de comunicação
- `coding-conventions.md` — nomenclatura, estrutura de componente, stack
- `dry-refactoring.md` — protocolo DRY, estrutura atual de utils, divergências intencionais
- `separation-of-concerns.md` — padrão container/presentational, pendências de refactor
- `dead-code-audit.md` — identificação e remoção de código morto
- `performance-audit.md` — checklist de otimizações e resultados

> Não pular nenhum arquivo. Cada um contém restrições ativas que afetam o plano.

### 3. Confirmar leitura

Após ler todos os arquivos acima, reportar:

```
Vault carregado. [N] instruções lidas. Pronto para receber demanda.
```

Só então aguardar a demanda do usuário.

---

## Regras Permanentes

- Consultar `{instructions}` antes de qualquer estruturação de plano — nunca da memória
- Relatórios de audit ficam em `{reports}/` — nunca em `{instructions}/`
- Vault desatualizado = risco de retrabalho — atualizar no Step 5 de cada sessão
- Ver [[ai-best-practices]] para fluxo completo (ENTENDER → ESTRUTURAR → APRESENTAR → EXECUTAR → DOCUMENTAR)

### 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
