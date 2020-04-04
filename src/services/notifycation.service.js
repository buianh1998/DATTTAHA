import notifiCationModel from "../models/notification.model";
import userModel from "../models/user.model";
const LIMIT_NUMER_TAKEN = 1;
/**c
 * Get notifications when f5 page
 * @param {string} currentUserId
 */
let getNotifycations = currentUserId => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = await notifiCationModel.model.getByUserIdandLimit(currentUserId, LIMIT_NUMER_TAKEN);
            let getNotifiContents = notifications.map(async notification => {
                let sender = await userModel.findbyIdUser(notification.senderId);
                return notifiCationModel.content.getContent(
                    notification.type,
                    notification.isRead,
                    sender._id,
                    sender.username,
                    sender.avatar
                );
            });
            // đợi các promise chạy xong
            resolve(await Promise.all(getNotifiContents));
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * Count all notifications unread
 * @param {string} currentUserId
 */
let countNotifiUnread = currentUserId => {
    return new Promise(async (resolve, reject) => {
        try {
            let countNotifiUnread = await notifiCationModel.model.countNotifiUnread(currentUserId);
            resolve(countNotifiUnread);
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * readmore notifications, max 10 item one time
 * @param {string} currentUserId
 * @param {number} skipNumberNotification
 */
let readMore = (currentUserId, skipNumberNotification) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newNotifiCations = await notifiCationModel.model.readMore(currentUserId, skipNumberNotification, LIMIT_NUMER_TAKEN);
            let getNotifiContents = newNotifiCations.map(async notification => {
                let sender = await userModel.findbyIdUser(notification.senderId);
                return notifiCationModel.content.getContent(
                    notification.type,
                    notification.isRead,
                    sender._id,
                    sender.username,
                    sender.avatar
                );
            });
            // đợi các promise chạy xong
            resolve(await Promise.all(getNotifiContents));
        } catch (error) {
            reject(error);
        }
    });
};
let markAllAsRead = (currentUserId, targetUsers) => {
    return new Promise(async (resolve, reject) => {
        try {
            await notifiCationModel.model.markAllAsRead(currentUserId, targetUsers);
            resolve(true);
        } catch (error) {
            console.log(`error when mark notifications as read: ${error}`);

            reject(false);
        }
    });
};
module.exports = {
    getNotifycations: getNotifycations,
    countNotifiUnread: countNotifiUnread,
    readMore: readMore,
    markAllAsRead: markAllAsRead
};
