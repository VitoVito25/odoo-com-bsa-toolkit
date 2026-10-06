function organizarGravacoesMeet() {
  // 1. Dicionário de Mapeamento
  var mapeamentoPastas = {
    "Lisco": "1cX8eyjwXzLYCf-MupYS2yq2N6bzYz6sc",
    "Allconnection" : "1h47DdtT0im77RNRBtZkiEGuX-FLZb8HK",
    "Arthur": "1SBY9J1QIHeTAqHW0yU_By6TLAkThbOwX",
    "Villa": "13_ugwqLcwrXI-Y2aCLElCxSQIYmbWvvq",
    "GS Plast": "1LdxNkvAp8VVjFkO495eZirggNm_o-RYn",
    "Coengie": "1G6HCaHAHInFdjK2e1SXibUupI5u_Prdi",
    "Emporio": "1V-_p-qu6AyUBaHmkSWVMbQZJKpIVqqEd",
    "Bento": "1C122JqGBNNngR-BfNFxltulxGvsTYQeU",
    "Ana Carms": "16_mR2opSd_Bo0Varqmv1ADDYC70Iggdj",
    "RJLF": "1x6HfpTjyvbJX5_vRuN9M4-N27-kEVWJK",
    "Salabella": "1yO4aStkplQ2vpBJa28EIx_mTGlntauaz",
    "DESENVOLVUP": "1JK6nWtRdTmZkiG2Qfbtosnx1DtnStDI8",
    "Transmite Libras": "1bylINKhjnq_0ST3-HGKC_ER44tJyaycX",
    "Veneto": "1bbTxpmgmR6dUVsMVk4dRq65QMtLXaSQE",
    "DTCOM": "1CJNMsvPRaigPvFA6f0x9kFIvWUkAYq6A",
    "BXD": "1xvDq8Y_QE3pAAX8-xvvDvAsTU1gorj1Y",
    "Teak": "1Rfe3473ydyMwLoWh0_uEFmrutvba1Otb",
    "PR <>": "1eXYv78KqjOC8nZzJp7XucYL2etPOJEdQ",
    "EcoTimber": "1PfrXUImHdCaR9oiERyVPfvIJJWF8QvMq",
    "BRAZTERMICA": "12QbW8vOFlVdhUY-78lK0YWUGhSOlQ5N6",
    "SINUCA DESIGN": "1aAxhp4yi1KfQnirjb7mgTebGlR5-PlkO",
    "TOPE URBANO": "1OMM4sMUDyG0Zw5r81_QM8pVdZ4FYul-8",
    "ZOOLUTION": "1A1OPNH1F0bixCgUcIdv1-56Wc1DAdSDW",
    "Cata": "1b_9RzXtQvlQJ9gJpI8X_aTtdDUMh8NJJ",
    "Gofix": "1LpQwMN7Pz-v4bA1VU3x1FvqOTqHb4Mbb",
    "Doces Sorriso": "1r_aQAkqSqo6EgTnw6lO6HE9tgyP4yxet",
    "PlugCar": "1c67E_4wYmgpkNnn4ZelBwVivzGh-ZmHp",
    "RTC": "1cmcdk4eJWh6maIrI69KVilN3FvBqren-",
    "Ponto": "1JaGAevlyS9FfihknxGkrtFk5cKPUv3pk",
    "REDRADE": "1CzX51ajy2PMjV3zV0QSB1cOi6hTzLPif",
    "GS Metal Plast": "1LdxNkvAp8VVjFkO495eZirggNm_o-RYn",
    "Ática": "1L6OmKoKS8UIwy6ca0B0FbucK2Z6lUrT3",
    "Emerald": "150wIsMSUwAcp_YDb81wBus9zY0cRMmty",
    "Singular": "1FlCO4Ajkr22xIBZUSsVdCgs-xn93Si6H",
    "Passaporte": "1eEW6A4yz5H2T8UcTPWQuwBNiR2QByfNL",
    "Tegg": "1KEhN5h1FzHAT41zzaZY7EuKS2BiU2N82",
    "Lawi": "1XBvtoCZIE6OZnwA3PSdztK58hm_yzCt9",
    "Passap <>": "197L1BTBJhWsuK1NrLZEY2rsF1SFMtbd3",
    "Editali <>": "1JJvQ7_ykqzwWFVE1mHR_l-ZnQ6nJ-Krb",
    "Master Fluido <>": "15J9Cp3ZQCAKIxvMpdy1N1RKpV0ATtENv",
    "RRMAN": "1_WEU9aepBi1BRsoyPYncNZ62EeI-HQ7L",
    "WNS": "11KMDtTPERaCRkkP9HgYWEdVJQ0HBB4QQ"
  };

  // 2. Identificação da pasta de origem (Google mudou nome/estrutura)
  var nomePastaOrigem = 'Google Meet';
  var pastasOrigem = DriveApp.getFoldersByName(nomePastaOrigem);

  var logExecucao = "";
  var contadorSucesso = 0;
  var contadorPendentes = 0;

  if (pastasOrigem.hasNext()) {
    var pastaOrigem = pastasOrigem.next();
    var subpastasReuniao = pastaOrigem.getFolders(); // cada reunião = 1 pasta (gravação + transcrição + chat)

    logExecucao += "--- Relatório de Processamento (" + new Date().toLocaleString() + ") ---\n\n";

    // 3. Loop para cada PASTA de reunião
    while (subpastasReuniao.hasNext()) {
      var pastaReuniao = subpastasReuniao.next();
      var nomePasta = pastaReuniao.getName();
      var foiMovido = false;

      for (var termoChave in mapeamentoPastas) {
        if (nomePasta.toLowerCase().includes(termoChave.toLowerCase())) {
          var idDestino = mapeamentoPastas[termoChave];
          var pastaDestino = DriveApp.getFolderById(idDestino);

          pastaReuniao.moveTo(pastaDestino); // Folder.moveTo() existe, mesma assinatura do File

          var msgSucesso = "✅ MOVIDO: \"" + nomePasta + "\" -> Pasta: [" + termoChave + "]\n";
          logExecucao += msgSucesso;
          Logger.log(msgSucesso);

          foiMovido = true;
          contadorSucesso++;
          break;
        }
      }

      if (!foiMovido) {
        var msgPendente = "⚠️ PENDENTE: \"" + nomePasta + "\" (Sem correspondência)\n";
        logExecucao += msgPendente;
        Logger.log(msgPendente);
        contadorPendentes++;
      }
    }

    if (contadorSucesso === 0 && contadorPendentes === 0) {
      logExecucao += "Nenhuma pasta de reunião encontrada para processar em '" + nomePastaOrigem + "'.\n";
    }

    // --- Envio do E-mail (Sempre executado ao final) ---
    var emailResponsavel = Session.getActiveUser().getEmail();
    var statusFinal = (contadorPendentes > 0) ? "⚠️ Pendências" : "✅ Sucesso";
    var assunto = "Relatório: Organização de Gravações Meet - " + statusFinal;

    var corpoEmail = "Relatório gerado automaticamente pelo script:\n\n" +
                     "Resumo:\n" +
                     "- Organizados: " + contadorSucesso + "\n" +
                     "- Não identificados: " + contadorPendentes + "\n\n" +
                     "Histórico Detalhado:\n" +
                     "--------------------------------------------------\n" +
                     logExecucao +
                     "\n--------------------------------------------------";

    MailApp.sendEmail(emailResponsavel, assunto, corpoEmail);
    console.log('Relatório enviado para: ' + emailResponsavel);

  } else {
    console.log('Erro: Pasta "' + nomePastaOrigem + '" não encontrada. Script interrompido.');
  }
}