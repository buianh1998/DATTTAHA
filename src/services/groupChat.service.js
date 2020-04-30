import _ from "lodash";
import chatGroupModel from "./../models/chatGroup.model";
let addnewGroup = (currentUserId, arrayMenberIds, groupChatName) => {
    return new Promise(async (resolve, reject) => {
        try {
            //add currentUserId to arrayMenber
            arrayMenberIds.unshift({ userId: `${currentUserId}` });
            arrayMenberIds = _.uniqBy(arrayMenberIds, "userId");
            let newGroupItem = {
                name: groupChatName,
                userAmount: arrayMenberIds.length,
                userId: `${currentUserId}`,
                menbers: arrayMenberIds,
            };
            let newGroup = await chatGroupModel.createNew(newGroupItem);
            resolve(newGroup);
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    addnewGroup: addnewGroup,
};
