const notificationsTypes = {
  orderStatusChange: (data) => ({
    action: `The Status of one of your order been updated to ${data[0]} <span class="fs-xs opacity-70 ms-2">(previous status ${data[1]})</span>`,
    details: `<hr class="mb-2 mt-4"> Product title: ${data[2]} </br> Quantity: ${data[3]} </br> <a href="/order-resume/${data[4]}">See more Order</a>`,
  }),
  newConversation: (data) => ({
    action: `${data[0]} has started a new conversation with you`,
    details: `<a href="/user/messages?id=${data[1]}#bottom">See new Conversation</a>`,
  }),
  newMessage: (data) => ({
    action: `${data[0]} has sent you a new message`,
    details: `<hr class="mb-2 mt-4"> <a href="/user/messages?id=${data[1]}#bottom">See new Message</a>`,
    unSafeDetails: `Message: ${data[2]}`,
  }),
  changeConversationSettings: (data) => ({
    action: 'A user has change the settings of one of your Conversation',
    details: `Go check it out, it might conmpromise your privacy </br> <a href="/user/messages?id=${data[0]}#bottom">See the Conevrsation</a>`,
  }),
  deleteMessage: (data) => ({
    action: `${data[0]} has delete a message in a conversation with you`,
    details: `<a href="/user/messages?id=${data[1]}#bottom">See the Conversation</a>`,
  }),
  deleteConversation: (data) => ({
    action: `${data[0]} has delete his conversation with you`,
    unSafeDetails: `Reason Given: ${data[1]}}`,
  }),
  newUpdate: () => ({
    action: 'The Site has recieve a new Update !',
    details: '<a href="/news">Go Check it out !</a>',
  }),
};

module.exports = { notificationsTypes };
