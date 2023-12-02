const express = require('express');

const fileUpload = require('express-fileupload');
const { ProductModel } = require('../../models/product');
const { ImageUploadsValidation } = require('../../middlewares/filesUploads');
const { isAuth, isVendor } = require('../../middlewares/authentication');
const {
  sanitizeProductInput, sanitizeParams, sanitizeQuerys, sanitizeParamsQuerys,
} = require('../../middlewares/validation');

const getProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findOneOrCreateNew(req.query.slug, req.user.username);

    req.product = product || new ProductModel();

    next();
  } catch (e) {
    res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
  }
};

const router = express.Router();

const { deleteProduct } = require('./deleteProduct');

const { create } = require('./create');
const { search } = require('./search');

const { getCreate } = require('./getCreate');
const { product } = require('./product');
const { products } = require('./products');

router.delete('/delete-product/:slug', [isAuth, sanitizeParams], deleteProduct);

router.post('/create-product', [
  isAuth,
  isVendor,
  sanitizeQuerys,
  fileUpload({ createParentPath: true }),
  ImageUploadsValidation({ errorUrl: '/create-product' }),
  getProduct,
  sanitizeProductInput,
], create);
router.post('/search-products', search);

router.get('/create-product', [isAuth, isVendor, sanitizeQuerys], getCreate);
router.get('/product/:slug', [sanitizeParamsQuerys], product);
router.get('/products', [sanitizeQuerys], products);

module.exports = router;
