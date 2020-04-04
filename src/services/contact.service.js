import contactModel from "./../models/contact.model";
import userModel from "../models/user.model";
import notifiCationModel from "../models/notification.model";

import _ from "lodash";

const LIMIT_NUMER_TAKEN = 1;

let findUserContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let deprecatedUserIds = [currentUserId];

        let contactsByUser = await contactModel.findAllByUser(currentUserId);

        contactsByUser.forEach((item) => {
            deprecatedUserIds.push(item.userId);
            deprecatedUserIds.push(item.contactId);
        });

        deprecatedUserIds = _.uniqBy(deprecatedUserIds);
        let users = await userModel.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);
    });
};
let addNew = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await contactModel.checkExits(currentUserId, contactId);
        if (contactExists) {
            return reject(false);
        }
        //create contact
        let newContactItem = {
            userId: currentUserId,
            contactId: contactId,
        };
        //notifi cation
        let newContact = await contactModel.createNew(newContactItem);
        //create notification
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: notifiCationModel.types.ADD_CONTACT,
        };
        await notifiCationModel.model.createNew(notificationItem);
        resolve(newContact);
    });
};
let removeContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeContact = await contactModel.removeContact(currentUserId, contactId);
        if (removeContact.result.n === 0) {
            return reject(false);
        }

        resolve(true);
    });
};

let removeRequestContactSent = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeReq = await contactModel.removeRequestContactSent(currentUserId, contactId);
        if (removeReq.result.n === 0) {
            return reject(false);
        }
        //remove notification
        let notifTypeAddcontact = notifiCationModel.types.ADD_CONTACT;
        await notifiCationModel.model.removeRequestContactSentNotification(currentUserId, contactId, notifTypeAddcontact);
        resolve(true);
    });
};
let removeRequestContactRecieved = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeReq = await contactModel.removeRequestContactRecieved(currentUserId, contactId);
        if (removeReq.result.n === 0) {
            return reject(false);
        }
        //remove notification
        //let notifTypeAddcontact = notifiCationModel.types.ADD_CONTACT;
        //await notifiCationModel.model.removeRequestContactRecievedNotification(currentUserId, contactId, notifTypeAddcontact);
        resolve(true);
    });
};
let approveRequestContactRecieved = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let approveReq = await contactModel.approveRequestContactRecieved(currentUserId, contactId);
        if (approveReq.nModified === 0) {
            return reject(false);
        }
        //create notification
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: notifiCationModel.types.APPROVE_CONTACT,
        };
        await notifiCationModel.model.createNew(notificationItem);
        resolve(true);
    });
};

// laáy danh sách những người đã kết bạn với mình và mình kết bạn với họ và được họ đồng ý
// this.find({$and:[{$or:[{userId},{contactId}]},{isActice: true}]})
let getContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await contactModel.getContacts(currentUserId, LIMIT_NUMER_TAKEN);
            let users = contacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    return await userModel.getNormalUserDataById(contact.userId);
                } else {
                    return await userModel.getNormalUserDataById(contact.contactId);
                }
            });
            // đợi các promise chạy xong
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
// laáy danh sách những người mình đã đồng ý kết bn
// cách làm lấy dữ find dữ liệu những người mình kết bạn với họ và chưa được mình đồng ý "Trạng thái isActicve bằng false"
// tạo 1 mảng mới có dữ liệu là những cái contactsId chưa đồng ý kết bạn"isActive: true""
let getContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await contactModel.getContactsSent(currentUserId, LIMIT_NUMER_TAKEN);
            let users = contacts.map(async (contact) => {
                return await userModel.findbyIdUser(contact.contactId);
            });
            // đợi các promise chạy xong
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
// laáy danh sách những gửi yêu cầu kết bạn cho mình
// cách làm lấy dữ find dữ liệu những người gửi yêu cầu kết bạn với mình và chưa được mình đồng ý "Trạng thái isActicve bằng false"
// tạo 1 mảng mới có dữ liệu là những cái contactsId mà mình chưa đồng ý kết bạn"isActive: true""
let getContactsReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await contactModel.getContactsReceived(currentUserId, LIMIT_NUMER_TAKEN);
            let users = contacts.map(async (contact) => {
                return await userModel.findbyIdUser(contact.userId);
            });
            // đợi các promise chạy xong
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
let countAllcontacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await contactModel.countAllcontacts(currentUserId);

            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let conut = await contactModel.countAllContactsSent(currentUserId);
            resolve(conut);
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContactsReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await contactModel.countAllContactsReceived(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};
let readMoreContacts = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await contactModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMER_TAKEN);
            let users = newContacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    return await userModel.getNormalUserDataById(contact.userId);
                } else {
                    return await userModel.getNormalUserDataById(contact.contactId);
                }
            });
            // đợi các promise chạy xong
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
let readMoreContactsSent = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await contactModel.readMoreContactsSent(currentUserId, skipNumberContacts, LIMIT_NUMER_TAKEN);

            let users = newContacts.map(async (contact) => {
                return await userModel.findbyIdUser(contact.contactId);
            });
            // đợi các promise chạy xong
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
let readMoreContactsReceiced = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await contactModel.readMoreContactsReceiced(currentUserId, skipNumberContacts, LIMIT_NUMER_TAKEN);
            let users = newContacts.map(async (contact) => {
                return await userModel.getNormalUserDataById(contact.userId);
            });
            // đợi các promise chạy xong
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    findUserContactss: findUserContact,
    addNew: addNew,
    removeContact: removeContact,
    removeRequestContactSent: removeRequestContactSent,
    removeRequestContactRecieved: removeRequestContactRecieved,
    approveRequestContactRecieved: approveRequestContactRecieved,
    getContacts: getContacts,
    getContactsSent: getContactsSent,
    getContactsReceived: getContactsReceived,
    countAllcontacts: countAllcontacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    readMoreContacts: readMoreContacts,
    readMoreContactsSent: readMoreContactsSent,
    readMoreContactsReceiced: readMoreContactsReceiced,
};
