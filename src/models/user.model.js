import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import passport from "passport";
let userSchema = new mongoose.Schema({
    username: String,
    gender: { type: String, default: "male" },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: "avatar-default.jpg" },
    role: { type: String, default: "user" },
    local: {
        email: { type: String, trim: true },
        password: String,
        isActive: { type: Boolean, default: false },
        veryfyToken: String
    },
    facebook: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    google: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
});
userSchema.statics = {
    createNewUser(item) {
        return this.create(item);
    },
    findbyIdUser(id) {
        return this.findById(id).exec();
    },
    findByEmail(email) {
        return this.findOne({ "local.email": email }).exec();
    },
    removeById(id) {
        return this.findByIdAndRemove(id).exec();
    },
    findByToken(token) {
        return this.findOne({ "local.veryfyToken": token }).exec();
    },
    veryfyToken(token) {
        return this.findOneAndUpdate({ "local.veryfyToken": token }, { "local.isActive": true, "local.veryfyToken": null }).exec();
    },
    findbyFaceBookUid(uid) {
        return this.findOne({ "facebook.uid": uid }).exec();
    },
    findbyGoogleUid(uid) {
        return this.findOne({ "google.uid": uid }).exec();
    },
    updateUser(id, item) {
        return this.findByIdAndUpdate(id, item).exec();
    },
    updatePassword(id, hashedPassword) {
        return this.findByIdAndUpdate(id, { "local.password": hashedPassword }).exec();
    },
    /**
     *
     * @param {array: deprecatedUserIds} deprecatedUserIds
     * @param {string: keyword} keyword
     */
    findAllForAddContact(deprecatedUserIds, keyword) {
        return this.find(
            {
                $and: [
                    { _id: { $nin: deprecatedUserIds } },
                    { "local.isActive": true },
                    {
                        $or: [
                            { username: { $regex: new RegExp(keyword, "i") } },
                            { "local.email": { $regex: new RegExp(keyword, "i") } },
                            { "facebook.email": { $regex: new RegExp(keyword, "i") } },
                            { "google.email": { $regex: new RegExp(keyword, "i") } }
                        ]
                    }
                ]
            },
            { _id: 1, username: 1, address: 1, avatar: 1 }
        ).exec();
    },
    getNormalUserDataById(id) {
        return this.findById(id, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
    }
};
//static nằm chỉ ở phía schema hỗ trợ chúng ta tìm ra bản ghi
//khi tìm ra bản ghi rồi sử dụng bản ghi đó gọi đến các phương thức trong methods
userSchema.methods = {
    comparePassword(password) {
        return bcrypt.compare(password, this.local.password); //return a promise has result is true or false
    }
};
module.exports = mongoose.model("users", userSchema);
