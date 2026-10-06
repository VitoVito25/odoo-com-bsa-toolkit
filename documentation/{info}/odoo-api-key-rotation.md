---
title: Rotação diária da chave API Odoo
date: 2026-10-06
tags:
  - business-rule
  - odoo
  - security
---

# Rotação diária da chave API Odoo

## Definição
A chave API do Odoo (odoo.com) do usuário ==vale por um dia==. Toda tool que chama o Odoo depende de uma chave atualizada hoje. Chave atualizada antes de hoje = considerada expirada.

## Contexto
Política do odoo.com para chaves de API dos usuários internos: expiração curta. O BSA precisa gerar uma chave nova diariamente e colar na planilha.

## Comportamento por cenário

| Cenário | MAIN `B1:B2` | Tool que usa Odoo |
|---------|--------------|-------------------|
| Chave atualizada hoje | verde, "✅ Chave válida hoje" | roda normalmente |
| Chave atualizada ontem ou antes | ==vermelho==, "⚠️ Chave expirada" | não chama API; log `❌ chave expirada` |
| Nunca atualizada (vazio) | vermelho | igual acima |
| Atualizada hoje mas Odoo recusa (revogada) | verde (planilha não sabe) | log `❌ autenticação falhou`; `CONF!B6` mostra erro |

## Exemplos
- Chave colada em 06/10 às 09:00 → em 06/10 23:59 ainda verde → 07/10 00:00 vira vermelho.
- Agendamento diário 08h de tool Odoo em 07/10, usuário só atualiza às 09h → execução das 08h falha com log; usuário roda manual depois.

## Impacto no código
- Chave em `CONF!B5` (colada pelo usuário); data em `CONF!B6` (escrita pelo script ao editar `B5`) — [[conf-tab]]
- Testes locais do agente: chave em `.env` (ignorado pelo git), independente da planilha
- Checagem visual: formatação condicional em [[main-tab]]
- Checagem em código: `OdooClient.assertKeyFresh_()` + `isToday_()` em `apps-script/services/OdooClient.gs` (fuso do script)

## Relacionado
- [[conf-tab]]
- [[main-tab]]
