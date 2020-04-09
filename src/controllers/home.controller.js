import { notifycation, contact, message } from "./../services/index.service";
import { bufferBase64 } from "./../helpers/client.heplers";
module.exports.getHomeChat = async (req, res, next) => {
    let notifications = await notifycation.getNotifycations(req.user._id);
    //get amount notifications unread
    let countNotifiUnread = await notifycation.countNotifiUnread(req.user._id);
    //get contact  (10 item one time)
    let contacts = await contact.getContacts(req.user._id);
    //get contact sent(10 item one time)
    let contactsSent = await contact.getContactsSent(req.user._id);

    //get contact received (10 item one time)
    let contactsReceived = await contact.getContactsReceived(req.user._id);
    //countAllcontacts
    let countAllcontacts = await contact.countAllcontacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);
    let getAllConvensationItems = await message.getAllConvensationItems(req.user._id);
    let allConversations = getAllConvensationItems.allConversations;
    let userConversations = getAllConvensationItems.userConversations;
    let groupConversations = getAllConvensationItems.groupConversations;
    let allConversationswithMessages = getAllConvensationItems.allConversationswithMessages;

    return res.render("main/home/home", {
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user,
        notifications: notifications,
        countNotifiUnread: countNotifiUnread,
        contacts: contacts,
        contactsSent: contactsSent,
        contactsReceived: contactsReceived,
        countAllcontacts: countAllcontacts,
        countAllContactsSent: countAllContactsSent,
        countAllContactsReceived: countAllContactsReceived,
        allConversations: allConversations,
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversationswithMessages: allConversationswithMessages,
        bufferBase64: bufferBase64,
    });
};
