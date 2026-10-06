---
title: Dead Code Audit — [NOME DO PROJETO]
date: YYYY-MM-DD
tags:
  - instructions
  - audit
  - dead-code
  - claude
aliases:
  - dead-code
  - code-cleanup
---

# Dead Code Audit

> **Para Claude:** Nota especialista em identificar e remover código morto. Leia antes de qualquer sessão de limpeza.

---

> [!warning] Regra obrigatória
> **Nunca executar remoção sem aprovação explícita do usuário.** Apresentar lista, aguardar confirmação, executar em lotes pequenos e verificáveis.

**Princípio:** *"Menos é mais — mas ainda funciona."*

---

## O que verificar

Antes de qualquer refatoração, auditar nessa ordem:

### Componentes/módulos nunca utilizados
Exportados que não aparecem em nenhum `import` ativo no projeto.

> [!warning] Cuidado com falsos positivos
> Ferramentas de análise de imports podem reportar falsos positivos em:
> - Componentes de UI scaffolded reservados para uso futuro
> - Arquivos que são importados dinamicamente
> - Entry points que não aparecem em imports mas são usados pelo bundler

Falsos positivos conhecidos e módulos confirmados como dead code — registrar em: [[dead-code-unused-modules]]

### Funções declaradas mas nunca chamadas
Funções exportadas que não aparecem em nenhuma chamada fora do próprio arquivo.

### Importações não utilizadas
`import X from Y` onde `X` nunca aparece no corpo do arquivo.

### State que nunca muda ou nunca é lido
`useState` onde o setter nunca é chamado, ou onde o valor nunca é consumido.

### Código comentado sem explicação
Blocos de código comentados sem contexto de *por que* foram comentados. Exceção: TODOs com contexto claro.

### Dependências não utilizadas
Pacotes em `package.json` / `requirements.txt` / `go.mod` que não aparecem no código ativo.

---

## Resultado do audit

Dependências não utilizadas, arquivos removidos e TODOs ativos — registrar e atualizar a cada sessão de limpeza.
Consultar e atualizar em: [[dead-code-audit-report]]

---

## Workflow de remoção

1. **Auditar** → identificar dead code (usar esta nota como guia)
2. **Apresentar ao usuário** → lista com análise de risco
3. **Aguardar aprovação** → usuário confirma o que pode remover
4. **Remover em lote pequeno** → máx. 5-10 itens por sessão
5. **Verificar build** → build sem erros
6. **Sinalizar ponto de commit** → mensagem sugerida clara

---

## Prompt de audit periódico

```
Analise o projeto e identifique:
- Componentes/módulos criados mas nunca utilizados
- Funções declaradas mas nunca chamadas
- Importações não utilizadas
- Variáveis de estado que nunca mudam ou nunca são lidas
- Código comentado sem explicação
- Dependências instaladas mas não usadas no código ativo

Sugira remoção. Monte tarefas e subtarefas para a refatoração.
Não execute nada sem aprovação do usuário.
Princípio: menos é mais, mas ainda funciona.
```

---

Ver também: [[dry-refactoring]] | [[coding-conventions]]
