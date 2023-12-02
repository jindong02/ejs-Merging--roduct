const { ContactUsModel } = require('../../../models/contactus');

const { paginatedResults, constructAdminQuery } = require('../../../middlewares/function');

const getFeedbacks = async (req, res) => {
  try {
    if (![undefined, 'feedback', 'bug', 'help', 'other'].includes(req.query.reason)) {
      throw new Error('Invalid Reason to feedback');
    }
    if (![undefined, 'true', 'false'].includes(req.query.archived)) throw new Error('Invalid Archived Feedback');

    const feedbacks = await paginatedResults(
      ContactUsModel,
      constructAdminQuery(req.query),
      { page: req.query.feedbackPage, limit: 24 },
    );

    res.render('Pages/adminPages/feedbacks', { feedbacks });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { getFeedbacks };
