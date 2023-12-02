const Mailgun = require('mailgun.js');
const formData = require('form-data');

const setupMailgun = async () => {
  const API_KEY = 'key-55fc0ad6b8c11d6819e387bf5964d5b2';
  const DOMAIN = 'mg.avlaa.mn';

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: 'api', key: API_KEY });

  const sendMailgunEmail = async ({
    to, subject, text, html,
  }) => {
    const messageData = {
      from: '<foo@example.com>', // sender address you can change it to your email
      to,
      subject,
      text,
      html,
    };

    const res = await client.messages.create(DOMAIN, messageData);

    console.log(res);
  };

  return sendMailgunEmail;
};

module.exports = { setupMailgun };
