const { UserModel } = require('../../../models/user');
const { ProductModel } = require('../../../models/product');

const saveProduct = async (req, res) => {
  try {
    const { url } = req.query;

    await ProductModel.findOne({ slug: req.params.slug }).orFail(
      new Error('Invalid Product Slug'),
    );

    const user = await UserModel.findOne({ username: req.user.username });

    user.addRemoveSavedProducts(req.params.slug);

    await user.save();

    res.redirect(url ? `${url}` : '/settings?section=saved&productPage=1');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { saveProduct };
