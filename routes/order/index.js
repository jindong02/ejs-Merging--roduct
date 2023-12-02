const express = require('express');
const { isAuth } = require('../../middlewares/authentication');
const {
  sanitizeParams,
  sanitizeOrderCustomization,
  sanitizeQuerys,
  sanitizeParamsQuerys,
} = require('../../middlewares/validation');

const { filterOrders } = require('./filter');
const { getOrders } = require('./list');
const { getOrder } = require('./get');
const { ProductModel } = require('../../models/product');
const { createOrder } = require('./create');
const { updateOrder } = require('./update');
const { orderResume } = require('./resume');
const { payPage } = require('./pay');
const { updatePrivacy } = require('./updatePrivacy');
const { sendChatToOrder } = require('./chat');
const { getOrderInfo } = require('./getInfo');
const { submitOrderInfo } = require('./submitInfo');

const router = express.Router();

const productMiddleware = async (req, res, next) => {
  try {
    req.product = await ProductModel.findOne({
      slug: req.params.slug,
      status: 'online',
    }).orFail(new Error('Invalid Slug Params'));

    next();
  } catch (e) {
    res.redirect('/404');
  }
};

router.get('/orders', [isAuth, sanitizeQuerys], getOrders);
router.get('/order/:slug', [isAuth, sanitizeParams], getOrder);
router.get('/order-resume/:id', [isAuth, sanitizeParams], orderResume);
router.get('/pay/:id', [isAuth, sanitizeParams], payPage);

router.post('/filter-orders', [isAuth, sanitizeQuerys], filterOrders);
router.post(
  '/create-order/:slug',
  [isAuth, sanitizeParams, productMiddleware, sanitizeOrderCustomization],
  createOrder,
);
router.post('/update-order/:id', [isAuth, sanitizeParamsQuerys], updateOrder);
router.post(
  '/update-privacy-order/:id',
  [isAuth, sanitizeParams],
  updatePrivacy,
);
router.post('/send-order-chat/:id', [isAuth, sanitizeParams], sendChatToOrder);
router.get('/submit-info/:id', [isAuth, sanitizeParams], getOrderInfo);
router.post('/submit-info/:id', submitOrderInfo);

module.exports = router;
