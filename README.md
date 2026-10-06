# Odoo BSA Toolkit

Kit de ferramentas para BSA da Odoo: uma Google Sheet com Apps Script vinculado que automatiza tarefas repetitivas entre Google Drive/Meet e as tarefas de projeto no odoo.com (produção).

## Abas da planilha

| Aba | Para que serve |
|-----|----------------|
| `MAIN` | Mostra a data da última atualização da chave API (fica vermelha se for anterior a hoje). Também guarda o cadastro de projetos: nome, nome da reunião (termo buscado no título da reunião do Meet, sem diferenciar maiúsculas e acentos), pasta de gravações, tarefa QS principal, tarefa de comunicação e tarefa de LOG. |
| `TOOLS` | Catálogo de tools. Cada tool pode ser executada na hora ou agendada por um dropdown (Manual, A cada hora, Diário 08h etc.). |
| `CONF` | Conexão com o Odoo e chave API diária (colada na célula), teste de conexão, parâmetros das tools (ID da pasta de origem das gravações, e-mail opcional) e log de todas as execuções. |

## Tools

- **Organizar gravações Meet**: move as pastas de reunião da pasta de origem para a pasta de cada projeto. Lê os projetos da aba MAIN; tem modo simulação no menu `BSA Toolkit`. A versão antiga, com mapeamento hardcoded, está em `legacy/organizador-videos.gs`.
- **Sincronizar projetos do Odoo**: puxa do projeto QS (`CONF!B13`) as tarefas principais em que você é responsável e atualiza a MAIN. Não duplica projetos que já estão na lista, desmarca Ativo nos concluídos e cancelados, e preenche os links de tarefa QS e de comunicação. No Odoo, só lê.

Qualquer tool pode ser agendada pelo dropdown da aba TOOLS.

## Estrutura do repositório

```
apps-script/          → código do Apps Script, enviado com `npx @google/clasp push`
legacy/               → script antigo (só referência)
documentation/        → vault Obsidian: specs das abas, regras de negócio, plano, convenções
.env.example          → modelo de credenciais locais (copiar para .env, que é ignorado pelo git)
CLAUDE.md             → protocolo de sessão do agente de IA
```

## Documentação

Comece por `documentation/{general}/project-overview.md`. O plano de execução está em `documentation/{reports}/implementation-plan.md`. Para instalar ou atualizar o código, veja `documentation/{general}/deploy-apps-script.md`.

## Uso diário

1. Gere uma nova chave API no odoo.com.
2. Cole a chave em `CONF!B5`. A data é atualizada e a conexão é testada automaticamente.
3. Confira se `MAIN` ficou verde.

> Não compartilhe a planilha: a chave fica visível na célula e no histórico de versões.
