// Função (não const) porque a ordem de carga dos .gs não é garantida — handlers de outros arquivos
// só existem com certeza em tempo de execução.
function getToolRegistry_() {
  return [
    {
      id: TOOL_ID.ORGANIZAR_GRAVACOES,
      name: 'Organizar gravações Meet',
      description: 'Move as pastas de reunião da pasta de origem (CONF!B11) para a Pasta Gravação de cada projeto da MAIN.',
      handler: runRecordingOrganizer_,
    },
    {
      id: TOOL_ID.SINCRONIZAR_PROJETOS,
      name: 'Sincronizar projetos do Odoo',
      description: 'Puxa as tarefas principais do projeto QS (CONF!B13) em que você é responsável e atualiza a MAIN (novos projetos, Ativo, links de tarefa). Só leitura no Odoo.',
      handler: runProjectSync_,
    },
  ];
}
