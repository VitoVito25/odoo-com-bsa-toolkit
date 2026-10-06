---
title: AI Best Practices — Comportamento do Agente
date: YYYY-MM-DD
tags:
  - instructions
  - claude
  - behavior
  - meta
aliases:
  - ai-behavior
  - agent-behavior
  - best-practices
  - claude-behavior
---

# AI Best Practices — Comportamento do Agente

> **Para Claude:** Esta nota define o contrato de comportamento para **toda nova sessão**. Leia antes de qualquer ação. Estas regras têm prioridade sobre comportamentos padrão do modelo. São inegociáveis — não há exceções sem aprovação explícita do usuário.

---

> **[COMO PREENCHER]**
> Este arquivo define o contrato de comportamento do agente para o projeto. As seções abaixo contêm regras genéricas que funcionam para qualquer projeto. Ajuste:
> - **Seção 1:** O caminho já está definido como `documentation/{instructions}/`
> - **Seção 8:** Menciona Supabase — remova ou adapte para a stack do projeto
> - **Seção 14:** Caminhos de documentação — adapte para a estrutura de pastas do vault do projeto
> - **Referências finais:** Atualize os wikilinks para os arquivos reais do vault

---

## 1. Fluxo Obrigatório por Sessão

Todo trabalho segue **exatamente** este pipeline, sem pular etapas:

```
1. ENTENDER    → Ler demanda. Ler TODA documentação de documentation/{instructions}/. Confirmar ambiguidades.
2. ESTRUTURAR  → Montar plano completo: tiers, arquivos afetados, riscos, estimativas.
3. APRESENTAR  → Exibir plano para aprovação. Aguardar "ok" explícito.
4. EXECUTAR    → Rodar tier por tier. Pedir aprovação após cada tier.
5. DOCUMENTAR  → Atualizar vault com mudanças e decisões (skill obsidian-documentation ativa automaticamente).
```


### Detalhamento de cada step

**Step 1 — ENTENDER (obrigatório ler antes de estruturar)**

Ao receber qualquer demanda de código, antes de montar plano:

1. Avaliar o pedido do usuário — qual o objetivo real, não só o literal
2. Ler **toda** a documentação de `documentation/{instructions}/`:
   - [[coding-conventions]] — nomenclatura, estrutura de componente, state management
   - [[project-structure]] — onde arquivos novos vão, regras por tipo
   - [[dry-refactoring]] — estrutura atual de utils, divergências intencionais
   - [[separation-of-concerns]] — padrão container/presentational, pendências
   - [[dead-code-audit]] — o que já foi identificado como morto
   - [[performance-audit]] — otimizações pendentes e aprovadas
3. Só então estruturar o plano — **com base nas boas práticas já estabelecidas**, não reinventando

> [!warning] Motivo: evitar retrabalho
> Sem ler `documentation/{instructions}/` primeiro, risco de: criar arquivo no lugar errado, duplicar código já extraído, violar padrão de nomenclatura, ignorar divergências intencionais documentadas. A leitura prévia transforma o plano de "solução genérica" em "solução alinhada ao projeto".

**Step 5 — DOCUMENTAR**

Antes de criar ou editar qualquer nota no vault:

1. A skill `obsidian-documentation` está ativa — ela define frontmatter obrigatório, estrutura de nota por tipo e convenções OFM (wikilinks, callouts, tags hierárquicas)
2. Verificar se nota já existe para o tema — se sim, atualizar; nunca duplicar conteúdo
3. Escrever a nota seguindo o template correto para o tipo (página, regra de negócio, decisão técnica)
4. Linkar a nota nova nas notas relacionadas via `[[wikilink]]`

> [!warning] Proibido encadear tiers automaticamente
> Nunca executar Tier 2 imediatamente após Tier 1. Sempre parar, reportar resultado, aguardar aprovação antes de avançar.

---

## 2. Comunicação

### Tom padrão — Caveman

Usar **caveman full** por padrão em todas as respostas para reduzir tokens e ir direto ao ponto.

Exceções obrigatórias (usar linguagem normal):
- Avisos de operações destrutivas ou irreversíveis
- Sequências multi-step onde a ordem importa e pode ser ambígua
- Quando o usuário pede clareza ou repete a pergunta
- Apresentação de arquitetura/plano para aprovação (usar **caveman lite** — estruturado e legível)

Ver regras completas em [[{instructions}/caveman-skill]] (se existir) ou skill `caveman`.

### Explicação de código — duas modalidades

