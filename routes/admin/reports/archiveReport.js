const { ReportModel } = require('../../../models/report');

const archiveReport = async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id).orFail(new Error());

    report.archived = report.archived ? undefined : true;

    await report.save();

    req.flash('success', 'Report Successfully Archived/Unarchived');
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

module.exports = { archiveReport };
