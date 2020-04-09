import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "../../models/user.model";
import { transErr, tranSuccess } from "../../../lang/vi";
let facebookStrategy = passportFacebook.Strategy;
/**
 * Valid user account type: Facebook
 * Kiểu tra tk local
 * http://localhost:3000/auth/facebook/callback
 */

let fbAppId = 2977038518984502;
let fbAppsecret = "8ba9d066666829447ca45fc6f2fefc22";
let fbCallbackUrl = "https://localhost:3000/auth/facebook/callback";

let initPassportFacebook = () => {
    passport.use(
        new facebookStrategy(
            {
                clientID: fbAppId, //id của ứng dụng face tạo trên kia
                clientSecret: fbAppsecret, // mật khẩu ứng dụng face
                callbackURL: fbCallbackUrl, // đường dẫn của localhost của  mình để kết nối ứng dụng
                passReqToCallback: true,
                profileFields: ["email", "gender", "displayName"], // các trường muốn lấy trên face
            },
            //profile là các thông tin của account face
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    let user = await UserModel.findbyFaceBookUid(profile.id);
                    if (user) {
                        return done(null, user, req.flash("success", tranSuccess.loginSuccess(user.username)));
                    }
                    console.log(profile);

                    let newUserItem = {
                        username: profile.displayName,
                        gender: profile.gender,
                        local: { isActive: true },
                        facebook: {
                            uid: profile.id,
                            token: accessToken,
                            email: typeof profile.emails != "undefined" ? profile.emails[0].value : "null",
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
    passport.deserializeUser((id, done) => {
        // nếu chỉ find dữ liệu sài asysn await, còn lỗi kiểm soát lỗi sài promise then catch
        UserModel.findUserByIdForSessionToUse(id)
            .then((user) => {
                return done(null, user);
            })
            .catch((error) => {
                return done(error, null);
            });
    });
};
module.exports = initPassportFacebook;
