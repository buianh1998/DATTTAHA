import { validationResult } from "express-validator/check";
import { auth } from "../services/index.service";
import { tranSuccess } from "../../lang/vi";
module.exports.getLogin = (req, res) => {
    return res.render("auth/master", {
        errors: req.flash("errors"),
        success: req.flash("success")
    });
};
module.exports.getLogout = (req, res) => {
    return res.render("auth/master");
};
module.exports.postRegister = async (req, res) => {
    let errorArr = [];
    let successArr = [];
    //.isEmpty() trả ra trạng thái nhập thành công hay không có 2 trạng thái true or false
    //.mapped() trả ra lỗi sai mà mình mắc phải ở các trường validation
    console.log(validationResult(req).mapped());
    console.log("-----------------");

    let validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        let errors = Object.values(validationError.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        req.flash("errors", errorArr);
        return res.redirect("/login-register");
    }
    let { email, gender, password } = req.body;
    try {
        let createUserSuccess = await auth.register(email, gender, password, req.protocol, req.get("host"));
        successArr.push(createUserSuccess);
        req.flash("success", successArr);
        res.redirect("/login-register");
    } catch (error) {
        errorArr.push(error);
        req.flash("errors", errorArr);
        return res.redirect("/login-register");
    }
};
module.exports.verifyAccount = async (req, res, nexr) => {
    let errorArr = [];
    let successArr = [];
    try {
        let verifySuccess = await auth.verifyAccount(req.params.token);
        successArr.push(verifySuccess);
        req.flash("success", successArr);
        res.redirect("/login-register");
    } catch (error) {
        errorArr.push(error);
        req.flash("errors", errorArr);
        return res.redirect("/login-register");
    }
};
module.exports.checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login-register");
    }
    next();
};
module.exports.checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};
module.exports.getLogout = (req, res) => {
    req.logout(); //remove session passport
    req.flash("success", tranSuccess.logout_success);
    return res.redirect("/login-register");
};
