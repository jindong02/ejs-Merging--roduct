const { ProductModel } = require('../../models/product');

const getCreate = async (req, res) => {
  try {
    const product = await ProductModel.findOneOrCreateNew(req.query.slug, req.user.username);

    const reviews = [
      {
        sender: 'Dummy Username',
        content: 'Wow This Product was Amazing !',
        type: 'default',
        note: 5,
        __v: 0,
      },
      {
        sender: 'Dummy Username',
        content: 'The shipping was a bit slow, but the product itself is really cool.',
        type: 'default',
        note: 4,
        __v: 0,
      },
      {
        sender: 'Dummy Username',
        content: 'Will definetly buy again',
        type: 'default',
        note: 5,
        __v: 0,
      },
      {
        sender: 'Dummy Username',
        content: 'The Product arrived broken :(, luckely, the vendor was kind enough to send me another one',
        type: 'default',
        note: 4,
        __v: 0,
      },
      {
        sender: 'Dummy Username',
        content: 'Great I like it !',
        type: 'default',
        note: 5,
        __v: 0,
      },
    ];

    res.render('Pages/productPages/createProduct', { product, reviews });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { getCreate };