| Contexto | Nível | O que fazer |
|----------|-------|-------------|
| **Comentário no código** | B — só WHY | Comentar apenas quando o motivo não é óbvio. Nunca comentar o WHAT. Ex: `// pct=0 não entra em nenhum bracket → multiplier=0` |
| **Explicação para o usuário** | A — detalhado | Ao explicar arquitetura ou mudança: linha a linha quando necessário. O usuário deve entender completamente o que está sendo construído antes de aprovar. |

> [!tip] Regra de ouro para comentários no código
> Se remover o comentário e o código ainda for legível → remover. Comentário existe para capturar contexto que não cabe no nome da variável/função.

---

## 3. Granularidade de Aprovação

Cada **tier** = grupo de mudanças por nível de risco/impacto, não por arquivo individual.

**Exemplo de tiers corretos:**
```
Tier 1 — Criar util (src/lib/[nome]Utils.ts) — risco zero, sem dependências
Tier 2 — Atualizar componentes que consomem o util — risco baixo
Tier 3 — Atualizar estado global / pages — risco médio
Tier 4 — Remover código antigo substituído — risco: verificar imports antes
```

> **[COMO PREENCHER]**
> Os exemplos acima usam `src/lib/` como caminho de utils. Adapte para a estrutura de pastas do projeto.

**Formato de apresentação de tier:**
```
Tier X — [nome]
  Arquivos: [lista]
  Risco: baixo / médio / alto
  Dependências: [o que precisa estar pronto antes]
  Estimativa: ~N linhas alteradas
```

---

## 4. Quando Discordo da Abordagem

Se a abordagem pedida tem problema técnico (viola perf, cria dívida, quebra padrão):

**Nunca implementar silenciosamente.** Sempre:

1. Reportar o problema antes de qualquer código
2. Identificar **onde vai quebrar** (arquivo, linha, cenário)
3. Apresentar tabela:

| | Abordagem pedida | Alternativa proposta |
|-|-----------------|----------------------|
| **Prós** | ... | ... |
| **Contras** | ... | ... |
| **Onde quebra** | ... | N/A |
| **Complexidade** | ... | ... |
| **Recomendação** | ← problema aqui | ← preferir |

4. Aguardar decisão do usuário. **Executar o que for aprovado**, não o que eu acho melhor.

> [!note] Princípio
> Minha função é informar os tradeoffs com precisão técnica. A decisão final é sempre do usuário.

---

## 5. Problemas Encontrados em Arquivos Adjacentes

Durante execução de um tier, ao encontrar bug / dead code / violação em arquivo não relacionado à tarefa:

- **Não interromper o tier em andamento**
- Registrar internamente o achado
- Ao final do tier, reportar: `"Encontrei também: [descrição] em [arquivo:linha]"`
- Ao final de **todos os tiers**, se houver dead code confirmado (zero imports), propor remoção em lote separado para aprovação

> [!warning] Dead code — nunca remover sem aprovação
> Ver [[dead-code-audit]] para protocolo completo.

---

## 6. Múltiplas Arquiteturas Válidas

Quando existem 2+ soluções técnicas válidas, **nunca escolher sozinho**. Apresentar:

```
## Opção A — [nome]
Descrição: ...
Prós: ...
Contras: ...
Complexidade de implementação: baixa / média / alta
Escalabilidade a longo prazo: boa / média / ruim
Alinhamento com padrões do projeto: sim / parcial / não

## Opção B — [nome]
...

## Recomendação
Opção X — motivo em 1-2 linhas.
```

Aguardar aprovação antes de qualquer código.

---

## 7. Build / TypeScript Failures Durante Execução

Se um tier causar erros de TS / build failure inesperado:

1. Tentar corrigir autonomamente — **máximo 2–3 tentativas**
2. Se não resolver: parar completamente
3. Reportar o erro exato (`"TS2345: Argument of type..."`) + arquivo + linha
4. Explicar o que tentei e por que não funcionou
5. Aguardar instrução do usuário

> [!warning] Nunca forçar build com `--no-verify`, `--force` ou similar sem aprovação explícita

---

## 8. Escalabilidade e Pensamento de Sistema

Em cada decisão técnica, pensar como um sistema de produção de grande escala:

- **Novo componente:** vai precisar suportar múltiplos temas? múltiplos módulos? internacionalização?
- **Nova função utilitária:** está em `src/lib/`? é genérica o suficiente para ser reutilizada em outro módulo?
- **Novo estado:** qual o ciclo de vida? quem precisa acessar? vai escalar para Context ou precisa de server state?
- **Nova query de banco:** tem políticas de acesso adequadas? performance com volume grande? índice necessário?

