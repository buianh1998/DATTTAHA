import mongoose from "mongoose";
let ChatGroupSchema = new mongoose.Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 3000 },
    messageAmount: { type: Number, default: 0 },
    userId: String,
    menbers: [{ userId: String }],
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
});
module.exports = mongoose.model("chat-group", ChatGroupSchema);
