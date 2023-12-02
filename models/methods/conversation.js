const bcrypt = require('bcrypt');
const { format } = require('date-fns');
const { generateAccountUsername } = require('../../middlewares/function');

function findUserIndex(users, senderId) {
  const userIndex = users.map((singleUser) => singleUser.userId).indexOf(senderId);

  if (userIndex === -1) throw Error('Invalid Sender');

  return userIndex;
}

function canCrudMessage(users, userId) {
  if (users !== userId) throw Error('Forbidden');
}

function expireAtMessage(dayUntilExpiring) {
  return Date.now() + 86400000 * dayUntilExpiring;
}

function findLastTimestamp(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.type === 'timestamp') return messages[i];
  }
  return undefined;
}

async function seeingMessage({ userId }) {
  if (!this.settings.messageView) return;

  const indexLastMessage = this.messages.length - 1;

  if (this.users[this.messages[indexLastMessage]?.sender]?.userId === userId) return;
  if (this.messages[indexLastMessage]?.viewedMessage !== false) return;

  this.messages[indexLastMessage].viewedMessage = true;

  this.markModified('messages');
  await this.save();
}

function displayUsername({
  userUsername, userSettings, customUsername, isHiddenConverstion, isOriginalSender,
}) {
  if (!isOriginalSender) return userUsername;
  if (isHiddenConverstion) return customUsername || generateAccountUsername();
  if (userSettings === 'generateRandom') return generateAccountUsername();
  if (userSettings === 'customUsername') return customUsername || generateAccountUsername();
  return userUsername;
}

function addUser({
  user, customUsername, conversationPgp, isHiddenConverstion = false, isOriginalSender = false,
}) {
  const newUser = {
    user: isHiddenConverstion ? undefined : user.id,
    userId: isHiddenConverstion || user.id,
    displayUsername: displayUsername({
      userUsername: user.username, userSettings: user.settings.messageSettings.displayUsername, customUsername, isHiddenConverstion, isOriginalSender,
    }),
    conversationPgp,
  };

  this.users.push(newUser);
}

function updateUserSettings({ userId, messageExpiryDate, conversationPgp }) {
  const indexUser = findUserIndex(this.users, userId);

  this.users[indexUser].messageExpiryDate = messageExpiryDate || undefined;
  this.users[indexUser].conversationPgp = conversationPgp || undefined;
}

function updateConversationSettings({
  includeTimestamps, messageView, deleteEmpty, convoExpiryDate,
}) {
  if (!this.settings) this.settings = {};

  this.settings.includeTimestamps = includeTimestamps;
  this.settings.messageView = messageView;
  this.settings.deleteEmpty = deleteEmpty;
  this.settings.daysUntilExpiring = this.settings.conversationPassword && (!convoExpiryDate || convoExpiryDate < 3) ? 3 : convoExpiryDate;

  this.updateConvoExpiryDate();
}

async function addConversationPassword({ plainTextPassword }) {
  this.settings.conversationPassword = await bcrypt.hash(plainTextPassword, 12);
}

function addTimeStamp() {
  if (this.settings.includeTimestamps) {
    const lastTimeStamp = findLastTimestamp(this.messages);

    if (!lastTimeStamp || Date.now() - lastTimeStamp.millisecondsTimestamp > 600000) { // 10 min
      this.messages.push({
        type: 'timestamp',
        timestamp: format(new Date(), 'HH:mm dd LLLL yyyy'),
        millisecondsTimestamp: Date.now(),
      });
    }
  }
}

function removeUpdateReply({ msgPosition, positionToShift }) {
  for (let i = 0; i < this.messages.length; i++) {
    if (this.messages[i].reply == msgPosition) delete this.messages[i].reply;
    if (this.messages[i].reply >= msgPosition) this.messages[i].reply += -positionToShift;
  }
}

function updateConvoExpiryDate() {
  if (this.settings.daysUntilExpiring) {
    this.settings.convoExpiryDate = expireAtMessage(this.settings.daysUntilExpiring);
  }
}

function addMessageExpiryDate(msgPosition, messageExpiryDate) {
  if (messageExpiryDate && messageExpiryDate !== 'never') this.messages[msgPosition].expireAt = expireAtMessage(messageExpiryDate);
}

function addReply(msgPosition, repliedMsgPosition) {
  if (repliedMsgPosition !== false) this.messages[msgPosition].reply = repliedMsgPosition;
}

function addMessageView(msgPosition) {
  if (this.settings.messageView === true) this.messages[msgPosition].viewedMessage = false;
}

function createNewMessage({
  content, sender, expiringInDays, reply = false,
}) {
  if (this.messages.length >= 1000) throw Error('Message Limit Reached');

  const senderIndex = findUserIndex(this.users, sender);

  this.addTimeStamp();

  this.messages.push({
    content,
    type: 'msg',
    sender: senderIndex,
  });

  const msgPosition = this.messages.length - 1;

  this.addMessageExpiryDate(msgPosition, this.users[senderIndex].messageExpiryDate || expiringInDays);
  this.addReply(msgPosition, reply);
  this.addMessageView(msgPosition);
  this.updateConvoExpiryDate();
}

function editMessage(content, messagePosition, userId) {
  canCrudMessage(this.users[this.messages[messagePosition].sender]?.userId, userId);

  this.messages[messagePosition].content = content;
  this.markModified('messages');

  this.updateConvoExpiryDate();
}

function emptyMessage() {
  if (this.settings.deleteEmpty) {
    if (!this.messages.length || !this.messages.map((message) => message.type).includes('msg')) {
      this.deleteConversation();
      return;
    }
  }

  this.save();
}

function deleteMessage(msgPosition, userId, checkIfEmpty = true, canCRUD = true) {
  if (canCRUD) canCrudMessage(this.users[this.messages[msgPosition].sender]?.userId, userId);

  const deleteModifier = this.messages[msgPosition - 1]?.type === 'timestamp' ? 1 : 0;

  this.removeUpdateReply({ msgPosition, positionToShift: deleteModifier + 1 });

  this.messages.splice(msgPosition - deleteModifier, 1 + deleteModifier);

  if (checkIfEmpty) this.emptyMessage();
}

function deleteExpiredMessage({ date }) {
  for (let i = 0; i < this.messages.length; i++) {
    if (this.messages[i].expireAt <= date) this.deleteMessage(i, undefined, false, false);
  }
}

async function deleteConversation() {
  await this.delete();
}

const setConversationMethodsToSchema = (conversationSchema) => {
  conversationSchema.methods = {
    seeingMessage,
    addUser,
    updateUserSettings,
    updateConversationSettings,
    addConversationPassword,
    addTimeStamp,
    removeUpdateReply,
    updateConvoExpiryDate,
    addMessageExpiryDate,
    addReply,
    addMessageView,
    createNewMessage,
    editMessage,
    emptyMessage,
    deleteMessage,
    deleteExpiredMessage,
    deleteConversation,
  };
};

module.exports = { setConversationMethodsToSchema };
