const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const { sanitizeParamsQuerys, sanitizeQuerys } = require('../../../middlewares/validation');

const router = express.Router();

const { saveProduct } = require('./saveProduct');

const { savedProducts } = require('./savedProducts');

router.post('/saved_product/:slug', [isAuth, sanitizeParamsQuerys], saveProduct);

router.get('/user/settings/savedProducts', [isAuth, sanitizeQuerys], savedProducts);

module.exports = router;
