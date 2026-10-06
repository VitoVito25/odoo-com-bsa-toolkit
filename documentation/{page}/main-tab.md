---
title: Aba MAIN
date: 2026-10-06
tags:
  - page
  - sheet/main
aliases:
  - MAIN
---

# Aba MAIN

## O que é
Painel inicial: saudação com o nome do usuário no Odoo, status da chave API, botão de sincronizar projetos e o ==cadastro de projetos== que alimenta todas as tools.

## Para quem
BSA dono da planilha.

## Layout

| Linha | Conteúdo |
|-------|----------|
| 1 | `A1:G1` (mesclado, roxo Odoo) — `Olá, <primeiro nome>! 👋` (fórmula lendo `CONF!B4`); sem nome → instrução para colar a chave |
| 2 | `A2` rótulo · `B2` data da chave · `C2:D2` status · `E2` "🔄 Sincronizar projetos do Odoo" · `F2` ==checkbox de sincronizar== |
| 3 | `A3` "Última sincronização" · `B3` data/hora · `C3:G3` resumo (escritos pelo script) |
| 4 | espaçador |
| 5 | cabeçalho da tabela (roxo, texto branco) — linhas 1–5 congeladas |
| 6+ | um projeto por linha (faixas alternadas) — ==filtrada: só `Ativo` marcado== |

### Colunas da tabela de projetos

| Coluna | Campo | Formato | Nota no cabeçalho (cell note) |
|--------|-------|---------|-------------------------------|
| A | `Nome` | texto | Nome de exibição do projeto. Não é usado para busca de gravações. |
| B | `Nome Reunião` | texto | Termo procurado no nome da pasta da reunião do Meet, como palavra inteira, ignorando maiúsculas e acentos. Vários termos separados por `;`. Ver [[recording-routing-rule]]. |
| C | `Pasta Gravação` | URL da pasta no Drive | Pasta para onde as gravações do projeto são movidas. |
| D | `Tarefa QS Principal` | URL da tarefa Odoo | Tarefa principal do projeto (Quick Start). Preenchida pela sincronização se vazia. |
| E | `Tarefa de Comunicação` | URL da tarefa Odoo | Subtarefa de comunicação com o cliente. Preenchida pela sincronização se vazia. |
| F | `Tarefa de LOG` | URL da tarefa Odoo | Tarefa onde a IA posta resumos de reunião e documentação. |
| G | `Ativo` | checkbox | Desmarcado = projeto ignorado pelas tools. ==Sobrescrito pela sincronização== conforme o estado no Odoo. |

## Como funciona
- `A1` = `=SE(CONF!B4="";"Olá! 👋  Cole a chave do Odoo em CONF › B5 para começar";"Olá, "&ESQUERDA(CONF!B4;PROCURAR(" ";CONF!B4&" ")-1)&"! 👋")`
- `B2` = `=SE(CONF!B6="";"";CONF!B6)` · `C2` = `=SE(OU(B2="";INT(B2)<HOJE());"⚠️ Chave expirada — colar nova chave em CONF › B5";"✅ Chave válida hoje")`
- Formatação condicional `B2:D2`: vermelho `=OU($B$2="";INT($B$2)<HOJE())`, verde `=E($B$2<>"";INT($B$2)>=HOJE())` → [[odoo-api-key-rotation]]
- Marcar `F2` → `onEditInstalled` → `runTool(SINCRONIZAR_PROJETOS)` → desmarca. Regra: [[project-sync-rule]]
- Validação: `C6:F501` só URL (aviso), `G6:G501` checkbox
- ==Filtro básico== em `A5:G501`, coluna `Ativo`, critério `=G6` (fórmula sem funções → independe do locale). O Sheets não reavalia filtro quando valores mudam, então `ProjectsRepo.applyActiveFilter()` reaplica após a sincronização, ao editar `Ativo` e ao abrir a planilha. Para ver inativos: ícone de filtro no cabeçalho `Ativo`
- Texto ==cortado na largura da célula== (`wrapStrategy CLIP`) em `A6:G501` — links longos não invadem a coluna vizinha

## Fonte de dados
- Carga inicial: 41 projetos do legado (`legacy/organizador-videos.gs`)
- Sincronização com o projeto QS do Odoo (1ª rodada 2026-10-06: +17 projetos, 38 atualizados)

## Regras de negócio
- [[odoo-api-key-rotation]]
- [[recording-routing-rule]]
- [[project-sync-rule]]
- [[odoo-task-roles]]

## Decisões técnicas
- `Nome` separado de `Nome Reunião`: nome de exibição livre; termos de busca controlados pelo usuário.
- URL em vez de ID nas colunas C–F: clicável; o script extrai o ID por regex.
- Coordenadas em `apps-script/config/Constants.gs` (`MAIN_FIRST_ROW = 6`, `MAIN_CELL`).
- Visual: [[coding-conventions#Identidade visual Odoo]].

## Edge cases conhecidos
- Projetos novos da sincronização entram sem `Nome Reunião`/`Pasta Gravação` → organizador ignora até preencher.
- Mesmo termo em dois projetos → reuniões ficam ambíguas (pendentes).
