import contactModel from "./../models/contact.model";
import userModel from "../models/user.model";
import chatGroupModel from "../models/chatGroup.model";
import _ from "lodash";
/**
 * get All conversations
 * @param {*} currentUserId
 */
const LIMIT_CONVERSATIONS_TAKEN = 15;
let getAllConvensationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await contactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let userConversationPromise = contacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    let getUserContact = await userModel.getNormalUserDataById(contact.userId);
                    getUserContact.createdAt = contact.createdAt;
                    return getUserContact;
                } else {
                    let getUserContact = await userModel.getNormalUserDataById(contact.contactId);
                    getUserContact.createdAt = contact.createdAt;
                    return getUserContact;
                }
            });
            let userConversations = await Promise.all(userConversationPromise);
            let groupConversations = await chatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            //concat gộp 2 mảng thành 1 mảng
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.createdAt;
            });
            console.log(allConversations);

            resolve({
                userConversations: userConversations,
                groupConversations: groupConversations,
                allConversations: allConversations,
            });
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    getAllConvensationItems: getAllConvensationItems,
};
