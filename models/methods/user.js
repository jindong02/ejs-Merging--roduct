const { ConversationModel } = require('../conversation');
const { StepVerificationModel } = require('../2step-verification');
const { ContactUsModel } = require('../contactus');
const { ReportModel } = require('../report');
const { ProductModel } = require('../product');
const { ReviewModel } = require('../review');
const { deleteImage } = require('../../middlewares/filesUploads');

function deleteNotification({ notificationId }) {
  const notificationIndex = this.notifications.map((elem) => elem.id).indexOf(notificationId);

  if (notificationIndex === -1) {
    console.log('Invalid Notification Id');
    return;
  }

  this.notifications.splice(notificationIndex, 1);
}

function sawNotification() {
  for (let i = 0; i < this.notifications.length; i++) {
    if (!this.notifications[i]) continue;
    if (this.notifications[i].seen === false) this.notifications[i].seen = true;
  }
}

function deleteExpiredNotifications(date) {
  for (let i = this.notifications.length - 1; i > -1; i--) {
    if (this.notifications[i]?.expireAt < date) this.notifications.splice(i, 1);
  }
}

function deleteOnSeeNotification() {
  for (let i = this.notifications.length - 1; i > -1; i--) {
    if (this.notifications[i]?.expireAt === -1) this.notifications.splice(i, 1);
  }
}

function updateInactiveDate() {
  this.expire_at = Date.now() + this.settings.userExpiring * 86400000;
}

function addRemoveSavedProducts(id) {
  if (this.saved_product.includes(id)) this.saved_product = this.saved_product.filter((element) => element !== id);
  // Remove
  else this.saved_product.push(id); // Add
}

async function offlineAllUserProducts() {
  const userProducts = await ProductModel.find({ vendor: this.username });

  for (let i = 0; i < userProducts.length; i++) {
    if (!userProducts[i].customMoneroAddress) {
      userProducts[i].status = 'offline';
      userProducts[i].save();
    }
  }
}

async function deleteUser() {
  deleteImage(`./uploads${this.img_path}`);

  // Delete Conversations
  const conversations = await ConversationModel.find({
    $or: [{ sender_1: this.username }, { sender_2: this.username }],
  });

  for (let i = 0; i < conversations.length; i++) {
    conversations[i].deleteConversation();
  }

  // Product
  const products = await ProductModel.find({ vendor: this.username });
  for (let i = 0; i < products.length; i++) {
    products[i].deleteProduct();
  }

  // Review
  const review = await ReviewModel.find({ sender: this.username });
  for (let i = 0; i < review.length; i++) {
    review[i].deleteReview();
  }

  // Report
  const reports = await ReportModel.find({ $or: [{ reference_id: this.username }, { username: this.username }] });
  for (let i = 0; i < reports.length; i++) {
    reports[i].deleteReport();
  }

  // Contact Us
  const contactus = await ContactUsModel.find({ username: this.username });
  for (let i = 0; i < contactus.length; i++) {
    contactus[i].deleteContactUs();
  }

  // 2 Step Verification
  const stepVerification = await StepVerificationModel.find({ username: this.username });
  for (let i = 0; i < stepVerification.length; i++) {
    stepVerification[i].deleteStepVerification();
  }

  await this.delete();
}

const setUserMethodsToSchema = (userSchema) => {
  userSchema.methods = {
    sawNotification,
    deleteExpiredNotifications,
    deleteOnSeeNotification,
    deleteNotification,
    updateInactiveDate,
    addRemoveSavedProducts,
    offlineAllUserProducts,
    deleteUser,
  };
};

module.exports = { setUserMethodsToSchema };
