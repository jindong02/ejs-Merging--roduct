const { UserModel } = require('../../models/user');
const { ProductModel } = require('../../models/product');
const { ReviewModel } = require('../../models/review');

const { sanitizeHTML, paginatedResults, formatSalesTimer } = require('../../middlewares/function');

const productPage = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug });

    if (product.status === 'offline' && product.vendor !== req.user.username) throw new Error('Product Offline');

    const vendor = await UserModel.findOne({ username: product.vendor });

    const paginatedReviews = await paginatedResults(
      ReviewModel,
      { product_slug: product.slug },
      { page: req.query.reviewPage },
    );

    product.description = sanitizeHTML(product.description);
    product.timerEndSales = formatSalesTimer(product.sales_end);

    res.render('Pages/productPages/product', { product, vendor, paginatedReviews });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { product: productPage };
