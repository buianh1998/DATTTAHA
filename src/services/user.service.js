import UserModel from "../models/user.model";
import { transErr } from "./../../lang/vi";
import brypt from "bcryptjs";
import { user } from "./index.service";
const saltRounds = 7;
/**
 *
 * @param {UserId} id
 * @param {data update} item
 */
let updateUser = (id, item) => {
    return UserModel.updateUser(id, item);
};
/**
 *
 * @param {*UserId} id
 * @param {*data update} item
 */
let updatePassword = (id, dataUpdate) => {
    return new Promise(async (reslove, reject) => {
        let currentUser = await UserModel.findbyIdUser(id);

        if (!currentUser) return reject(transErr.account_undefined);

        let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.curentPassword);
        if (!checkCurrentPassword) {
            return reject(transErr.user_current_password_failed);
        }
        let salt = brypt.genSaltSync(saltRounds);
        await UserModel.updatePassword(id, brypt.hashSync(dataUpdate.newPassword, salt));
        reslove(true);
    });
};
module.exports = {
    updateUser: updateUser,
    updatePassword: updatePassword
};
