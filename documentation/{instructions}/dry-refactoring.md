---
title: DRY Refactoring — [NOME DO PROJETO]
date: YYYY-MM-DD
tags:
  - instructions
  - refactoring
  - dry
  - claude
aliases:
  - dry
  - duplications
---

# DRY Refactoring

> **Para Claude:** Nota especialista em identificar e eliminar código duplicado. Leia antes de qualquer sessão de refatoração por duplicação.

---

**Princípio DRY:** *Don't Repeat Yourself* — se código aparece em 2+ lugares, ele pertence a um lugar só.

> [!warning] Regra obrigatória
> Nunca executar refatoração sem aprovação. Apresentar análise, aguardar ok, executar em tiers pequenos com build entre cada um.

---

## Estrutura atual — atualizada em YYYY-MM-DD

> **[COMO PREENCHER]**
> Documente aqui a estrutura atual de utils, helpers e componentes compartilhados do projeto.
> Atualize esta seção sempre que uma extração for concluída.
> Use o formato abaixo como guia — adapte para a estrutura de pastas real do projeto.
> Marque arquivos removidos com `~~nome.ts~~` e a data de remoção.

```
[RAIZ DO PROJETO]/
├── [pasta de componentes compartilhados]/
│   ├── [ComponenteA].tsx          ← criado YYYY-MM-DD — [propósito]
│   └── [ComponenteB].tsx          ← criado YYYY-MM-DD — [propósito]
├── [pasta de utils]/
│   ├── [dominio]Utils.ts          ← criado YYYY-MM-DD — [lista de exports]
│   └── [outrodominio]Utils.ts     ← criado YYYY-MM-DD — [lista de exports]
```

**Instruções de preenchimento:**
- Liste cada arquivo de utils/helpers com seus exports principais
- Registre a data de criação para rastreabilidade
- Documente divergências intencionais entre utils de domínios diferentes (ver seção abaixo)

---

## Duplicações resolvidas

Histórico de extrações concluídas — função/componente extraído, arquivos de origem, data.
Consultar e atualizar em: [[dry-refac-duplications-solved]]

---

## Divergências intencionais — NÃO compartilhadas

Código que PARECE duplicado mas é intencional manter separado. Registrar antes de qualquer audit para evitar que o agente "corrija" decisões de design deliberadas.
Consultar e atualizar em: [[dry-refac-intentionals-devergencies]]

---

## Pendências de extração

Duplicações identificadas ainda não extraídas — aguardando aprovação ou desbloqueio.
Consultar e atualizar em: [[dry-refac-extraction-pendings]]

---

## Prompt de audit periódico — DRY

```
Identifique padrões de código duplicados no projeto.
Procure por funções, componentes ou blocos de código que aparecem
em vários lugares, com pouca ou nenhuma alteração.

Sugira refatorações para criar componentes reutilizáveis, hooks
personalizados ou funções utilitárias — seguindo DRY.

Também revise organização de pastas e arquivos para estrutura profissional.
Não execute nada sem aprovação.
```

---

Ver também: [[dead-code-audit]] | [[coding-conventions]] | [[project-structure]]
