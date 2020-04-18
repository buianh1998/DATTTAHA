import passport from "passport";
import passportGoogle from "passport-google-oauth2";
import UserModel from "../../models/user.model";
import chatGroupModel from "../../models/chatGroup.model";

import { transErr, tranSuccess } from "../../../lang/vi";
let googleStrategy = passportGoogle.Strategy;
/**
 * Valid user account type: Facebook
 * Kiểu tra tk local
 * http://localhost:3000/auth/facebook/callback
 */

let ggAppId = "514713477415-qgti9ncncnk9qvvl1kt7177193cfue99.apps.googleusercontent.com";
let ggAppsecret = "Y3kK8n9L2T8TPaxWd-_B6Rui";
let ggCallbackUrl = "https://localhost:3000/auth/google/callback";

let initPassportGoogle = () => {
    passport.use(
        new googleStrategy(
            {
                clientID: ggAppId, //id của ứng dụng face tạo trên kia
                clientSecret: ggAppsecret, // mật khẩu ứng dụng face
                callbackURL: ggCallbackUrl, // đường dẫn của localhost của  mình để kết nối ứng dụng
                passReqToCallback: true,
            },
            //profile là các thông tin của account face
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    let user = await UserModel.findbyGoogleUid(profile.id);
                    if (user) {
                        return done(null, user, req.flash("success", tranSuccess.loginSuccess(user.username)));
                    }

                    let newUserItem = {
                        username: profile.displayName,
                        gender: profile.gender,
                        local: { isActive: true },
                        google: {
                            uid: profile.id,
                            token: accessToken,
                            email: profile.emails[0].value,
                        },
                    };
                    let newUserFB = await UserModel.createNewUser(newUserItem);
                    return done(null, newUserFB, req.flash("success", tranSuccess.loginSuccess(newUserFB.username)));
                } catch (error) {
                    console.log(error);

                    return done(null, false, req.flash("errors", transErr.server_error));
                }
            }
        )
    );

    //save userId to session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    // lưu user id ở serializeUser
    // khi đã lưu được thì sẽ có thể lấy đc toàn bộ thông tin cảu user bằng id khi dùng deserializeUser
    passport.deserializeUser(async (id, done) => {
        // nếu chỉ find dữ liệu sài asysn await, còn lỗi kiểm soát lỗi sài promise then catch
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
};
module.exports = initPassportGoogle;
