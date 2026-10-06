const MailService = {
  sendReport(subject, body) {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), subject, body);
  },
};
