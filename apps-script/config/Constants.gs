// Única fonte de coordenadas da planilha — mover algo de lugar = mudar só aqui.

const SHEET_MAIN = 'MAIN';
const SHEET_TOOLS = 'TOOLS';
const SHEET_CONF = 'CONF';

const MAIN_FIRST_ROW = 6;
const MAIN_NUM_COLS = 7;
const MAIN_COL = { NAME: 1, MEETING: 2, FOLDER: 3, TASK_QS: 4, TASK_COMM: 5, TASK_LOG: 6, ACTIVE: 7 };
const MAIN_CELL = { SYNC: 'F2', SYNC_DATE: 'B3', SYNC_RESULT: 'C3' };
// Filtro da tabela: mostra só Ativo marcado. Fórmula relativa à 1ª linha de dados (sem funções → independe do locale).
const MAIN_ACTIVE_FILTER_FORMULA = '=G6';

const TEXT_COLOR = '#374151';

const TOOLS_FIRST_ROW = 2;
const TOOLS_NUM_COLS = 9;
const TOOLS_COL = { ID: 1, NAME: 2, DESC: 3, RUN: 4, SCHEDULE: 5, SCHED_STATUS: 6, NEXT_RUN: 7, LAST_RUN: 8, LAST_RESULT: 9 };

// CONF!B2:B13 é lido de uma vez; índices relativos a B2.
const CONF_RANGE = 'B2:B13';
const CONF_IDX = { URL: 0, DB: 1, USER: 2, KEY: 3, KEY_DATE: 4, STATUS: 5, TEST: 6, SOURCE_FOLDER: 9, SEND_EMAIL: 10, PROJECT_QS: 11 };
const CONF_CELL = { USER: 'B4', KEY: 'B5', KEY_DATE: 'B6', STATUS: 'B7', TEST: 'B8' };

const LOG_HEADER_ROW = 15;
const LOG_NUM_COLS = 6;
const LOG_MAX_ROWS = 1000;
const LOG_ROW_HEIGHT = 22;
const CELL_MAX_CHARS = 49000; // limite do Sheets é 50k por célula

const TOOL_ID = {
  ORGANIZAR_GRAVACOES: 'ORGANIZAR_GRAVACOES',
  SINCRONIZAR_PROJETOS: 'SINCRONIZAR_PROJETOS',
  TESTAR_CONEXAO_ODOO: 'TESTAR_CONEXAO_ODOO',
};

const ORIGIN = { MANUAL: 'Manual', SCHEDULED: 'Agendado' };
const STATUS = { OK: '✅', WARN: '⚠️', ERROR: '❌' };

// Rótulos = opções do dropdown TOOLS!E. Mudar aqui exige mudar a validação da planilha.
const SCHEDULE_MANUAL = 'Manual';
const SCHEDULES = {
  'A cada hora': { kind: 'hours', every: 1 },
  'A cada 6h': { kind: 'hours', every: 6 },
  'Diário 08h': { kind: 'daily', hour: 8 },
  'Diário 18h': { kind: 'daily', hour: 18 },
  'Semanal (seg 08h)': { kind: 'weekly', weekday: 1, hour: 8 },
};

// Estados de project.task no Odoo 17+ que encerram o projeto
const ODOO_CLOSED_STATES = ['1_done', '1_canceled'];
