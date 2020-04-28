import { contact } from "../services/index.service";
import { validationResult } from "express-validator/check";

module.exports.findUserContact = async (req, res) => {
    let errorArr = [];
    //.isEmpty() trả ra trạng thái nhập thành công hay không có 2 trạng thái true or false
    //.mapped() trả ra lỗi sai mà mình mắc phải ở các trường validation
    // console.log(validationResult(req).mapped());
    // console.log("-----------------");

    let validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        let errors = Object.values(validationError.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg);
        });
        // Loging
        // console.log(errorArr);
        return res.status(500).send(errorArr);
    }
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;

        let users = await contact.findUserContactss(currentUserId, keyword);
        return res.render("main/contact/sessions/_findUsersContact", { users: users });
    } catch (error) {
        return res.status(500).send(error);
    }
};
module.exports.addNew = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactid = req.body.uid;
        let newContact = await contact.addNew(currentUserId, contactid);

        return res.status(200).send({ success: !!newContact });
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports.removeContact = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactid = req.body.uid;
        let removeContact = await contact.removeContact(currentUserId, contactid);
        return res.status(200).send({ success: !!removeContact });
    } catch (error) {
        return res.status(500).send(error);
    }
};
module.exports.removeRequestContactSent = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactid = req.body.uid;
        let removeRqContact = await contact.removeRequestContactSent(currentUserId, contactid);
        return res.status(200).send({ success: !!removeRqContact });
    } catch (error) {
        return res.status(500).send(error);
    }
};
module.exports.removeRequestContactRecieved = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactid = req.body.uid;
        let removeRqContact = await contact.removeRequestContactRecieved(currentUserId, contactid);
        return res.status(200).send({ success: !!removeRqContact });
    } catch (error) {
        console.log(error);

        return res.status(500).send(error);
    }
};
module.exports.approveRequestContactRecieved = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactid = req.body.uid;
        let approveRqContact = await contact.approveRequestContactRecieved(currentUserId, contactid);
        return res.status(200).send({ success: !!approveRqContact });
    } catch (error) {
        console.log(error);

        return res.status(500).send(error);
    }
};

module.exports.readMoreContacts = async (req, res) => {
    try {
        //get skip Number from query param
        let skipNumberContacts = +req.query.skipNumber;
        let newContactUser = await contact.readMoreContacts(req.user._id, skipNumberContacts);
        //get more Item
        return res.status(200).send(newContactUser);
    } catch (error) {
        return res.status(500).send(error);
    }
};
module.exports.readMoreContactsSent = async (req, res) => {
    try {
        //get skip Number from query param
        let skipNumberContacts = +req.query.skipNumber;

        let newContactUser = await contact.readMoreContactsSent(req.user._id, skipNumberContacts);

        //get more Item
        return res.status(200).send(newContactUser);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports.readMoreContactsReceiced = async (req, res) => {
    try {
        //get skip Number from query param
        let skipNumberContacts = +req.query.skipNumber;
        let newContactUser = await contact.readMoreContactsReceiced(req.user._id, skipNumberContacts);
        //get more Item
        return res.status(200).send(newContactUser);
    } catch (error) {
        return res.status(500).send(error);
    }
};
module.exports.searchFriends = async (req, res) => {
    let errorArr = [];
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        let errors = Object.values(validationError.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg);
        });

        return res.status(500).send(errorArr);
    }
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;

        let users = await contact.searchFriend(currentUserId, keyword);
        return res.render("main/groupChat/sections/_searchFriend", { users: users });
    } catch (error) {
        return res.status(500).send(error);
    }
};
