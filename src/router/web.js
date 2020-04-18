import express from "express";
import { auth, home, user, contact, notificaion, message } from "../controllers/index.controller";
import { authValid, userValid, contactValid, messageValid } from "./../validation/index";
import initPassportLocal from "../controllers/passportController/local.controller";
import initPassportFacebook from "../controllers/passportController/facebook.controller";
import initPassportGoogle from "../controllers/passportController/google.controller";

import passport from "passport";

//Init all passport
initPassportLocal(); //login local
initPassportFacebook(); //loginfacebook
initPassportGoogle();
let router = express.Router();
/**
 * Init all routes
 * @param app from exactly express module
 */
let initRouter = (app) => {
    router.get("/login-register", auth.checkLoggedOut, auth.getLogin);
    router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);
    router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount);
    router.post(
        "/login",
        auth.checkLoggedOut,
        passport.authenticate("local", {
            failureRedirect: "/login-register",
            successFlash: true,
            failureFlash: true,
        }),
        function (req, res) {
            res.redirect("/");
        }
    );
    router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", { scope: ["email"] }));
    router.get(
        "/auth/facebook/callback",
        auth.checkLoggedOut,
        passport.authenticate("facebook", {
            successRedirect: "/",
            failureRedirect: "/login-register",
        })
    );
    router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", { scope: ["email", "profile"] }));
    router.get(
        "/auth/google/callback",
        auth.checkLoggedOut,
        passport.authenticate("google", {
            successRedirect: "/",
            failureRedirect: "/login-register",
        })
    );
    router.get("/", auth.checkLoggedIn, home.getHomeChat);
    router.get("/logout", auth.checkLoggedIn, auth.getLogout);
    router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvarta);
    router.put("/user/update-infouser", auth.checkLoggedIn, userValid.updateValid, user.updateInfo);
    router.put("/user/update-password", auth.checkLoggedIn, userValid.updatePassword, user.updatePassword);
    router.get("/contact/find-users/:keyword", auth.checkLoggedIn, contactValid.findUsersContact, contact.findUserContact);
    router.post("/contact/app-new/", auth.checkLoggedIn, contact.addNew);
    router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
    router.delete("/contact/remove-request-contact-sent", auth.checkLoggedIn, contact.removeRequestContactSent);
    router.delete("/contact/remove-request-contact-recieved", auth.checkLoggedIn, contact.removeRequestContactRecieved);
    router.put("/contact/approve-request-contact-recieved", auth.checkLoggedIn, contact.approveRequestContactRecieved);

    router.get("/contact/read-more-contacts", auth.checkLoggedIn, contact.readMoreContacts);
    router.get("/contact/read-more-contacts-sent", auth.checkLoggedIn, contact.readMoreContactsSent);
    router.get("/contact/read-more-contacts-reveived", auth.checkLoggedIn, contact.readMoreContactsReceiced);
    router.get("/notification/read-more", auth.checkLoggedIn, notificaion.readMore);
    router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notificaion.markAllAsRead);
    router.post("/message/add-new-text-emoji", auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextImoji);
    return app.use("/", router);
};
module.exports = initRouter;
