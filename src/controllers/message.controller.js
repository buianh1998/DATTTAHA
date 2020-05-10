import { validationResult } from "express-validator/check";
import { message } from "./../services/index.service";
import multer from "multer";
import { app } from "../Config/app";
import { transErr, tranSuccess } from "../../lang/vi";
import fsExtra from "fs-extra";
import ejs from "ejs";
import { lastItemOfArray, convertTimestampToHumanTime, bufferBase64 } from "./../helpers/client.heplers";
import { promisify } from "util";
// Make render file ejs function available asysn await
const renderFile = promisify(ejs.renderFile).bind(ejs);

let storageImageChat = multer.diskStorage({
    // khai báo nơi lưu
    destination: (req, file, callback) => {
        callback(null, app.image_message_directory);
    },
    filename: (req, file, callback) => {
        let mathFile = app.image_message_type;
        if (mathFile.indexOf(file.mimetype) === -1) {
            return callback(transErr.image_message_type, null);
        }

        let imageName = file.originalname;
        callback(null, imageName);
    },
});
let imageMessageUploadfile = multer({
    storage: storageImageChat,
    limits: { fileSize: app.image_limit_size },
}).single("my-image-chat");
module.exports.addNewTextImoji = async (req, res) => {
    let errArr = [];
    let errValidationMessage = validationResult(req);
    if (!errValidationMessage.isEmpty()) {
        let errorsMes = Object.values(errValidationMessage.mapped());
        errorsMes.forEach((errMes) => {
            errArr.push(errMes.msg);
        });
        return res.status(500).send(errArr);
    }
    try {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar,
        };
        let recieverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let isChatGroup = req.body.isChatGroup;
        let newMessage = await message.addNewTextImoji(sender, recieverId, messageVal, isChatGroup);
        return res.status(200).send({ message: newMessage });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};
module.exports.addNewImage = async (req, res) => {
    imageMessageUploadfile(req, res, async (errorImage) => {
        if (errorImage) {
            if (errorImage.message) {
                return res.status(500).send(transErr.image_message_size);
            }
            return res.status(500).send(errorImage);
        }
        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar,
            };
            let recieverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;
            let newMessage = await message.addNewImage(sender, recieverId, messageVal, isChatGroup);
            //remove image, because this image is saved to mongodb
            await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);
            return res.status(200).send({ message: newMessage });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    });
};
//Hanled attachment chat
let storageAttachmentChat = multer.diskStorage({
    // khai báo nơi lưu
    destination: (req, file, callback) => {
        callback(null, app.attachment_message_directory);
    },
    filename: (req, file, callback) => {
        let attachmentName = file.originalname;
        callback(null, attachmentName);
    },
});
let attachmentMessageUploadfile = multer({
    storage: storageAttachmentChat,
    limits: { fileSize: app.attachment_limit_size },
}).single("my-attachment-chat");
module.exports.addNewAttachment = async (req, res) => {
    attachmentMessageUploadfile(req, res, async (errorAttachment) => {
        if (errorAttachment) {
            if (errorImage.message) {
                return res.status(500).send(transErr.file_message_size);
            }
            console.log(errorAttachment);

            return res.status(500).send(errorAttachment);
        }
        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar,
            };
            let recieverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;
            let newMessage = await message.addNewAttachment(sender, recieverId, messageVal, isChatGroup);
            //remove attachemnt, because this attachemnt is saved to mongodb
            await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`);
            return res.status(200).send({ message: newMessage });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    });
};
module.exports.readMoreAllChat = async (req, res) => {
    try {
        //get skip Number from query param
        let skipPersonnal = +req.query.skipPersonnal;
        let skipGroup = +req.query.skipGroup;
        let newAllConversations = await message.readMoreAllChat(req.user._id, skipPersonnal, skipGroup);
        let dataToRender = {
            newAllConversations: newAllConversations,
            lastItemOfArray: lastItemOfArray,
            convertTimestampToHumanTime: convertTimestampToHumanTime,
            bufferBase64: bufferBase64,
            user: req.user,
        };
        //get more Item
        let leftSideData = await renderFile("src/views/main/readMoreConversation/_leftSide.ejs", dataToRender);
        let rightSideData = await renderFile("src/views/main/readMoreConversation/_rightSide.ejs", dataToRender);
        let imageModalData = await renderFile("src/views/main/readMoreConversation/_imageModal.ejs", dataToRender);
        let actachmentModalData = await renderFile("src/views/main/readMoreConversation/_actachmentModal.ejs", dataToRender);
        return res.status(200).send({
            leftSideData: leftSideData,
            rightSideData: rightSideData,
            imageModalData: imageModalData,
            actachmentModalData: actachmentModalData,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};
module.exports.readMore = async (req, res) => {
    try {
        //get skip Number from query param
        let skipMessage = +req.query.skipMessage;
        let targetid = req.query.targetId;
        let chatInGroup = req.query.chatInGroup === "true";

        let newMessages = await message.readMore(req.user._id, skipMessage, targetid, chatInGroup);
        let dataToRender = {
            newMessages: newMessages,
            bufferBase64: bufferBase64,
            user: req.user,
        };
        //get more Item
        let rightSideData = await renderFile("src/views/main/readMoreMessages/_rightSide.ejs", dataToRender);
        let imageModalData = await renderFile("src/views/main/readMoreMessages/_imageModal.ejs", dataToRender);
        let actachmentModalData = await renderFile("src/views/main/readMoreMessages/_actachmentModal.ejs", dataToRender);
        return res.status(200).send({
            rightSideData: rightSideData,
            imageModalData: imageModalData,
            actachmentModalData: actachmentModalData,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};
