import mongoose from "mongoose";
let ChatGroupSchema = new mongoose.Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 3000 },
    messageAmount: { type: Number, default: 0 },
    userId: String,
    menbers: [{ userId: String }],
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null },
});
ChatGroupSchema.statics = {
    /**
     * get Data Chatgroup Item find UserId
     * @param {string} userId
     * @param {number} limit
     */
    getChatGroups(userId, limit) {
        return this.find({
            menbers: { $elemMatch: { userId: userId } },
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    },
};
module.exports = mongoose.model("chat-group", ChatGroupSchema);
