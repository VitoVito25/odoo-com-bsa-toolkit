# Vibcode Documentation Kit

Kit de documentação para projetos de vibe coding — estrutura pronta de vault Obsidian + protocolos de sessão para agentes de IA.

## Intuito

Vibe coding sem documentação estruturada gera retrabalho: o agente esquece convenções, duplica código, ignora padrões arquiteturais. Este kit resolve isso fornecendo um vault pré-montado que o agente lê no início de cada sessão, garantindo consistência sem depender da memória da conversa anterior.

## O que está incluído

```
documentation/
├── {instructions}/   → protocolos carregados em toda sessão (convenções, DRY, SoC, dead code, performance)
├── {reports}/        → resultados de audits gerados pelo agente
└── {general}/        → mapa do vault e entry points
```

- **`NOVOCLAUDE.md`** — protocolo de início de sessão: define a ordem de leitura dos arquivos e as regras permanentes de comportamento do agente
- **`PROMPT INICIAL.md`** — executado uma vez para substituir todos os placeholders dos templates pelo contexto real do projeto

## Como usar

1. Clone o repositório no projeto alvo
2. Execute `PROMPT INICIAL.md` fornecendo nome do projeto, stack, estrutura de pastas e padrão arquitetural
3. Cole o conteúdo de `NOVOCLAUDE.md` como contexto inicial de cada nova sessão com o agente
4. O agente lê `documentation/{instructions}/` antes de qualquer tarefa e salva resultados em `{reports}/`

## Estrutura de sessão do agente

```
ENTENDER → ESTRUTURAR → APRESENTAR → EXECUTAR → DOCUMENTAR
```

Cada sessão termina com o vault atualizado — próxima sessão começa com contexto completo.
