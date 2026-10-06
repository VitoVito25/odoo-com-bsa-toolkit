---
name: obsidian-documentation
description: "ALWAYS ACTIVE — load this skill at session start and keep it active for the entire session. This skill governs all Obsidian vault operations: OFM conventions, note templates, linking standards, folder naming, and frontmatter rules. Active from the first message of every session regardless of topic. Also explicitly trigger when the user asks to document a component, page, screen, feature, or business rule; create vault notes; write to a second brain or knowledge base; use wikilinks or Obsidian Flavored Markdown. Trigger on phrases like \"documentar no obsidian\", \"criar nota\", \"documentar componente\", \"documentar regra de negócio\", \"escrever no vault\", \"document this in obsidian\", \"create a note for\", \"add to the vault\", \"write vault docs\". The `documentation/` folder IS the Obsidian vault — every read or write operation on it requires this skill to be active."
---

# Obsidian Documentation Skill

When creating or editing notes in an Obsidian vault, follow these conventions precisely. They ensure the vault remains navigable, non-redundant, and legible by both humans and agents over time.

---

## Core Principles

### One note = one topic
Each note covers exactly one subject. If you notice you're writing about two distinct things, split into two notes and connect them with `[[wikilinks]]`.

Why this matters: single-topic notes are linkable, searchable, and maintainable. Mixed notes grow until no one knows where anything lives.

### No duplication
If a concept is already documented elsewhere in the vault, link to it — never repeat the content. Write `[[note-name]]` instead of re-explaining.

### Explain the why
Document not just *what* was built, but *why*. A reader without context should understand the reasoning behind every decision.

### What to document
- How it was built (technical implementation)
- Why it was built that way (business or technical decision)
- What was used (libraries, components, queries, hooks)
- Where it lives in the code (file path + line number when relevant)
- How it behaves (rules, edge cases, examples)

---

## Folder Naming Conventions

| Prefix | Purpose |
|--------|---------|
| `{general}` | Overview, index, entry point for a module |
| `{instructions}` | Meta-docs and agent instructions |
| `{info}` | Support info: business rules, glossary, context |
| `{page}` | Documentation for a specific page/view/screen |
| `{instructions}` | Audit protocols and agent behavior contracts — loaded each session, must stay lean |
| `{reports}` | Output of running a tool — audit results, findings, plans, status tracking |

### `{instructions}` vs `{reports}` distinction

`{instructions}` notes are **loaded into agent context every session** — keep them small. They define *how* to run an audit, the patterns to look for, and the reusable prompt. Never store results here.

`{reports}` notes receive **the output of running a tool** — findings, split plans, status tables, divergence records. They are only loaded on demand. When a tool note says "record results here", write to the matching report file instead.

Naming convention: `{instructions}/[tool-name].md` → `{reports}/[tool-name]-report.md`

Example pairs:
- `{instructions}/separation-of-concerns.md` → `{reports}/separation-of-concerns-report.md`
- `{instructions}/dry-refactoring.md` → `{reports}/dry-refactoring-report.md`
- `{instructions}/performance-audit.md` → `{reports}/performance-audit-report.md`
- `{instructions}/dead-code-audit.md` → `{reports}/dead-code-audit-report.md`

---

## Template: Page / Screen Note

Use for any page, screen, or view in the product:

```markdown
---
title: [Page Name]
date: YYYY-MM-DD
tags:
  - page
  - [module-name]
---

# [Page Name]

## O que é
[2-3 sentence description of the page's purpose]

## Para quem
[User profile / role that uses this page]

## Como funciona
[Main flow: what the user does, what the system returns]

## Componentes principais
[List of components with links to their files in the repo]

## Fonte de dados
[Where data comes from — API, database, external service]

## Regras de negócio
[Link to [[{info}business-rule]] notes — never repeat content here]

## Decisões técnicas
[Why it was implemented this way — trade-offs made]

## Edge cases conhecidos
[Special behaviors, exceptions, boundary conditions]
```

---

## Template: Business Rule Note

```markdown
---
title: [Rule Name]
date: YYYY-MM-DD
tags:
  - business-rule
  - [domain]
---

# [Rule Name]

## Definição
[What the rule determines — clear and direct]

## Contexto
[Why this rule exists — business motivation]

## Comportamento por cenário
[If applicable: how the rule changes across contexts]

## Exemplos
[Concrete cases with numbers or scenarios]

## Impacto no código
[Where implemented — file and function]

## Relacionado
- [[other-related-rule]]
```

---

## OFM Conventions

### Frontmatter (required on every note)
```yaml
---
title: Note Name
date: YYYY-MM-DD
tags:
  - category
  - subcategory
aliases:
  - Alternative Name
---
```

### Internal links
- `[[Note Name]]` — always for internal vault links
- `[[Note|Custom Text]]` — for custom display text  
- `[[Note#Section]]` — to link directly to a section
- **Never** use `[text](path)` Markdown links for internal notes — only for external URLs

### Embeds
- `![[Note]]` — embed full note
- `![[Note#Section]]` — embed specific section
- `![[image.png|400]]` — embed image with width

### Callouts
```markdown
> [!note] Optional title
> Relevant information.

> [!warning] Attention
> Unexpected behavior or exception.

> [!tip] Tip
> Best practice or shortcut.

> [!info] Context
> Supporting information.
```

Available types: `note`, `tip`, `warning`, `info`, `example`, `quote`, `bug`, `danger`, `success`, `question`, `todo`

### Highlights
Use `==text==` to highlight important terms inline.

### Tags
- Inline: `#tag` or `#category/subcategory`
- Hierarchical with `/`: `#project/module`
- No spaces, no accents in tags

---

## Behavior Checklist

Before creating a new note:
1. Check if the content already exists elsewhere in the vault — link, don't duplicate
2. When documenting a component: include the file path in the repo
3. When documenting a business rule: always include concrete examples
4. When creating a page note: follow the page template above
5. Use `[[filename-without-extension]]` — Obsidian resolves automatically; never include `.md`
6. Every note needs `title`, `date`, `tags` in YAML frontmatter
7. Prefer `> [!note]` / `> [!warning]` callouts over plain bold for critical information
8. Each note covers ==one single topic== — if a note mixes two themes, propose splitting before continuing
9. Link to `[[ai-best-practices]]` in agent instructions when relevant
10. Never write audit results into `{instructions}` notes — always write to the matching `{reports}` note
11. When creating a new tool note, create its paired report file in `{reports}` with the `-report` suffix
