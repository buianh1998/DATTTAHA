import contactModel from "./../models/contact.model";
import userModel from "../models/user.model";
import chatGroupModel from "../models/chatGroup.model";
import messageGroupModel from "../models/message.model";
import { transErr } from "./../../lang/vi";
import _ from "lodash";
import { app } from "./../Config/app";
import fsExtra from "fs-extra";
/**
 * get All conversations
 * @param {*} currentUserId
 */
const LIMIT_CONVERSATIONS_TAKEN = 3;
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
                conversation = conversation.toObject();
                if (conversation.menbers) {
                    let getMessage = await messageGroupModel.model.getMessageInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = _.reverse(getMessage);
                } else {
                    let getMessage = await messageGroupModel.model.getMessageInPersonal(
                        currentUserId,
                        conversation._id,
                        LIMIT_MESSAGES_TAKEN
                    );
                    conversation.messages = _.reverse(getMessage);
                }
                return conversation;
            });
            let allConversationswithMessages = await Promise.all(allConversationswithMessagesPromise);
            //sort by updateAt desseding
            allConversationswithMessages = _.sortBy(allConversationswithMessages, (item) => {
                return -item.updatedAt;
            });

            resolve({
                allConversationswithMessages: allConversationswithMessages,
            });
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * add new message text and emoji
 * @param {object} sender current Id
 * @param {string} recieverId id of an user or group
 * @param {string} messageVal
 * @param {boolean} isChatGroup
 */
let addNewTextImoji = (sender, recieverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupRecieved = await chatGroupModel.getChatGroupById(recieverId);
                if (!getChatGroupRecieved) {
                    return reject(transErr.conversation_not_found);
                }
                let reciever = {
                    id: getChatGroupRecieved._id,
                    name: getChatGroupRecieved.name,
                    avatar: app.general_avatar_group_chat,
                };
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: reciever.id,
                    conversationType: messageGroupModel.conversationTypes.GROUP,
                    messageType: messageGroupModel.messageTypes.TEXT,
                    sender: sender,
                    receiver: reciever,
                    text: messageVal,
                    createdAt: Date.now(),
                };
                //create new message
                let newMessage = await messageGroupModel.model.createNew(newMessageItem);
                //update groub chat
                await chatGroupModel.updateWhenHasNewMessage(getChatGroupRecieved._id, getChatGroupRecieved.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserRecieved = await userModel.getNormalUserDataById(recieverId);
                if (!getUserRecieved) {
                    return reject(transErr.conversation_not_found);
                }
                let reciever = {
                    id: getUserRecieved._id,
                    name: getUserRecieved.username,
                    avatar: getUserRecieved.avatar,
                };
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: reciever.id,
                    conversationType: messageGroupModel.conversationTypes.PESONAL,
                    messageType: messageGroupModel.messageTypes.TEXT,
                    sender: sender,
                    receiver: reciever,
                    text: messageVal,
                    createdAt: Date.now(),
                };
                //create new message
                let newMessage = await messageGroupModel.model.createNew(newMessageItem);
                //update contact
                await contactModel.updateWhenHasNewMessage(sender.id, getUserRecieved._id);
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};
/**
 *
 * @param {Object} sender
 * @param {string} recieverId
 * @param {file} messageVal
 * @param {boolean} isChatGroup
 */
