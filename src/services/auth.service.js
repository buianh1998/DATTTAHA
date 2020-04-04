import userModel from "../models/user.model";
import bcryptjs, { genSaltSync } from "bcryptjs";
import uuidv4 from "uuid/v4";
import { transErr, tranSuccess, transMail } from "../../lang/vi";
import sendMail from "./../Config/mailer";
let saltRounds = 7;
let register = (email, gender, password, protocol, host) => {
    return new Promise(async (resolve, reject) => {
        let userByEmail = await userModel.findByEmail(email);
        if (userByEmail) {
            if (userByEmail.deletedAt != null) {
                return reject(transErr.account_in_remove);
            }
            if (!userByEmail.local.isActive) {
                return reject(transErr.account_in_notactive);
            }
            return reject(transErr.account_in_user);
        }
        let salt = genSaltSync(saltRounds);
        let item = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: bcryptjs.hashSync(password, salt),
                veryfyToken: uuidv4()
            }
        };
        let user = await userModel.createNewUser(item);
        let linkVerify = `${protocol}://${host}/verify/${user.local.veryfyToken}`;
        //send email
        sendMail(email, transMail.subject, transMail.templeat(linkVerify))
            .then(success => {
                resolve(tranSuccess.userCeated(user.local.email));
            })
            .catch(async err => {
                await userModel.removeById(user._id);
                //remove user
                console.log(err);
                reject(transMail.send_failed);
            });
    });
};
let verifyAccount = token => {
    return new Promise(async (resolve, reject) => {
        let userByToken = await userModel.findByToken(token);
        if (!userByToken) {
            return reject(transErr.token_undefined);
        }
        await userModel.veryfyToken(token);
        resolve(tranSuccess.account_active);
    });
};
module.exports = {
    register: register,
    verifyAccount: verifyAccount
};
