const express = require('express');

const { ReviewModel } = require('../../models/review');
const { UserModel } = require('../../models/user');
const { OrderModel } = require('../../models/order');
const { isAuth } = require('../../middlewares/authentication');
const {
  sanitizeReviewInput,
  sanitizeParams,
} = require('../../middlewares/validation');
const { formatUsernameWithSettings } = require('../../middlewares/function');

const router = express.Router();

function updateRating(review, note) {
  review.number_review += 1;
  review.total_note += note;
  review.average_note = review.total_note / review.number_review;
  return review;
}

router.post(
  '/create-review/:id',
  [isAuth, sanitizeParams, sanitizeReviewInput],
  async (req, res) => {
    try {
      const { username } = req.user;
      const { note, type } = req.body;

      const order = await OrderModel.findById(req.params.id).populate('product');
      order.isBuyer(username);

      const { product } = order;

      const review = new ReviewModel({
        product_slug: product.slug,
        vendor: order.vendor,
        sender: formatUsernameWithSettings(username, type),
        content: req.body.review,
        note: parseFloat(note),
      });

      order.settings.leftReview = true;

      product.review = updateRating(product.review, review.note);

      const user = await UserModel.findOne({ username: order.vendor });

      user.review = updateRating(user.review, review.note);

      user.save();
      product.save();
      review.save();
      await order.save();

      res.redirect(`/order-resume/${req.params.id}`);
    } catch (e) {
      console.log(e);
      res.redirect('/404');
    }
  },
);

module.exports = router;
