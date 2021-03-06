import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "../../models/user.model";
import chatGroupModel from "./../../models/chatGroup.model";

import { transErr, tranSuccess } from "../../../lang/vi";
let localStrategy = passportLocal.Strategy;
/**
 * Valid user account type: Local
 * Kiểu tra tk local
 */
let initPassportLocal = () => {
    //save userId to session
    passport.serializeUser((user, done) => done(null, user._id));
    // lưu user id ở serializeUser
    // khi đã lưu được thì sẽ có thể lấy đc toàn bộ thông tin cảu user bằng id khi dùng deserializeUser
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await UserModel.findUserByIdForSessionToUse(id);
            let getChatGroupIds = await chatGroupModel.getChatGroupIdsByUser(user._id);
            user = user.toObject();
            user.chatGroupIds = getChatGroupIds;
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    });
    passport.use(
        new localStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    let user = await UserModel.findByEmail(email);
                    if (!user) {
                        return done(null, false, req.flash("errors", transErr.login_failed));
                    }
                    if (!user.local.isActive) {
                        return done(null, false, req.flash("errors", transErr.account_in_notactive));
                    }

                    let checkPassword = await user.comparePassword(password);
                    if (!checkPassword) {
                        return done(null, false, req.flash("errors", transErr.login_failed));
                    }
                    return done(null, user);
                } catch (error) {
                    console.log(error);
                    return done(null, false, req.flash("errors", transErr.server_error));
                }
            }
        )
    );
};
module.exports = initPassportLocal;
