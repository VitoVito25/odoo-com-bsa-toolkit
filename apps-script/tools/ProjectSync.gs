// Regra completa: documentation/{info}/project-sync-rule.md
// Odoo: somente leitura. Escreve só na aba MAIN.

function runProjectSync_(ctx) {
  const conf = ConfRepo.get();
  if (!conf.projectQsId) throw new Error('link do projeto QS não configurado (CONF!B13)');

  const user = OdooClient.currentUser();
  const tasks = OdooClient.searchRead('project.task',
    [['project_id', '=', conf.projectQsId], ['user_ids', 'in', [user.uid]], ['parent_id', '=', false]],
    ['name', 'state']);
  const commByParent = {};
  if (tasks.length) {
    OdooClient.searchRead('project.task',
      [['parent_id', 'in', tasks.map(t => t.id)], ['name', 'ilike', 'comunica']],
      ['parent_id'], 0)
      .forEach(c => { if (!commByParent[c.parent_id[0]]) commByParent[c.parent_id[0]] = c.id; });
  }

  const rows = ProjectsRepo.readAll();
  const plan = planProjectSync_(tasks, rows, commByParent);
  const url = id => OdooClient.taskUrl(conf.projectQsId, id);

  const updates = plan.updates.map(u => {
    const v = u.project.raw.slice();
    v[MAIN_COL.ACTIVE - 1] = u.active;
    if (u.fillQs) v[MAIN_COL.TASK_QS - 1] = url(u.taskId);
    if (u.fillComm) v[MAIN_COL.TASK_COMM - 1] = url(u.commId);
    return { row: u.project.row, values: v };
  });
  const inserts = plan.inserts.map(i => {
    const v = ['', '', '', '', '', '', false];
    v[MAIN_COL.NAME - 1] = i.name;
    v[MAIN_COL.TASK_QS - 1] = url(i.taskId);
    v[MAIN_COL.TASK_COMM - 1] = i.commId ? url(i.commId) : '';
    v[MAIN_COL.ACTIVE - 1] = i.active;
    return v;
  });

  const summary = (ctx.dryRun ? '[SIMULAÇÃO] ' : '') + tasks.length + ' tarefas: ' + plan.updates.length + ' atualizadas (' +
    plan.deactivated + ' desativadas), ' + plan.inserts.length + ' novas, ' + plan.warnings.length + ' avisos';
  if (!ctx.dryRun) {
    ProjectsRepo.write(updates, inserts);
    ProjectsRepo.setSyncInfo(new Date(), summary);
    ProjectsRepo.applyActiveFilter();
  }
  return { status: plan.warnings.length ? STATUS.WARN : STATUS.OK, summary: summary, detail: plan.lines.concat(plan.warnings).join('\n') };
}

/**
 * Pura. tasks: [{id, name, state}] · rows: projetos de ProjectsRepo.readAll() · commByParent: {taskId: commTaskId}
 * Match: 1) ID da Tarefa QS  2) Nome igual  3) termo (Nome + Nome Reunião) no nome da tarefa — mais longo vence.
 */
function planProjectSync_(tasks, rows, commByParent) {
  const out = { updates: [], inserts: [], warnings: [], lines: [], deactivated: 0 };
  const usedRows = {};
  tasks.forEach(t => {
    const active = ODOO_CLOSED_STATES.indexOf(t.state) === -1;
    const commId = commByParent[t.id] || null;
    const m = findRowForTask_(t, rows);
    if (m.status === 'ambiguous') {
      out.warnings.push('⚠️ AMBÍGUO: tarefa "' + t.name + '" casa com ' + m.candidates.join(', ') + ' — nada alterado');
      return;
    }
    if (m.status === 'none') {
      out.inserts.push({ name: t.name, taskId: t.id, commId: commId, active: active });
      out.lines.push('➕ NOVO: "' + t.name + '"' + (active ? '' : ' (inativo)') + ' — preencher Nome Reunião e Pasta Gravação');
      return;
    }
    const p = m.project;
    if (usedRows[p.row]) {
      out.warnings.push('⚠️ DUPLICADO: tarefa "' + t.name + '" casa com [' + p.name + '], já usada por outra tarefa — nada alterado');
      return;
    }
    usedRows[p.row] = true;
    const fillQs = !p.taskQsId;
    const fillComm = !p.taskCommId && !!commId;
    if (p.active === active && !fillQs && !fillComm) return;
    if (p.active && !active) out.deactivated++;
    out.updates.push({ project: p, taskId: t.id, commId: commId, active: active, fillQs: fillQs, fillComm: fillComm });
    const changes = [];
    if (p.active !== active) changes.push(active ? 'reativado' : 'desativado (' + t.state + ')');
    if (fillQs) changes.push('Tarefa QS preenchida');
    if (fillComm) changes.push('Tarefa de Comunicação preenchida');
    out.lines.push('✏️ [' + p.name + '] ← "' + t.name + '": ' + changes.join(', ') + (m.via ? ' (via ' + m.via + ')' : ''));
  });
  return out;
}

function findRowForTask_(task, rows) {
  const byId = rows.filter(p => p.taskQsId === task.id);
  if (byId.length === 1) return { status: 'match', project: byId[0], via: 'ID' };

  const name = syncNormalize_(task.name);
  const byName = rows.filter(p => syncNormalize_(p.name) === name);
  if (byName.length === 1) return { status: 'match', project: byName[0], via: 'nome' };

  const best = [];
  rows.forEach(p => {
    if (p.taskQsId) return; // linha já ligada a outra tarefa por ID
    let hit = null;
    [p.name].concat(p.meetingTerms).forEach(raw => {
      const term = syncNormalize_(raw);
      if (term && matchesTaskTerm_(name, term) && (!hit || term.length > hit.term.length)) hit = { project: p, term: term };
    });
    if (hit) best.push(hit);
  });
  if (!best.length) return { status: 'none' };
  best.sort((a, b) => b.term.length - a.term.length);
  const winner = best[0];
  const absorbs = best.slice(1).every(o => o.term.length < winner.term.length && winner.term.indexOf(o.term) !== -1);
  if (best.length === 1 || absorbs) return { status: 'match', project: winner.project, via: 'termo "' + winner.term + '"' };
  return { status: 'ambiguous', candidates: best.map(b => '[' + b.project.name + ']') };
}

// "<>" é convenção de título de reunião ("PR <> Odoo"), não faz parte do nome do cliente
function syncNormalize_(s) {
  return normalizeText_(String(s || '').replace(/<>/g, ' '));
}

// Termo curto (< 5) exige palavra inteira; longo aceita prefixo ("passaporte" → "passaportes")
function matchesTaskTerm_(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const end = term.length < 5 ? '($|[^a-z0-9])' : '';
  return new RegExp('(^|[^a-z0-9])' + escaped + end).test(text);
}
