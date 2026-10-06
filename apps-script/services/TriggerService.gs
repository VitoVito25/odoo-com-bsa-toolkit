// A API não expõe a frequência de um gatilho — a aba TOOLS é a fonte da verdade e este serviço reconcilia.
// ScriptProperties: trigger:<toolId> = uid · triggerTool:<uid> = toolId · triggerLabel:<toolId> = rótulo · triggerCreated:<toolId> = ISO
const SCHEDULED_HANDLER = 'runScheduledTool';

const TriggerService = {
  /** Recria o gatilho de uma tool conforme o rótulo do dropdown. */
  syncTool(toolId, label) {
    this.deleteForTool_(toolId);
    const spec = SCHEDULES[label];
    if (!spec) return; // Manual ou rótulo desconhecido
    let builder = ScriptApp.newTrigger(SCHEDULED_HANDLER).timeBased();
    if (spec.kind === 'hours') builder = builder.everyHours(spec.every);
    else if (spec.kind === 'daily') builder = builder.atHour(spec.hour).everyDays(1);
    else builder = builder.onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(spec.hour);
    const uid = builder.create().getUniqueId();
    const props = PropertiesService.getScriptProperties();
    props.setProperties({
      ['trigger:' + toolId]: uid,
      ['triggerTool:' + uid]: toolId,
      ['triggerLabel:' + toolId]: label,
      ['triggerCreated:' + toolId]: new Date().toISOString(),
    });
  },

  /** Alinha todos os gatilhos com a aba TOOLS e apaga gatilhos órfãos. */
  syncAll() {
    const props = PropertiesService.getScriptProperties();
    const rows = ToolsRepo.readRows();
    const live = this.liveUids_();
    rows.forEach(r => {
      const uid = props.getProperty('trigger:' + r.id);
      const sameLabel = props.getProperty('triggerLabel:' + r.id) === r.schedule;
      const wantsTrigger = !!SCHEDULES[r.schedule];
      if (wantsTrigger && (!uid || !live[uid] || !sameLabel)) this.syncTool(r.id, r.schedule);
      if (!wantsTrigger && uid) this.deleteForTool_(r.id);
    });
    const known = {};
    rows.forEach(r => { const u = props.getProperty('trigger:' + r.id); if (u) known[u] = true; });
    ScriptApp.getProjectTriggers()
      .filter(t => t.getHandlerFunction() === SCHEDULED_HANDLER && !known[t.getUniqueId()])
      .forEach(t => ScriptApp.deleteTrigger(t));
    this.refreshStatuses();
  },

  /** Escreve Status agendamento + Próxima execução de cada linha da TOOLS. */
  refreshStatuses() {
    const props = PropertiesService.getScriptProperties();
    const live = this.liveUids_();
    ToolsRepo.readRows().forEach(r => {
      const uid = props.getProperty('trigger:' + r.id);
      const hasTrigger = !!(uid && live[uid]);
      const wantsTrigger = !!SCHEDULES[r.schedule];
      let status;
      let next = '';
      if (!wantsTrigger) {
        status = hasTrigger ? '⚠️ Divergente — use Sincronizar agendamentos' : '⏸ Manual';
      } else if (!hasTrigger || props.getProperty('triggerLabel:' + r.id) !== r.schedule) {
        status = '⚠️ Divergente — use Sincronizar agendamentos';
      } else {
        status = '✅ Ativo';
        const created = new Date(props.getProperty('triggerCreated:' + r.id) || Date.now());
        next = '~ ' + Utilities.formatDate(nextRun_(SCHEDULES[r.schedule], created, new Date()), Session.getScriptTimeZone(), 'dd/MM HH:mm');
      }
      ToolsRepo.writeScheduleStatus(r.row, status, next);
    });
  },

  toolForTrigger(uid) {
    return PropertiesService.getScriptProperties().getProperty('triggerTool:' + uid);
  },

  deleteForTool_(toolId) {
    const props = PropertiesService.getScriptProperties();
    const uid = props.getProperty('trigger:' + toolId);
    if (uid) {
      ScriptApp.getProjectTriggers().filter(t => t.getUniqueId() === uid).forEach(t => ScriptApp.deleteTrigger(t));
      props.deleteProperty('triggerTool:' + uid);
    }
    ['trigger:', 'triggerLabel:', 'triggerCreated:'].forEach(p => props.deleteProperty(p + toolId));
  },

  liveUids_() {
    const live = {};
    ScriptApp.getProjectTriggers().forEach(t => { live[t.getUniqueId()] = true; });
    return live;
  },
};

/** Pura: próxima execução aproximada (o Google roda dentro de ~15 min do horário). */
function nextRun_(spec, created, now) {
  const HOUR = 3600 * 1000;
  if (spec.kind === 'hours') {
    const step = spec.every * HOUR;
    const k = Math.max(1, Math.ceil((now - created) / step));
    return new Date(created.getTime() + k * step);
  }
  const d = new Date(now);
  d.setHours(spec.hour, 0, 0, 0);
  if (spec.kind === 'daily') {
    if (d <= now) d.setDate(d.getDate() + 1);
    return d;
  }
  let add = (spec.weekday - d.getDay() + 7) % 7;
  if (add === 0 && d <= now) add = 7;
  d.setDate(d.getDate() + add);
  return d;
}
