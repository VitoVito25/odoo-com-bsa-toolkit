# Odoo BSA Toolkit

Kit de ferramentas para BSA da Odoo: uma Google Sheet com Apps Script vinculado que automatiza tarefas repetitivas entre Google Drive/Meet e as tarefas de projeto no odoo.com (produção).

## Abas da planilha

| Aba | Para que serve |
|-----|----------------|
| `MAIN` | Mostra a data da última atualização da chave API (fica vermelha se for anterior a hoje). Também guarda o cadastro de projetos: nome, nome da reunião (texto exato buscado no título do Meet), pasta de gravações, tarefa QS principal, tarefa de comunicação e tarefa de LOG. |
| `TOOLS` | Catálogo de tools. Cada tool pode ser executada na hora ou agendada por um dropdown (Manual, A cada hora, Diário 08h etc.). |
| `CONF` | Conexão com o Odoo e chave API diária (colada na célula), teste de conexão, parâmetros das tools (ID da pasta de origem das gravações, e-mail opcional) e log de todas as execuções. |

## Tools

- **Organizar gravações Meet**: move as pastas de reunião da pasta de origem para a pasta de cada projeto. Hoje a versão em uso é a legada, `organizador-videos.gs`, com mapeamento hardcoded. A migração para ler os projetos da aba MAIN está planejada.

## Estrutura do repositório

```
apps-script/          → código do Apps Script (planejado), copiado manualmente para o editor
organizador-videos.gs → script legado (vai para legacy/)
documentation/        → vault Obsidian: specs das abas, regras de negócio, plano, convenções
.env.example          → modelo de credenciais locais (copiar para .env, que é ignorado pelo git)
CLAUDE.md             → protocolo de sessão do agente de IA
```

## Documentação

Comece por `documentation/{general}/project-overview.md`. O plano de execução está em `documentation/{reports}/implementation-plan.md`. Para instalar ou atualizar o código no editor, veja `documentation/{general}/deploy-apps-script.md`.

## Uso diário

1. Gere uma nova chave API no odoo.com.
2. Cole a chave em `CONF!B5`. A data é atualizada e a conexão é testada automaticamente.
3. Confira se `MAIN` ficou verde.

> Não compartilhe a planilha: a chave fica visível na célula e no histórico de versões.
