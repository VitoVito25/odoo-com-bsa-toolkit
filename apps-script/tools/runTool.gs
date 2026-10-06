/**
 * Executa uma tool do registry: lock, try/catch, log em CONF, resultado em TOOLS, e-mail opcional.
 * ctx = { origin: ORIGIN.*, dryRun: boolean }
 */
function runTool(id, ctx) {
  const tool = getToolRegistry_().filter(t => t.id === id)[0];
  if (!tool) throw new Error('Tool desconhecida: ' + id);

  // evita duas execuções simultâneas movendo as mesmas pastas (ex: agendada + manual)
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    LogRepo.append({ tool: id, origin: ctx.origin, status: STATUS.WARN, summary: 'Ignorada: outra execução em andamento' });
    return null;
  }

  let result;
  try {
    result = tool.handler(ctx);
  } catch (e) {
    result = { status: STATUS.ERROR, summary: 'Erro: ' + e.message, detail: e.stack || String(e) };
  } finally {
    lock.releaseLock();
  }

  const now = new Date();
  LogRepo.append({ tool: id, origin: ctx.origin, status: result.status, summary: result.summary, detail: result.detail });
  ToolsRepo.updateResult(id, now, result.status + ' ' + result.summary);

  if (ConfRepo.get().sendEmail) {
    try {
      MailService.sendReport('BSA Toolkit — ' + tool.name + ' ' + result.status, result.summary + '\n\n' + (result.detail || ''));
    } catch (e) {
      LogRepo.append({ tool: id, origin: ctx.origin, status: STATUS.WARN, summary: 'Falha ao enviar e-mail: ' + e.message });
    }
  }

  try {
    TriggerService.refreshStatuses(); // atualiza "Próxima execução" após rodada agendada
  } catch (e) { /* sem permissão de ScriptApp no contexto — não bloqueia a tool */ }

  SpreadsheetApp.getActive().toast(result.summary, tool.name + ' ' + result.status, 8);
  return result;
}