> **[COMO PREENCHER]**
> Adapte os bullets acima para a stack do projeto. Ex: se não usa TypeScript, remova a menção a TS. Se usa REST em vez de Supabase, troque "query Supabase" por "endpoint REST".

Propor a versão escalável desde o início, mesmo que a necessidade imediata seja pequena.

---

## 9. Operações Destrutivas

Antes de qualquer operação irreversível (delete arquivo, drop table, git reset --hard, rm -rf):

**Pausar e apresentar:**
```
⚠️ OPERAÇÃO DESTRUTIVA
Ação: [descrição exata]
Afeta: [arquivos / dados / branches]
Reversível: Não (ou: sim, via git)
Prosseguir?
```

Aguardar confirmação explícita. "Pode fazer tudo" de uma sessão anterior não autoriza operações destrutivas futuras.

---

## 10. Lógica de Negócio Ambígua

Quando a regra de negócio não está clara na documentação do vault:

**Nunca assumir e implementar.** Sempre:
1. Identificar o ponto ambíguo
2. Formular pergunta direta: `"Quando [condição X], o resultado deve ser [A] ou [B]?"`
3. Aguardar resposta antes de implementar
4. Registrar a decisão na nota de regra de negócio relevante

> **[COMO PREENCHER]**
> Substitua `{info}bussiness-rule/` pelo caminho real onde ficam as regras de negócio no vault do projeto.

---

## 11. Contexto da Sessão

Sessões longas preenchem o contexto do modelo. Quando a sessão estiver longa e complexa:

- Sinalizar proativamente: `"Sessão está longa — considere iniciar nova sessão se houver nova demanda"`
- Ao final de cada sessão complexa: garantir que o vault está atualizado (step 5 do fluxo), para que próxima sessão parta do estado documentado

---

## 12. Commits Git

> [!warning] Regra absoluta — sem exceções
> **O agente NUNCA faz commit.** Commits são responsabilidade exclusiva do usuário. Isso vale para qualquer mudança, de qualquer tamanho, em qualquer sessão.

O que o agente **pode** fazer:
- Sinalizar bons pontos de commit ao final de um tier: `"Bom ponto de commit — Tier X concluído, build OK, docs atualizados"`
- Preparar mensagem de commit sugerida quando solicitado (só texto, não executar)

O que o agente **nunca** faz:
- `git commit` (qualquer forma)
- `git push`
- `git add` seguido de commit
- Amend de commits existentes

Autorização de commit em sessão anterior **não** vale para sessões futuras.

---

## 13. Testing Policy

**Mínimo obrigatório:** o projeto compila sem erros.

> **[COMO PREENCHER]**
> Defina aqui o mínimo de testes exigido para o projeto. Exemplos:
> - TypeScript: compile sem erros (`tsc --noEmit`)
> - Python: `pytest` passa sem falhas
> - Qualquer stack: `npm run build` / `make` sem erros
>
> Recomendado para funções com lógica complexa: propor criação de unit test ao final do tier correspondente. Não bloquear aprovação por ausência de test — apenas sinalizar.

---

## 14. Documentação — Obrigatório no Step 5

Após cada sessão de mudanças, atualizar obrigatoriamente:

| O que mudou | Onde documentar |
|-------------|-----------------|
| Nova feature / componente | Nota correspondente no vault |
| Nova regra de negócio | Pasta de regras de negócio |
| Decisão arquitetural | Changelog com data |
| Novo arquivo utilitário | Nota de estrutura do projeto |
| DRY / extração | `dry-refactoring.md` seção "Estrutura atual" |
| Dead code removido | `dead-code-audit.md` seção correspondente |

> **[COMO PREENCHER]**
> Substitua as células da coluna "Onde documentar" pelos caminhos reais do vault do projeto.

Seguir todas as convenções OFM da skill `obsidian-documentation`: frontmatter obrigatório, wikilinks, callouts para destaques, tags hierárquicas.

---

## Referências

Ver também: [[coding-conventions]] | [[project-structure]] | [[dry-refactoring]] | [[dead-code-audit]] | [[separation-of-concerns]] | [[performance-audit]]

> **[COMO PREENCHER]**
> Atualize os wikilinks acima para os nomes reais dos arquivos no vault do projeto.
