const mongoose = require('mongoose');

const contactusSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  archived: {
    type: Boolean,
  },
});

contactusSchema.methods.deleteContactUs = async function () {
  await this.delete();
};

const ContactUsModel = mongoose.model('Contactus', contactusSchema);

module.exports = { ContactUsModel };
