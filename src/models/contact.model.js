import mongoose from "mongoose";
let contactSchema = new mongoose.Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null },
});
contactSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    /**
     * find all items that related with user
     * @param {String} userId
     */
    findAllByUser(userid) {
        return this.find({ $or: [{ userId: userid }, { contactId: userid }] }).exec();
    },
    /**
     * check exits  of 2 user
     * @param {*} userId
     * @param {*} contactId
     */
    checkExits(userId, contactId) {
        return this.findOne({
            $or: [{ $and: [{ userId: userId }, { contactId, contactId }] }, { $and: [{ contactId: userId }, { userId: contactId }] }],
        }).exec();
    },
    /**
     *
     * @param {string} userId
     * @param {string} contactId
     */
    removeContact(userId, contactId) {
        return this.remove({
            $or: [
                { $and: [{ userId: userId }, { contactId, contactId }, { status: true }] },
                { $and: [{ contactId: userId }, { userId: contactId }, { status: true }] },
            ],
        }).exec();
    },
    /**
     * Remove request sent
     * @param {*} userId
     * @param {*} contactId
     */
    removeRequestContactSent(userId, contactId) {
        return this.remove({
            $and: [{ userId: userId }, { contactId, contactId }, { status: false }],
        });
    },
    /**
     *  Remove request recieved
     * @param {*} userId
     * @param {*} contactId
     */
    removeRequestContactRecieved(userId, contactId) {
        return this.remove({
            $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
        });
    },
    /**
     * Approve contact
     * @param {string: of currentUser} userId
     * @param {string} contactId
     */
    approveRequestContactRecieved(userId, contactId) {
        return this.update(
            {
                $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
            },
            { status: true, updatedAt: Date.now() }
        );
    },
    /**
     * get contact by user Id and limit
     * @param {string} userId
     * @param {number} limit
     */
    getContacts(userId, limit) {
        return this.find({
            $and: [{ $or: [{ userId: userId }, { contactId: userId }] }, { status: true }],
        })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .exec();
    },
    getContactsSent(userId, limit) {
        return this.find({
            $and: [{ userId: userId }, { status: false }],
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    },
    getContactsReceived(userId, limit) {
        return this.find({
            $and: [{ contactId: userId }, { status: false }],
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    },
    countAllcontacts(userId) {
        return this.count({
            $and: [{ $or: [{ userId: userId }, { contactId: userId }] }, { status: true }],
        }).exec();
    },
    countAllContactsSent(userId) {
        return this.count({
            $and: [{ userId: userId }, { status: false }],
        }).exec();
    },
    countAllContactsReceived(userId) {
        return this.count({
            $and: [{ contactId: userId }, { status: false }],
        }).exec();
    },
    readMoreContacts(userId, skip, limit) {
        return this.find({
            $and: [{ $or: [{ userId: userId }, { contactId: userId }] }, { status: true }],
        })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
    readMoreContactsSent(userId, skip, limit) {
        return this.find({
            $and: [{ userId: userId }, { status: false }],
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
    readMoreContactsReceiced(userId, skip, limit) {
        return this.find({
            $and: [{ contactId: userId }, { status: false }],
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
};
module.exports = mongoose.model("contact", contactSchema);
