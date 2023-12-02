const awaitPromotion = async (req, res) => {
  try {
    const { user } = req;

    if (user.authorization !== 'buyer') throw new Error('You are already a Vendor');

    user.awaiting_promotion = true;

    user.save();

    req.flash('success', 'You submission to become a Vendor as been send');
    res.redirect(`/user/profile/${user.username}?productPage=1&reviewPage=1`);
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
  }
};

module.exports = { awaitPromotion };
