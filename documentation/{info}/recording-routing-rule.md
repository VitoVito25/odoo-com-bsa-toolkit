---
title: Roteamento de gravações para projetos
date: 2026-10-06
tags:
  - business-rule
  - drive
  - meet
---

# Roteamento de gravações para projetos

## Definição
Uma pasta de reunião dentro da ==pasta de origem== (ID em [[conf-tab]]) pertence ao projeto cujo `Nome Reunião` (aba [[main-tab]]) aparece no nome da pasta como ==termo inteiro==, depois de normalizar os dois lados. `Lisco` casa com `Lisco kick off`, `kickoff LISCO` e `Reunião lisco - 01/10`.

## Contexto
- Legado comparava substring em minúsculas com o nome do projeto → falsos positivos (`Cata` casava com `Catálogo`) e primeiro-match pela ordem do dicionário.
- Decisão do usuário (2026-10-06): coluna dedicada `Nome Reunião`; busca deve casar independentemente de maiúsculas ("deve bater com lisco kick off") e ser robusta.
- Origem por ==ID de pasta== em vez de busca por nome `Google Meet`: evita pastas homônimas e renomeações do Google.

## Algoritmo

1. **Normalizar** nome da pasta e cada termo:
   - remover acentos (`NFD` + remover `̀-ͯ`) → `Ática` = `atica`
   - minúsculas
   - colapsar espaços repetidos e `trim`
   - símbolos (`<>`, `-`, `&`) são mantidos — `PR <>` continua distinto de `PR`
2. **Termos por projeto:** `Nome Reunião` aceita ==vários termos separados por `;`== (ex: `GS Plast; GS Metal Plast`). Termos vazios ignorados.
3. **Casar como termo inteiro:** o termo precisa estar no nome com fronteira dos dois lados — início/fim do texto ou caractere que não é letra/dígito.
   - Regex: `(^|[^a-z0-9])` + termo escapado + `($|[^a-z0-9])`
   - `cata` ✗ em `catalogo interno` (seguido de `l`) · `cata` ✓ em `cata - review`
4. **Decidir entre projetos:**
   - 0 projetos → `⚠️ PENDENTE: sem correspondência`
   - 1 projeto → move
   - 2+ projetos → vence o projeto com o ==termo casado mais longo==, **se** todos os outros termos casados estiverem contidos nele (ex: `passap` ⊂ `passap edu`). Caso contrário → `⚠️ PENDENTE: ambíguo (A, B)` — nunca escolhe sozinho

## Comportamento por cenário

| Pasta de reunião | `Nome Reunião` cadastrados | Resultado |
|------------------|---------------------------|-----------|
| `Lisco kick off` | `Lisco` | Lisco |
| `KICKOFF LISCO (2026-10-01)` | `Lisco` | Lisco |
| `Treinamento Atica` | `Ática` | Ática (acento ignorado) |
| `Catálogo interno` | `Cata` | ==não casa== → pendente |
| `Cata - follow up` | `Cata` | Cata |
| `PR <> Odoo - review` | `PR <>`, `Passap <>` | PR <> |
| `GS Metal Plast - sync` | `GS Plast; GS Metal Plast` (mesmo projeto) | projeto GS (1 projeto, 2 aliases) |
| `Passap Edu kickoff` | `Passap` (proj. A), `Passap Edu` (proj. B) | B — `passap` contido em `passap edu` |
| `Lisco Villa - sync` | `Lisco`, `Villa` | ==pendente ambíguo== (termos independentes) |
| `Reunião interna` | nenhum | pendente, fica na origem |
| qualquer | projeto `Ativo` desmarcado ou `Nome Reunião` vazio | projeto ignorado |
| arquivo solto (não pasta) na origem | — | ignorado (decisão 2026-10-06: só pastas) |

## Edge cases
- Projeto casado sem `Pasta Gravação` → não move; log `⚠️ projeto sem pasta`.
- Pasta de destino inválida/sem permissão → log `❌` para aquela pasta, segue para a próxima.
- ID de origem vazio/inválido em CONF → tool aborta com `❌ pasta de origem não configurada`.
- Mesmo termo cadastrado em dois projetos → todas as reuniões com ele ficam ambíguas; a tool registra `⚠️ TERMO DUPLICADO` no topo do detalhe do log (`findDuplicateTerms_`).

## Impacto no código
- Legado: `legacy/organizador-videos.gs:68-69`
- Novo: `apps-script/tools/RecordingOrganizer.gs`
  - `normalizeText_(s)` — passo 1
  - `findProjectForFolder_(folderName, projects)` → `{status: 'match'|'none'|'ambiguous', project?, candidates?}` — passos 3–4, função pura. Validada em Node com os 13 cenários da tabela acima (2026-10-06)

## Relacionado
- [[tool-organizador-gravacoes]]
- [[main-tab]]
- [[conf-tab]]
