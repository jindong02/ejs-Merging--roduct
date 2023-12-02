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

const resolveReport = async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id).orFail(new Error());

    const { banReason } = req.body; // Why Message ?

    const { user, product } = await getResolveReportDocuments(
      report.type,
      report.reference_id,
    );

    if (product) {
      product.status === 'offline';
      product.save();
    }

    user.warning += 1;

    if (user.warning >= 5) {
      user.deleteUser();
    } else user.save();

    let flashMessage = 'The Vendor as been given a warning';

    if (banReason) {
      report.ban_explanation = banReason;
      flashMessage = 'A request to ban this vendor as been made';
      await report.save();
    } else await report.deleteReport();

    // Send Message to Vendor

    req.flash('success', flashMessage);
    res.redirect(
      `/admin/reports?reportsPage=${req.query.reportsPage ? req.query.reportsPage : '1'
      }${req.query.reason ? `&reason=${req.query.reason}` : ''}${req.query.archived ? `&archived=${req.query.archived}` : ''
      }`,
    );
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { resolveReport };
