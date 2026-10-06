const LogRepo = {
  /** Insere no topo do log (mais recente primeiro) e corta acima de LOG_MAX_ROWS. */
  append(entry) {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_CONF);
    const firstRow = LOG_HEADER_ROW + 1;
    sheet.insertRowsAfter(LOG_HEADER_ROW, 1);
    // linha nova herda o estilo do cabeçalho (fundo roxo, texto branco) — resetar
    sheet.getRange(firstRow, 1, 1, LOG_NUM_COLS)
      .setFontWeight('normal')
      .setFontColor(TEXT_COLOR)
      .setBackground(null)
      .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
      .setValues([[
        new Date(),
        entry.tool,
        entry.origin || ORIGIN.MANUAL,
        entry.status,
        String(entry.summary || '').slice(0, CELL_MAX_CHARS),
        String(entry.detail || '').slice(0, CELL_MAX_CHARS),
      ]]);
    sheet.getRange(firstRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    // Detalhe tem várias linhas — sem altura fixa a linha cresce e ocupa a tela; texto completo fica na barra de fórmulas
    sheet.setRowHeightsForced(firstRow, 1, LOG_ROW_HEIGHT);

    const lastAllowed = LOG_HEADER_ROW + LOG_MAX_ROWS;
    const lastRow = sheet.getLastRow();
    if (lastRow > lastAllowed) sheet.deleteRows(lastAllowed + 1, lastRow - lastAllowed);
  },
};
