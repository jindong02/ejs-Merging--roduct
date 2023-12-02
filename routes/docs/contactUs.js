const { ContactUsModel } = require('../../models/contactus');

const contactUs = async (req, res) => {
  try {
    const {
      username, email, message, reason,
    } = req.body;

    const contactus = new ContactUsModel({
      username: username && req.user.username ? req.user.username : undefined,
      email,
      message,
      reason,
    });

    contactus.save();

    req.flash('success', `Message Successfully sent, ${contactus.email ? 'you should hear from us soon' : undefined}`);
    res.redirect('/contactus');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { contactUs };
