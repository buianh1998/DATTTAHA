import { validationResult } from "express-validator/check";
import { message } from "./../services/index.service";
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
