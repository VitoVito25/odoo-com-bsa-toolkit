const ConfRepo = {
  get() {
    const v = this.sheet_().getRange(CONF_RANGE).getValues().map(r => r[0]);
    return {
      url: String(v[CONF_IDX.URL] || '').trim().replace(/\/+$/, ''),
      db: String(v[CONF_IDX.DB] || '').trim(),
      key: String(v[CONF_IDX.KEY] || '').trim(),
      keyDate: v[CONF_IDX.KEY_DATE] instanceof Date ? v[CONF_IDX.KEY_DATE] : null,
      sourceFolderId: parseDriveFolderId_(v[CONF_IDX.SOURCE_FOLDER]),
      sendEmail: v[CONF_IDX.SEND_EMAIL] === true,
      projectQsId: parseProjectId_(v[CONF_IDX.PROJECT_QS]),
    };
  },

  setKeyDate(date) {
    this.sheet_().getRange(CONF_CELL.KEY_DATE).setValue(date || '');
  },

  /** status em B7; userName em B4 (usado na saudação da MAIN). */
  setConnection(status, userName) {
    const sheet = this.sheet_();
    sheet.getRange(CONF_CELL.STATUS).setValue(status);
    sheet.getRange(CONF_CELL.USER).setValue(userName || '');
  },

  uncheckTest() {
    this.sheet_().getRange(CONF_CELL.TEST).setValue(false);
  },

  sheet_() {
    return SpreadsheetApp.getActive().getSheetByName(SHEET_CONF);
  },
};
