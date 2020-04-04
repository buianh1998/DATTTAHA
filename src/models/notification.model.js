import mongoose from "mongoose";
let notificationShema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    type: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now }
});
notificationShema.statics = {
    createNew(item) {
        return this.create(item);
    },
    removeRequestContactSentNotification(senderId, receiverId, type) {
        return this.remove({
            $and: [{ senderId: senderId }, { receiverId: receiverId }, { type: type }]
        }).exec();
    },
    /**
     *
     * @param {string} userId
     * @param {number} limit
     */
    getByUserIdandLimit(userId, limit) {
        return this.find({
            receiverId: userId
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    },
    /**
     *
     * @param {string} userId
     */ countNotifiUnread(userId) {
        return this.count({
            $and: [{ receiverId: userId }, { isRead: false }]
        }).exec();
    },
    /**
     *
     * @param {string} userId
     * @param {number} skip
     * @param {number} limit
     */
    readMore(userId, skip, limit) {
        return this.find({
            receiverId: userId
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
    /**
     *
     * @param {string} userId
     * @param {array} targetUsers
     */
    markAllAsRead(userId, targetUsers) {
        return this.updateMany(
            {
                $and: [{ receiverId: userId, senderId: { $in: targetUsers } }, {}]
            },
            { isRead: true }
        ).exec();
    }
};
const NOTIFICATION_TYPES = {
    ADD_CONTACT: "add_contact",
    APPROVE_CONTACT: "approve_contact"
};
const NOTIFICATION_CONTENTS = {
    getContent: (notificationType, isRead, userId, userName, userAvatar) => {
        if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
            if (!isRead) {
                return `<div class="notif-readed-flase" data-uid="${userId}">
                <img
                    class="avatar-small"
                    src="images/users/${userAvatar}"
                    alt=""
                />
                <strong>${userName}"</strong> đã gửi cho bạn 1 lời mời kết bạn! </div>`;
            }
            return `<div  data-uid="${userId}">
            <img
                class="avatar-small"
                src="images/users/${userAvatar}"
                alt=""
            />
            <strong>${userName}"</strong> đã gửi cho bạn 1 lời mời kết bạn! </div>`;
        }
        if (notificationType === NOTIFICATION_TYPES.APPROVE_CONTACT) {
            if (!isRead) {
                return `<div class="notif-readed-flase" data-uid="${userId}">
                <img
                    class="avatar-small"
                    src="images/users/${userAvatar}"
                    alt=""
                />
                <strong>${userName}"</strong> đã chấp nhận lời mời kết bạn của bạn! </div>`;
            }
            return `<div  data-uid="${userId}">
            <img
                class="avatar-small"
                src="images/users/${userAvatar}"
                alt=""
            />
            <strong>${userName}"</strong> đã chấp nhận lời mời kết bạn của bạn! </div>`;
        }
        return "No matching with any notification type";
    }
};
module.exports = {
    model: mongoose.model("notification", notificationShema),
    types: NOTIFICATION_TYPES,
    content: NOTIFICATION_CONTENTS
};
