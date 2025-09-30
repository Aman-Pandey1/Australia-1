const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
      secure: false
    });
  }
  return transporter;
}

async function sendMail(to, subject, text) {
  const t = getTransporter();
  await t.sendMail({ from: env.smtp.from, to, subject, text });
}

module.exports = { sendMail };

