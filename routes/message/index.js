const express = require('express');
const { isAuth } = require('../../middlewares/authentication');
const {
  sanitizeConversationInput,
  changeUserSettingsConversation,
  sanitizeHiddenConversationInput,
  sanitizeMessageInput,
  sanitizeParams,
  sanitizeQuerys,
  sanitizeParamsQuerys,
  changeSettingsConversation,
  sanitizeSearchInput,
} = require('../../middlewares/validation');

function isSendingToHimself(req, res, next) {
  if (req.params.id !== req.user.id) next();
  else {
    req.flash('error', 'You cant send a Message to Yourself');
    res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
  }
}

const router = express.Router();

const { createConversation } = require('./conversation');
const { createHiddenConversation } = require('./conversationHidden');
const { deleteConversation } = require('./delete');
const { createMessage } = require('./message');
const { search } = require('./search');
const { changeSettings } = require('./settings');
const { changeUserSettings } = require('./userSettings');

const { getChangeUserSettings } = require('./getChangeUserSettings');
const { getCreateHidden } = require('./getCreateHidden');
const { getMessage } = require('./getMessage');

router.post('/create-conversation/:id', [
  isAuth,
  sanitizeParams,
  isSendingToHimself,
  sanitizeConversationInput,
], createConversation);
router.post('/create-hidden-conversation/:id', [
  isAuth,
  sanitizeParams,
  isSendingToHimself,
  sanitizeHiddenConversationInput,
], createHiddenConversation);
router.post('/delete-conversation/:id', [isAuth, sanitizeParams], deleteConversation);
router.post('/messages/:id', [isAuth, sanitizeParamsQuerys, sanitizeMessageInput], createMessage);
router.post('/search-conversation', [isAuth, sanitizeSearchInput], search);
router.post('/change-conversation-settings/:id', [isAuth, sanitizeParams, changeSettingsConversation], changeSettings);
router.post('/change-user-conversation-settings/:id', [isAuth, sanitizeParams, changeUserSettingsConversation], changeUserSettings);

router.get('/user/conversation/change-user-conversation-settings/:id', [isAuth, sanitizeParams], getChangeUserSettings);
router.get('/user/create-hidden-conversation', [isAuth, sanitizeQuerys], getCreateHidden);
router.get('/user/messages', [isAuth, sanitizeQuerys], getMessage);

module.exports = router;
