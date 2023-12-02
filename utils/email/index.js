const { setupMailgun } = require('./mailgun');

/* eslint-disable no-unused-vars */
const mailService = {
  sendEmail: () => {
    throw new Error('Email service not configured');
  },
  // setupFn is a function that returns a sendEmail function
  // you can change mailservice to mailgun or nodemailer
  setup: async (setupFn) => {
    mailService.sendEmail = await setupFn();
  },
};

const sendVerificationCode = async (email, code) => {
  const subject = 'Verification Code';
  const text = `Your verification code is ${code}`;
  const html = `<p>Your verification code is <strong>${code}</strong></p>`;

  await mailService.sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

const send2FACode = async (email, code) => {
  const subject = '2FA Code';
  const text = `Your 2FA code is ${code}`;
  const html = `<p>Your 2FA code is <strong>${code}</strong></p>`;
  await mailService.sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

// you can change mailservice to mailgun or nodemailer
mailService.setup(setupMailgun);

module.exports = {
  sendEmail: mailService.sendEmail,
  sendVerificationCode,
  send2FACode,
};
