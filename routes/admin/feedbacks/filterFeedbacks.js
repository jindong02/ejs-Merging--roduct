const filterFeedbacks = async (req, res) => {
  try {
    const { reason, archived } = req.body;

    if (!['all', 'feedback', 'bug', 'help', 'other'].includes(reason)) throw new Error('Invalid Reason to feedback');
    if (!['all', 'true', 'false'].includes(archived)) throw new Error('Invalid Archived Feedback');

    res.redirect(
      `/admin/feedback?feedbackPage=1${reason !== 'all' ? `&reason=${reason}` : ''
      }${archived !== 'all' ? `&archived=${archived}` : ''}`,
    );
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { filterFeedbacks };
