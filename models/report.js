const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reference_id: {
    type: String,
  },
  type: {
    type: String,
  },
  username: {
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
  ban_requested: {
    type: Boolean,
  },
  ban_explanation: {
    type: String,
  },
  archived: {
    type: Boolean,
  },
});

reportSchema.methods.deleteReport = async function () {
  await this.delete();
};

module.exports = {
  ReportModel: mongoose.model('Report', reportSchema),
};
