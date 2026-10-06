const ProjectsRepo = {
  /** Projetos com Nome preenchido e Ativo marcado. */
  listActive() {
    return this.readAll().filter(p => p.active);
  },

  /** Todas as linhas com Nome, incluindo os valores crus (para reescrita pela sincronização). */
  readAll() {
    const sheet = this.sheet_();
    const n = this.countRows_(sheet);
    if (!n) return [];
    return sheet.getRange(MAIN_FIRST_ROW, 1, n, MAIN_NUM_COLS).getValues()
      .map((r, i) => this.toProject_(r, MAIN_FIRST_ROW + i))
      .filter(p => p.name);
  },

  /** updates: [{row, values:[7 cols]}]; inserts: [[7 cols]] — escrita em lote. */
  write(updates, inserts) {
    const sheet = this.sheet_();
    updates.forEach(u => sheet.getRange(u.row, 1, 1, MAIN_NUM_COLS).setValues([u.values]));
    if (inserts.length) {
      const start = MAIN_FIRST_ROW + this.countRows_(sheet);
      sheet.getRange(start, 1, inserts.length, MAIN_NUM_COLS).setValues(inserts);
    }
  },

  setSyncInfo(when, summary) {
    const sheet = this.sheet_();
    sheet.getRange(MAIN_CELL.SYNC_DATE).setValue(when);
    sheet.getRange(MAIN_CELL.SYNC_RESULT).setValue(summary);
  },

  uncheckSync() {
    this.sheet_().getRange(MAIN_CELL.SYNC).setValue(false);
  },

  /** Filtro do Sheets não reavalia sozinho quando valores mudam — reaplicar o critério de Ativo. */
  applyActiveFilter() {
    const sheet = this.sheet_();
    const headerRow = MAIN_FIRST_ROW - 1;
    let filter = sheet.getFilter();
    if (!filter) {
      filter = sheet.getRange(headerRow, 1, sheet.getMaxRows() - headerRow + 1, MAIN_NUM_COLS).createFilter();
    }
    filter.setColumnFilterCriteria(MAIN_COL.ACTIVE,
      SpreadsheetApp.newFilterCriteria().whenFormulaSatisfied(MAIN_ACTIVE_FILTER_FORMULA).build());
  },

  // getLastRow() conta os checkboxes vazios até o fim da grade — usar a última linha com Nome
  countRows_(sheet) {
    const max = sheet.getMaxRows() - MAIN_FIRST_ROW + 1;
    const names = sheet.getRange(MAIN_FIRST_ROW, MAIN_COL.NAME, max, 1).getValues();
    let last = 0;
    names.forEach((r, i) => { if (String(r[0]).trim()) last = i + 1; });
    return last;
  },

  toProject_(r, row) {
    return {
      row: row,
      raw: r.slice(),
      name: String(r[MAIN_COL.NAME - 1]).trim(),
      meetingTerms: String(r[MAIN_COL.MEETING - 1]).split(';').map(t => t.trim()).filter(Boolean),
      folderId: parseDriveFolderId_(r[MAIN_COL.FOLDER - 1]),
      taskQsId: parseTaskId_(r[MAIN_COL.TASK_QS - 1]),
      taskCommId: parseTaskId_(r[MAIN_COL.TASK_COMM - 1]),
      taskLogId: parseTaskId_(r[MAIN_COL.TASK_LOG - 1]),
      active: r[MAIN_COL.ACTIVE - 1] === true,
    };
  },

  sheet_() {
    return SpreadsheetApp.getActive().getSheetByName(SHEET_MAIN);
  },
};

/** Aceita URL de pasta (/folders/<id> ou ?id=<id>) ou o ID puro. */
function parseDriveFolderId_(value) {
  const s = String(value || '').trim();
  if (!s) return '';
  const m = s.match(/\/folders\/([A-Za-z0-9_-]+)/) || s.match(/[?&]id=([A-Za-z0-9_-]+)/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{20,}$/.test(s) ? s : '';
}

/** Aceita .../tasks/<id>, .../project.task/<id>, #id=<id> ou o número puro. */
function parseTaskId_(value) {
  const s = String(value || '').trim();
  if (!s) return null;
  const m = s.match(/\/tasks\/(\d+)/) || s.match(/project\.task\/(\d+)/) || s.match(/[#&?]id=(\d+)/) || s.match(/^(\d+)$/);
  return m ? Number(m[1]) : null;
}

/** Aceita .../project/<id>[/tasks], .../project.project/<id>, #id=<id>&model=project.project ou o número puro. */
function parseProjectId_(value) {
  const s = String(value || '').trim();
  if (!s) return null;
  const m = s.match(/\/project\/(\d+)/) || s.match(/project\.project\/(\d+)/) || s.match(/[#&?]id=(\d+)/) || s.match(/^(\d+)$/);
  return m ? Number(m[1]) : null;
}
