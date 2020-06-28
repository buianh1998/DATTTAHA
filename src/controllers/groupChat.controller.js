import { validationResult } from "express-validator/check";
import { groupChat } from "./../services/index.service";
module.exports.addNewGroup = async (req, res) => {
    // let errorArr = [];
    // let validationError = validationResult(req);
    // if (!validationError.isEmpty()) {
    //     let errors = Object.values(validationError.mapped());
    //     errors.forEach((item) => {
    //         errorArr.push(item.msg);
    //     });
    //     return res.status(500).send(errorArr);
    // }
    try {
        let currentUserId = req.user._id;
        let arrayMenberIds = req.body.arrayIds;
        let groupChatName = req.body.groupChatNames;
        let newGroupChat = await groupChat.addnewGroup(currentUserId, arrayMenberIds, groupChatName);
        return res.status(200).send({ groupChat: newGroupChat });
    } catch (error) {
        return res.status(500).send(error);
    }
};
