const { ContactUsModel } = require('../../../models/contactus');

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await ContactUsModel.findById(req.params.id).orFail(
      new Error(),
    );

    await feedback.deleteContactUs();

    res.redirect(
      `/admin/feedback?feedbackPage=${req.query.feedbackPage ? req.query.feedbackPage : '1'
      }${req.query.reason ? `&reason=${req.query.reason}` : ''}${req.query.archived ? `&archived=${req.query.archived}` : ''
      }`,
    );
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { deleteFeedback };
