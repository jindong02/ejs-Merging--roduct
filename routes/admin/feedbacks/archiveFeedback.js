const { ContactUsModel } = require('../../../models/contactus');

const archiveFeedback = async (req, res) => {
  try {
    const feedback = await ContactUsModel.findById(req.params.id).orFail(
      new Error(),
    );

    feedback.archived = feedback.archived ? undefined : true;

    await feedback.save();

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

module.exports = { archiveFeedback };
