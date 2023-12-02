const { ReportModel } = require('../../../models/report');
const { paginatedResults, constructAdminQuery } = require('../../../middlewares/function');

const getBanUsers = async (req, res) => {
  try {
    if (![undefined, 'scam', 'blackmail', 'information', 'other'].includes(req.query.reason)) {
      throw new Error('Invalid type to report');
    }

    const query = constructAdminQuery(req.query);
    query.ban_explanation = { $exists: true };

    const reports = await paginatedResults(ReportModel, query, { page: req.query.reportsPage, limit: 24 });

    res.render('Pages/adminPages/ban', { reports });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { getBanUsers };
