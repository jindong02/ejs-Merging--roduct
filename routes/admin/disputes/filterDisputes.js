const filterDisputes = async (req, res) => {
  try {
    if (
      !['all', 'Product Broken', 'Product Late', 'Other'].includes(
        req.body.reason,
      )
    ) throw Error('Invalid Reason');

    res.redirect(
      `/admin/disputes?disputesPage=1${req.body.reason !== 'all' ? `&reason=${req.body.reason}` : ''
      }${req.query.adminDispute === 'true' ? '&adminDispute=true' : ''}`,
    );
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { filterDisputes };
