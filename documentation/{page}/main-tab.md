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
Painel inicial. Mostra se a chave da API do Odoo está válida para hoje e mantém o ==cadastro de projetos== que alimenta todas as tools.

## Para quem
BSA dono da planilha.

## Layout

| Bloco | Posição | Conteúdo |
|-------|---------|----------|
| Status da API | `A1:B2` | `A1` rótulo "Última atualização da chave API" · `B1` data (fórmula lendo de `CONF`) · `B2` status textual |
| Tabela de projetos | a partir de `A4` (cabeçalho) | uma linha por projeto |

### Colunas da tabela de projetos

| Coluna | Campo | Formato | Nota no cabeçalho (cell note) |
|--------|-------|---------|-------------------------------|
| A | `Nome` | texto | Nome de exibição do projeto. Não é usado para busca. |
| B | `Nome Reunião` | texto | Termo procurado no nome da pasta da reunião do Meet, como palavra inteira, ignorando maiúsculas e acentos. Vários termos separados por `;`. Ex: `Lisco` casa com `Lisco kick off`. Ver [[recording-routing-rule]]. |
| C | `Pasta Gravação` | URL da pasta no Drive | Pasta para onde as gravações do projeto são movidas. Colar o link da pasta. |
| D | `Tarefa QS Principal` | URL da tarefa Odoo | Tarefa principal do projeto no Odoo (Quick Start). |
| E | `Tarefa de Comunicação` | URL da tarefa Odoo | Tarefa onde fica toda a comunicação com o cliente. |
| F | `Tarefa de LOG` | URL da tarefa Odoo | Tarefa onde a IA posta resumos de reunião e documentação do projeto. |
| G | `Ativo` | checkbox | Desmarcado = projeto ignorado pelas tools (projeto encerrado). |

> [!note] Notas explicativas
> Cada cabeçalho recebe uma *cell note* (hover) com o texto da coluna acima — pedido explícito do usuário para a planilha ser autoexplicativa.

## Como funciona
- `B1` = `=CONF!B6` (data da última atualização da chave — ver [[conf-tab]])
- Formatação condicional em `B1:B2`: fundo vermelho se `B1 < TODAY()` ou vazio → regra [[odoo-api-key-rotation]]
- `B2` = `=IF(OR(B1="",B1<TODAY()),"⚠️ Chave expirada — atualizar em CONF","✅ Chave válida hoje")` (separador `,` na API; UI pt-BR exibe `;`)
- Validação de dados: colunas C–F aceitam só URL (`=REGEXMATCH(...)`), aviso em vez de bloqueio

## Fonte de dados
Digitado pelo usuário. Carga inicial = 41 projetos (42 chaves, `GS Plast`/`GS Metal Plast` unidos por alias) do mapeamento hardcoded em `organizador-videos.gs`: `Nome` e `Nome Reunião` recebem a chave do dicionário legado (ex: `PR <>`); usuário ajusta `Nome` depois. Ver [[implementation-plan]].

## Regras de negócio
- [[odoo-api-key-rotation]]
- [[recording-routing-rule]]
- [[odoo-task-roles]]

## Decisões técnicas
- ==`Nome` separado de `Nome Reunião`== (decisão 2026-10-06): nome de exibição livre; termos de busca controlados pelo usuário (aliases com `;`).
- ==URL em vez de ID== nas colunas C–F: usuário copia e cola o link direto; o script extrai o ID por regex. Clicável na planilha.
- Tabela começa em linha fixa (`A4`) — repo lê de `A5` até última linha com `Nome`. Constantes em `apps-script/config/Constants.gs`.

## Edge cases conhecidos
- Dois projetos com a mesma pasta — permitido (legado `GS Plast`/`GS Metal Plast` virou 1 projeto com 2 aliases).
- `Nome Reunião` que é palavra comum (`Ponto`) casa com qualquer título que tenha essa palavra — cadastrar termo mais específico.
- Mesmo termo em dois projetos → reuniões ficam ambíguas (pendentes).
