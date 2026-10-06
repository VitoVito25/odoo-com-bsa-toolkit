// Entry points: menu, gatilhos e funções de botão. Só roteiam — lógica fica em tools/ e services/.

function onOpen() {
  SpreadsheetApp.getUi().createMenu('BSA Toolkit')
    .addItem('Sincronizar projetos do Odoo', 'menuSyncProjects')
    .addSeparator()
    .addItem('Organizar gravações — simulação', 'menuOrganizeRecordingsDryRun')
    .addItem('Organizar gravações — executar', 'menuOrganizeRecordings')
    .addSeparator()
    .addItem('Testar conexão Odoo', 'testOdooConnection')
    .addItem('Sincronizar agendamentos', 'menuSyncSchedules')
    .addSeparator()
    .addItem('Instalar gatilhos (setup)', 'setup')
    .addToUi();
}

/** Rodar 1x pelo editor (ou menu): autoriza escopos, instala gatilhos de edição/abertura, alinha agendamentos. */
function setup() {
  const ss = SpreadsheetApp.getActive();
  const handlers = ['onEditInstalled', 'onOpenInstalled'];
  ScriptApp.getProjectTriggers()
    .filter(t => handlers.indexOf(t.getHandlerFunction()) !== -1)
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onEditInstalled').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('onOpenInstalled').forSpreadsheet(ss).onOpen().create();
  ToolsRepo.ensureRows(getToolRegistry_());
  TriggerService.syncAll();
  ss.toast('Gatilhos e agendamentos instalados.', 'BSA Toolkit', 5);
}

// simple onOpen não pode ler gatilhos (exige autorização) — versão instalável atualiza a TOOLS
function onOpenInstalled() {
  ToolsRepo.ensureRows(getToolRegistry_());
  TriggerService.refreshStatuses();
  ProjectsRepo.applyActiveFilter();
}

// Nome diferente de onEdit de propósito: simple trigger não pode chamar UrlFetch/Drive, e os dois rodariam em dobro.
function onEditInstalled(e) {
  const range = e.range;
  if (range.getNumRows() !== 1 || range.getNumColumns() !== 1) return;
  const sheet = range.getSheet().getName();
  const a1 = range.getA1Notation();
  const checked = e.value === 'TRUE';

  if (sheet === SHEET_CONF && a1 === CONF_CELL.KEY) {
    handleKeyEdited_();
  } else if (sheet === SHEET_CONF && a1 === CONF_CELL.TEST && checked) {
    testOdooConnection();
    ConfRepo.uncheckTest();
  } else if (sheet === SHEET_MAIN && range.getColumn() === MAIN_COL.ACTIVE && range.getRow() >= MAIN_FIRST_ROW) {
    ProjectsRepo.applyActiveFilter();
  } else if (sheet === SHEET_MAIN && a1 === MAIN_CELL.SYNC && checked) {
    try {
      runTool(TOOL_ID.SINCRONIZAR_PROJETOS, { origin: ORIGIN.MANUAL, dryRun: false });
    } finally {
      ProjectsRepo.uncheckSync();
    }
  } else if (sheet === SHEET_TOOLS && range.getRow() >= TOOLS_FIRST_ROW) {
    const id = ToolsRepo.idAtRow(range.getRow());
    if (!id) return;
    if (range.getColumn() === TOOLS_COL.SCHEDULE) {
      TriggerService.syncTool(id, String(e.value || SCHEDULE_MANUAL));
      TriggerService.refreshStatuses();
    } else if (range.getColumn() === TOOLS_COL.RUN && checked) {
      try {
        runTool(id, { origin: ORIGIN.MANUAL, dryRun: false });
      } finally {
        ToolsRepo.uncheckRun(range.getRow());
      }
    }
  }
}

/** Handler único dos gatilhos de tempo — descobre a tool pelo uid do gatilho. */
function runScheduledTool(e) {
  const id = e && e.triggerUid ? TriggerService.toolForTrigger(e.triggerUid) : null;
  if (id) runTool(id, { origin: ORIGIN.SCHEDULED, dryRun: false });
}

function handleKeyEdited_() {
  if (!ConfRepo.get().key) {
    ConfRepo.setKeyDate('');
    ConfRepo.setConnection('', '');
    return;
  }
  ConfRepo.setKeyDate(new Date());
  testOdooConnection();
}

function testOdooConnection() {
  let entry;
  try {
    const user = OdooClient.currentUser();
    ConfRepo.setConnection('✅ OK · uid ' + user.uid + ' · ' + user.lang, user.name);
    entry = { status: STATUS.OK, summary: 'Conexão OK — ' + user.name + ' (uid ' + user.uid + ')' };
  } catch (e) {
    ConfRepo.setConnection('❌ ' + e.message, '');
    entry = { status: STATUS.ERROR, summary: e.message };
  }
  LogRepo.append({ tool: TOOL_ID.TESTAR_CONEXAO_ODOO, origin: ORIGIN.MANUAL, status: entry.status, summary: entry.summary });
  SpreadsheetApp.getActive().toast(entry.summary, 'Conexão Odoo ' + entry.status, 6);
}

function menuSyncProjects() {
  runTool(TOOL_ID.SINCRONIZAR_PROJETOS, { origin: ORIGIN.MANUAL, dryRun: false });
}

function menuSyncSchedules() {
  TriggerService.syncAll();
  SpreadsheetApp.getActive().toast('Agendamentos alinhados com a aba TOOLS.', 'BSA Toolkit', 5);
}

function menuOrganizeRecordingsDryRun() {
  runTool(TOOL_ID.ORGANIZAR_GRAVACOES, { origin: ORIGIN.MANUAL, dryRun: true });
}

function menuOrganizeRecordings() {
  const ui = SpreadsheetApp.getUi();
  const ok = ui.alert('Organizar gravações', 'Mover de verdade as pastas de reunião? Rode a simulação antes.', ui.ButtonSet.YES_NO);
  if (ok === ui.Button.YES) runTool(TOOL_ID.ORGANIZAR_GRAVACOES, { origin: ORIGIN.MANUAL, dryRun: false });
}
