const search = async (req, res) => {
  try {
    if (typeof req.body.search !== 'string') throw new Error('Invalid Search type');

    if (req.body.search.length > 150) req.body.search = req.body.search.slice(0, 100);
    res.redirect(`/products?search=${req.body.search}&productPage=1`);
  } catch (e) {
    res.redirect('/404');
  }
};

module.exports = { search };
