// API JSON-2 do odoo.com (PRODUÇÃO). Escritas exigem aprovação — ver documentation/{instructions}/ai-best-practices.md.
const OdooClient = {
  /** POST /json/2/<model>/<method> com kwargs nomeados. Lança Error sem nunca incluir a chave. */
  call(model, method, kwargs) {
    const conf = ConfRepo.get();
    this.assertKeyFresh_(conf);
    const headers = { Authorization: 'bearer ' + conf.key };
    if (conf.db) headers['X-Odoo-Database'] = conf.db;

    const res = UrlFetchApp.fetch(conf.url + '/json/2/' + model + '/' + method, {
      method: 'post',
      contentType: 'application/json',
      headers: headers,
      payload: JSON.stringify(kwargs || {}),
      muteHttpExceptions: true,
    });
    const code = res.getResponseCode();
    const text = res.getContentText();
    let body = null;
    try { body = JSON.parse(text); } catch (e) { /* corpo não-JSON (ex: HTML de erro) */ }
    if (code !== 200) {
      const msg = (body && (body.message || body.name)) || text.slice(0, 200);
      throw new Error('Odoo HTTP ' + code + ': ' + msg);
    }
    return body;
  },

  // JSON-2: limit 0 devolve 0 registros (não "sem limite") — omitir quando não informado
  searchRead(model, domain, fields, limit) {
    const kwargs = { domain: domain, fields: fields };
    if (limit) kwargs.limit = limit;
    return this.call(model, 'search_read', kwargs);
  },

  /** Somente leitura: {uid, name, lang}. */
  currentUser() {
    const ctx = this.call('res.users', 'context_get', {});
    const user = this.call('res.users', 'read', { ids: [ctx.uid], fields: ['name'] })[0];
    return { uid: ctx.uid, name: user.name, lang: ctx.lang };
  },

  taskUrl(projectId, taskId) {
    return ConfRepo.get().url + '/odoo/project/' + projectId + '/tasks/' + taskId;
  },

  assertKeyFresh_(conf) {
    if (!conf.url) throw new Error('URL do Odoo vazia (CONF!B2)');
    if (!conf.key) throw new Error('chave API vazia — colar em CONF!B5');
    if (!conf.keyDate || !isToday_(conf.keyDate)) throw new Error('chave expirada — colar nova chave em CONF!B5');
  },
};

function isToday_(date) {
  const tz = Session.getScriptTimeZone();
  return Utilities.formatDate(date, tz, 'yyyy-MM-dd') === Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
}
