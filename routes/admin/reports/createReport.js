const { UserModel } = require('../../../models/user');
const { ProductModel } = require('../../../models/product');
const { ReportModel } = require('../../../models/report');

const createReport = async (req, res) => {
  try {
    if (!['vendor', 'product'].includes(req.query.type)) throw new Error('Invalid type to report');

    req.query.type === 'vendor'
      ? await UserModel.findOne({ username: req.params.id }).orFail(new Error())
      : await ProductModel.findOne({ slug: req.params.id }).orFail(new Error()); // Check if the Object that is being reported Exists

    const { type, url } = req.query;
    const { id } = req.params;
    const { reason, username, message } = req.body;

    const newReport = new ReportModel({
      reference_id: id,
      type,
      username,
      message,
      reason,
    });

    newReport.save();

    req.flash(
      'success',
      'Thank you for your Report, we are now Investigating',
    );
    res.redirect(url);
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { createReport };
