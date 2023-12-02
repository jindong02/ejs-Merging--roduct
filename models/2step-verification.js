const mongoose = require('mongoose');

const StepVerificationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  encrypted_code: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
});

StepVerificationSchema.methods.deleteStepVerification = async function () {
  await this.delete();
};

const StepVerificationModel = mongoose.model('StepVerification', StepVerificationSchema);

module.exports = { StepVerificationModel };
