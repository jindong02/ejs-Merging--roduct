const { ProductModel } = require('../../../models/product');
const { paginatedResults } = require('../../../middlewares/function');

const savedProducts = async (req, res) => {
  try {
    const productPage = parseFloat(req.query.productPage) || 1;

    let paginatedProducts = await paginatedResults(ProductModel, { slug: { $in: req.user.saved_product }, status: 'online' }, { page: productPage, limit: 24 });

    res.render('Pages/settingsPages/savedProducts', { paginatedProducts });
  } catch (e) {
    console.log(e);
    res.redirect('/user/settings/savedProducts');
  }
};

module.exports = { savedProducts };
