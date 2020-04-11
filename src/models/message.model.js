import mongoose from "mongoose";
let messageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    conversationType: String,
    messageType: String,
    sender: {
        id: String,
        name: String,
        avatar: String,
    },
    receiver: {
        id: String,
        name: String,
        avatar: String,
    },
    text: String,
    file: { data: Buffer, contentType: String, fileName: String },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null },
});
messageSchema.statics = {
    /**
     * get limited item one time
     * @param {string} senderId
     * @param {string} receiverId
     * @param {number} limit
     */
    getMessageInPersonal(senderId, receiverId, limit) {
        return this.find({
            $or: [
                { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
                { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
            ],
        })
            .sort({ createdAt: 1 })
            .limit(limit);
    },
    getMessageInGroup(receiverId, limit) {
        return this.find({ receiverId: receiverId }).sort({ createdAt: 1 }).limit(limit);
    },
};
const MESSAGE_CONVERSATION_TYPES = {
    PESONAL: "personal",
    GROUP: "group",
};

const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file",
};
module.exports = {
    model: mongoose.model("message", messageSchema),
    conversationTypes: MESSAGE_CONVERSATION_TYPES,
    messageTypes: MESSAGE_TYPES,
};
