const nodemailer = require('nodemailer');

const setupNodeMailer = async () => {
  // you can remove it in production
  let testAccount = await nodemailer.createTestAccount();

  // you can use other email services in production like gmail, outlook, etc.
  // smtp.ethereal.email is a test email service
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // host: 'smtp.gmail.com', // gmail host and port if you want to use gmail account
  // port: 465,

  const sendNodeMailerEmail = async ({
    to, subject, text, html,
  }) => {
    let info = await transporter.sendMail({
      from: '<foo@example.com>', // sender address you can change it to your email
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  };

  return sendNodeMailerEmail;
};

module.exports = { setupNodeMailer };
