const DriveService = {
  /** Subpastas diretas (cada reunião do Meet = 1 pasta). Arquivos soltos são ignorados. */
  listSubfolders(parentId) {
    const it = DriveApp.getFolderById(parentId).getFolders();
    const out = [];
    while (it.hasNext()) {
      const f = it.next();
      out.push({ id: f.getId(), name: f.getName(), folder: f });
    }
    return out;
  },

  moveFolder(folder, destinationId) {
    folder.moveTo(this.getFolder_(destinationId));
  },

  // memo por execução: vários projetos podem compartilhar a mesma pasta destino
  getFolder_(id) {
    this.cache_ = this.cache_ || {};
    if (!this.cache_[id]) this.cache_[id] = DriveApp.getFolderById(id);
    return this.cache_[id];
  },
};
