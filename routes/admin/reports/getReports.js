const { ReportModel } = require('../../../models/report');
const { paginatedResults, constructAdminQuery } = require('../../../middlewares/function');

const getReports = async (req, res) => {
  try {
    if (![undefined, 'scam', 'blackmail', 'information', 'other'].includes(req.query.reason)) throw new Error('Invalid type to report');
    if (![undefined, 'true', 'false'].includes(req.query.archived)) throw new Error('Invalid type to report');

    const query = constructAdminQuery(req.query);
    query.ban_explanation = { $exists: false };

    const reports = await paginatedResults(ReportModel, query, { page: req.query.reportsPage, limit: 24 });

    res.render('Pages/adminPages/reports', { reports });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { getReports };
