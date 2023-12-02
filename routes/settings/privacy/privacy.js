const privacy = async (req, res) => {
  try {
    const notificationChoices = [
      {
        name: 'orderStatusChange',
        text: 'When the status of one of your order change',
      },
      {
        name: 'newConversation',
        text: 'When a new Conversation is created with you',
      },
      {
        name: 'newMessage',
        text: 'When a user send you a new Message',
      },
      {
        name: 'changeConversationSettings',
        text: 'When a user Change the settings of a conversation that you are in',
      },
      {
        name: 'deleteMessage',
        text: 'When a user Delete one of his message in a conversation with you',
      },
      {
        name: 'deleteConversation',
        text: 'When a user Delete a conversation with you',
      },
      {
        name: 'newUpdate',
        text: 'When the site recieve a new update',
      },
    ];
    res.render('Pages/settingsPages/privacy', { notificationChoices });
  } catch (e) {
    console.log(e);
    res.redirect('/user/settings/privacy');
  }
};

module.exports = { privacy };
