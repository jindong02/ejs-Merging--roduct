const { ProductModel } = require('../../models/product');

const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug, vendor: req.user.username });

    if (!product) throw new Error('Invalid Slug Params');

    await product.deleteProduct();

    req.flash('success', 'Product Successfully Deleted');
    res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
  } catch (e) {
    console.log(e);
    res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
  }
};

module.exports = { deleteProduct };
