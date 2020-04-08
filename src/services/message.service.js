import contactModel from "./../models/contact.model";
import userModel from "../models/user.model";
import chatGroupModel from "../models/chatGroup.model";
import messageGroupModel from "../models/message.model";

import _ from "lodash";
/**
 * get All conversations
 * @param {*} currentUserId
 */
const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;
let getAllConvensationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await contactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let userConversationPromise = contacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    let getUserContact = await userModel.getNormalUserDataById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                } else {
                    let getUserContact = await userModel.getNormalUserDataById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversations = await Promise.all(userConversationPromise);
            let groupConversations = await chatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            //concat gộp 2 mảng thành 1 mảng
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            });
            // get messages to apply in csreen chat
            let allConversationswithMessagesPromise = allConversations.map(async (conversation) => {
                let getMessage = await messageGroupModel.model.getMessage(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                conversation = conversation.toObject();
                conversation.messages = getMessage;
                return conversation;
            });
            let allConversationswithMessages = await Promise.all(allConversationswithMessagesPromise);
            //sort by updateAt desseding
            allConversationswithMessages = _.sortBy(allConversationswithMessages, (item) => {
                return -item.updatedAt;
            });
            console.log(allConversationswithMessages);

            resolve({
                userConversations: userConversations,
                groupConversations: groupConversations,
                allConversations: allConversations,
                allConversationswithMessages: allConversationswithMessages,
            });
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    getAllConvensationItems: getAllConvensationItems,
};