let addNewImage = (sender, recieverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupRecieved = await chatGroupModel.getChatGroupById(recieverId);
                if (!getChatGroupRecieved) {
                    return reject(transErr.conversation_not_found);
                }
                let reciever = {
                    id: getChatGroupRecieved._id,
                    name: getChatGroupRecieved.name,
                    avatar: app.general_avatar_group_chat,
                };
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: reciever.id,
                    conversationType: messageGroupModel.conversationTypes.GROUP,
                    messageType: messageGroupModel.messageTypes.IMAGE,
                    sender: sender,
                    receiver: reciever,
                    file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
                    createdAt: Date.now(),
                };
                //create new message
                let newMessage = await messageGroupModel.model.createNew(newMessageItem);
                //update groub chat
                await chatGroupModel.updateWhenHasNewMessage(getChatGroupRecieved._id, getChatGroupRecieved.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserRecieved = await userModel.getNormalUserDataById(recieverId);
                if (!getUserRecieved) {
                    return reject(transErr.conversation_not_found);
                }
                let reciever = {
                    id: getUserRecieved._id,
                    name: getUserRecieved.username,
                    avatar: getUserRecieved.avatar,
                };
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: reciever.id,
                    conversationType: messageGroupModel.conversationTypes.PESONAL,
                    messageType: messageGroupModel.messageTypes.IMAGE,
                    sender: sender,
                    receiver: reciever,
                    file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
                    createdAt: Date.now(),
                };
                //create new message
                let newMessage = await messageGroupModel.model.createNew(newMessageItem);
                //update contact
                await contactModel.updateWhenHasNewMessage(sender.id, getUserRecieved._id);
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};
let addNewAttachment = (sender, recieverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupRecieved = await chatGroupModel.getChatGroupById(recieverId);
                if (!getChatGroupRecieved) {
                    return reject(transErr.conversation_not_found);
                }
                let reciever = {
                    id: getChatGroupRecieved._id,
                    name: getChatGroupRecieved.name,
                    avatar: app.general_avatar_group_chat,
                };
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: reciever.id,
                    conversationType: messageGroupModel.conversationTypes.GROUP,
                    messageType: messageGroupModel.messageTypes.FILE,
                    sender: sender,
                    receiver: reciever,
                    file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
                    createdAt: Date.now(),
                };
                //create new message
                let newMessage = await messageGroupModel.model.createNew(newMessageItem);
                //update groub chat
                await chatGroupModel.updateWhenHasNewMessage(getChatGroupRecieved._id, getChatGroupRecieved.messageAmount + 1);
                resolve(newMessage);
            } else {
                let getUserRecieved = await userModel.getNormalUserDataById(recieverId);
                if (!getUserRecieved) {
                    return reject(transErr.conversation_not_found);
                }
                let reciever = {
                    id: getUserRecieved._id,
                    name: getUserRecieved.username,
                    avatar: getUserRecieved.avatar,
                };
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: reciever.id,
                    conversationType: messageGroupModel.conversationTypes.PESONAL,
                    messageType: messageGroupModel.messageTypes.FILE,
                    sender: sender,
                    receiver: reciever,
                    file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
                    createdAt: Date.now(),
                };
                //create new message
                let newMessage = await messageGroupModel.model.createNew(newMessageItem);
                //update contact
                await contactModel.updateWhenHasNewMessage(sender.id, getUserRecieved._id);
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * Read more presonal & groupchat
 * @param {String} currentUserId
 * @param {Number} skipPersonal
 * @param {Number} skipGroup
 */
let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await contactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATIONS_TAKEN);
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

            let groupConversations = await chatGroupModel.readMoreChatGroups(currentUserId, skipGroup, LIMIT_CONVERSATIONS_TAKEN);
            //concat gộp 2 mảng thành 1 mảng
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            });
            // get messages to apply in csreen chat
            let allConversationswithMessagesPromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                if (conversation.menbers) {
                    let getMessage = await messageGroupModel.model.getMessageInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = _.reverse(getMessage);
                } else {
                    let getMessage = await messageGroupModel.model.getMessageInPersonal(
                        currentUserId,
                        conversation._id,
                        LIMIT_MESSAGES_TAKEN
                    );
                    conversation.messages = _.reverse(getMessage);
                }
                return conversation;
            });
            let allConversationswithMessages = await Promise.all(allConversationswithMessagesPromise);
            //sort by updateAt desseding
            allConversationswithMessages = _.sortBy(allConversationswithMessages, (item) => {
                return -item.updatedAt;
            });

            resolve(allConversationswithMessages);
        } catch (error) {
            reject(error);
        }
    });
};
let readMore = (currentUserId, skipMessage, targetid, chatInGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            // message in group
            if (chatInGroup) {
                let getMessage = await messageGroupModel.model.readMoreMessageInGroup(targetid, skipMessage, LIMIT_MESSAGES_TAKEN);
                getMessage = _.reverse(getMessage);
                return resolve(getMessage);
            }
            // message in persional
            let getMessage = await messageGroupModel.model.readMoreMessageInPersonal(
                currentUserId,
                targetid,
                skipMessage,
                LIMIT_MESSAGES_TAKEN
            );
            getMessage = _.reverse(getMessage);
            return resolve(getMessage);
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    getAllConvensationItems: getAllConvensationItems,
    addNewTextImoji: addNewTextImoji,
    addNewImage: addNewImage,
    addNewAttachment: addNewAttachment,
    readMoreAllChat: readMoreAllChat,
    readMore: readMore,
};
