const ToolsRepo = {
  /** Cria linha para cada tool do registry que ainda não está na aba. */
  ensureRows(registry) {
    const sheet = this.sheet_();
    const ids = this.readIds_(sheet);
    const missing = registry.filter(t => ids.indexOf(t.id) === -1);
    if (!missing.length) return;
    // getLastRow() conta os checkboxes vazios até o fim da grade — usar o último ID preenchido
    let lastIdIdx = -1;
    ids.forEach((id, i) => { if (id) lastIdIdx = i; });
    const start = TOOLS_FIRST_ROW + lastIdIdx + 1;
    sheet.getRange(start, 1, missing.length, TOOLS_NUM_COLS).setValues(
      missing.map(t => [t.id, t.name, t.description, false, SCHEDULE_MANUAL, '⏸ Manual', '', '', ''])
    );
  },

  /** [{row, id, schedule}] das linhas com ID. */
  readRows() {
    const sheet = this.sheet_();
    const ids = this.readIds_(sheet);
    if (!ids.length) return [];
    const schedules = sheet.getRange(TOOLS_FIRST_ROW, TOOLS_COL.SCHEDULE, ids.length, 1).getValues();
    return ids
      .map((id, i) => ({ row: TOOLS_FIRST_ROW + i, id: id, schedule: String(schedules[i][0]).trim() || SCHEDULE_MANUAL }))
      .filter(r => r.id);
  },

  idAtRow(row) {
    return String(this.sheet_().getRange(row, TOOLS_COL.ID).getValue()).trim();
  },

  writeScheduleStatus(row, status, nextRun) {
    this.sheet_().getRange(row, TOOLS_COL.SCHED_STATUS, 1, 2).setValues([[status, nextRun]]);
  },

  updateResult(id, when, resultText) {
    const sheet = this.sheet_();
    const idx = this.readIds_(sheet).indexOf(id);
    if (idx === -1) return;
    sheet.getRange(TOOLS_FIRST_ROW + idx, TOOLS_COL.LAST_RUN, 1, 2).setValues([[when, resultText]]);
  },

  uncheckRun(row) {
    this.sheet_().getRange(row, TOOLS_COL.RUN).setValue(false);
  },

  readIds_(sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow < TOOLS_FIRST_ROW) return [];
    return sheet.getRange(TOOLS_FIRST_ROW, TOOLS_COL.ID, lastRow - TOOLS_FIRST_ROW + 1, 1)
      .getValues().map(r => String(r[0]).trim());
  },

  sheet_() {
    return SpreadsheetApp.getActive().getSheetByName(SHEET_TOOLS);
  },
};
