const mongoose = require('mongoose');
// const { UserModel } = require('./user');

const reviewSchema = new mongoose.Schema({
  product_slug: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  note: {
    type: Number,
    required: true,
  },
});

reviewSchema.methods.Get_Reviewer_Profile_Pic = async function () {
  let user;

  const UserModel = mongoose.model('User');

  switch (this.type) {
    case 'default':
      user = await UserModel.findOne({ username: this.sender });
      this.img_path = user.img_path;
      break;
    default:
      this.img_path = '/default/default-profile-pic.png';
  }
  return this;
};

reviewSchema.methods.changeReviewProductSlug = async function (newSlug) {
  this.product_slug = newSlug;
  await this.save();
};

reviewSchema.methods.deleteReview = async function () {
  await this.delete();
};

module.exports = {
  ReviewModel: mongoose.model('Review', reviewSchema),
};
