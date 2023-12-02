const {
  BUYER_PRIVATE_INFO_DELETION,
} = require('../../constants/buyerPrivateInfoDeletion');
const { ORDER_PRIVACY_TYPE } = require('../../constants/orderPrivacyType');
const { ORDER_STATUS } = require('../../constants/orderStatus');
const { OrderModel } = require('../../models/order');

const updatePrivacy = async (req, res) => {
  try {
    const { user } = req;
    const { buyerPrivateInfoDeletion, privacyType } = req.body;

    if (
      !Object.values(BUYER_PRIVATE_INFO_DELETION).includes(
        buyerPrivateInfoDeletion,
      )
    ) throw new Error('Invalid Value');

    if (!Object.values(ORDER_PRIVACY_TYPE).includes(privacyType)) throw new Error('Invalid Value');

    const order = await OrderModel.findById(req.params.id);
    order.isBuyer(user.username);

    if (order.orderStatus === ORDER_STATUS.FINALIZED) throw Error('Cant Change Settings Right Now');

    order.settings.privacyType = privacyType;
    order.settings.buyerPrivateInfoDeletion = buyerPrivateInfoDeletion;

    await order.save();

    res.redirect(`/order-resume/${order.id}`);
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { updatePrivacy };
