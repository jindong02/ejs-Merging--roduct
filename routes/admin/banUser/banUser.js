const { ReportModel } = require('../../../models/report');
const { UserModel } = require('../../../models/user');
const { ProductModel } = require('../../../models/product');

async function getResolveReportDocuments(type, id) {
  let user;
  let product;
  switch (type) {
    case 'vendor':
      user = await UserModel.findOne({ username: id });
      break;
    case 'product':
      product = await ProductModel.findOne({ slug: id });
      user = await UserModel.findOne({ username: product.vendor });
      break;
    default:
      throw new Error('Invalid Type');
  }
  return { user, product };
}

const banUser = async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id).orFail(new Error());

    const { user } = await getResolveReportDocuments(
      report.type,
      report.reference_id,
    );

    user.deleteUser();
    report.deleteReport();

    req.flash('success', 'User Successfully Banned');
    res.redirect(
      `/admin/ban-user?reportsPage=${req.query.reportsPage ? req.query.reportsPage : '1'
      }${req.query.reason ? `&reason=${req.query.reason}` : ''}`,
    );
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { banUser };
