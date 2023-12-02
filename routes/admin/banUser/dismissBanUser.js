const { ReportModel } = require('../../../models/report');

const dismissBanUser = async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id).orFail(new Error());

    report.deleteReport();

    req.flash('success', 'Ban Request Successfully Dismissed');
    res.redirect(
      `/admin/ban-user?reportsPage=${req.query.reportsPage ? req.query.reportsPage : '1'
      }${req.query.reason ? `&reason=${req.query.reason}` : ''}}`,
    );
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { dismissBanUser };
