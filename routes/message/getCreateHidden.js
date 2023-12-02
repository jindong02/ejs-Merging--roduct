const { generateRandomString } = require('../../middlewares/function');

const getCreateHidden = async (req, res) => {
  try {
    res.render('Pages/messagePages/createHiddenConversation', { randomId: generateRandomString(30, 'CharInt') });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};
module.exports = { getCreateHidden };
