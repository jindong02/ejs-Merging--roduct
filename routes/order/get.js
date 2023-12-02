const { ProductModel } = require('../../models/product');
const { UserModel } = require('../../models/user');

const getOrder = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug });

    if (product.status === 'offline' && product.vendor !== req.user.username) {
      throw new Error('Product Offline');
    }

    const vendor = await UserModel.findOne({ username: product.vendor });

    res.render('Pages/orderPages/order', { product, vendor });
  } catch (e) {
    res.redirect('/404');
  }
};

module.exports = { getOrder };
