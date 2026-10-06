// Regra completa: documentation/{info}/recording-routing-rule.md

function runRecordingOrganizer_(ctx) {
  const conf = ConfRepo.get();
  if (!conf.sourceFolderId) throw new Error('pasta de origem não configurada (CONF!B11)');

  const projects = ProjectsRepo.listActive().filter(p => p.meetingTerms.length);
  const folders = DriveService.listSubfolders(conf.sourceFolderId);
  const lines = findDuplicateTerms_(projects).map(t => '⚠️ TERMO DUPLICADO na MAIN: "' + t + '" — reuniões com ele ficarão ambíguas');
  const count = { moved: 0, pending: 0, errors: 0 };

  folders.forEach(f => {
    const m = findProjectForFolder_(f.name, projects);
    if (m.status === 'none') {
      count.pending++;
      lines.push('⚠️ PENDENTE: "' + f.name + '" (sem correspondência)');
    } else if (m.status === 'ambiguous') {
      count.pending++;
      lines.push('⚠️ PENDENTE: "' + f.name + '" (ambíguo: ' + m.candidates.join(', ') + ')');
    } else if (!m.project.folderId) {
      count.pending++;
      lines.push('⚠️ PENDENTE: "' + f.name + '" → [' + m.project.name + '] sem Pasta Gravação válida (MAIN linha ' + m.project.row + ')');
    } else if (ctx.dryRun) {
      count.moved++;
      lines.push('🔎 MOVERIA: "' + f.name + '" → [' + m.project.name + '] (termo "' + m.term + '")');
    } else {
      try {
        DriveService.moveFolder(f.folder, m.project.folderId);
        count.moved++;
        lines.push('✅ MOVIDO: "' + f.name + '" → [' + m.project.name + ']');
      } catch (e) {
        count.errors++;
        lines.push('❌ ERRO: "' + f.name + '" → [' + m.project.name + ']: ' + e.message);
      }
    }
  });

  const verb = ctx.dryRun ? 'moveria' : 'movidas';
  const summary = (ctx.dryRun ? '[SIMULAÇÃO] ' : '') + folders.length + ' pastas: ' + count.moved + ' ' + verb + ', ' +
    count.pending + ' pendentes, ' + count.errors + ' erros';
  const status = count.errors ? STATUS.ERROR : count.pending ? STATUS.WARN : STATUS.OK;
  return { status: status, summary: summary, detail: lines.join('\n') || 'Nenhuma pasta na origem.' };
}

/** Pura: {status:'match', project, term} | {status:'none'} | {status:'ambiguous', candidates:[nomes]}. */
function findProjectForFolder_(folderName, projects) {
  const name = normalizeText_(folderName);
  const best = []; // maior termo casado por projeto
  projects.forEach(p => {
    let hit = null;
    p.meetingTerms.forEach(raw => {
      const term = normalizeText_(raw);
      if (term && matchesWholeTerm_(name, term) && (!hit || term.length > hit.term.length)) hit = { project: p, term: term };
    });
    if (hit) best.push(hit);
  });

  if (!best.length) return { status: 'none' };
  best.sort((a, b) => b.term.length - a.term.length);
  const winner = best[0];
  // vence só se os outros termos estão contidos no dele (ex: "passap" ⊂ "passap edu")
  const absorbsOthers = best.slice(1).every(o => o.term.length < winner.term.length && winner.term.indexOf(o.term) !== -1);
  if (best.length === 1 || absorbsOthers) return { status: 'match', project: winner.project, term: winner.term };
  return { status: 'ambiguous', candidates: best.map(b => b.project.name) };
}

function normalizeText_(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function matchesWholeTerm_(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(^|[^a-z0-9])' + escaped + '($|[^a-z0-9])').test(text);
}

function findDuplicateTerms_(projects) {
  const owner = {};
  const dupes = [];
  projects.forEach(p => p.meetingTerms.forEach(raw => {
    const t = normalizeText_(raw);
    if (owner[t] !== undefined && owner[t] !== p.row && dupes.indexOf(t) === -1) dupes.push(t);
    owner[t] = p.row;
  }));
  return dupes;
}
