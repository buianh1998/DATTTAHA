import multer from "multer";
import { app } from "../Config/app";
import { transErr, tranSuccess } from "../../lang/vi";
import uuidv4 from "uuid/v4";
import { user } from "../services/index.service";
import fsExtra from "fs-extra";
import { validationResult } from "express-validator/check";

let storageAvatar = multer.diskStorage({
    // khai báo nơi lưu
    destination: (req, file, callback) => {
        callback(null, app.avatar_directory);
    },
    filename: (req, file, callback) => {
        let mathFile = app.avatar_type;
        if (mathFile.indexOf(file.mimetype) === -1) {
            return callback(transErr.avatar_type, null);
        }

        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, avatarName);
    },
});
let avatarUploadfile = multer({
    storage: storageAvatar,
    limits: { fileSize: app.avatar_limit_size },
}).single("avatar");

module.exports.updateAvarta = (req, res) => {
    avatarUploadfile(req, res, async (error) => {
        if (error) {
            if (error.message) {
                return res.status(500).send(transErr.avatar_size);
            }
            return res.status(500).send(error);
        }
        try {
            let updateUserItem = {
                avatar: req.file.filename,
                updatedAt: Date.now(),
            };
            //Update user
            let userupdate = await user.updateUser(req.user._id, updateUserItem);
            //not remove avarta the old phôto,
            //remove user
            //await fsExtra.remove(`${app.avatar_directory}/${userupdate.avatar}`);
            let result = {
                message: tranSuccess.user_info_updated,
                imageSrc: `/images/users/${req.file.filename}`,
            };
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);

            return res.status(500).send(error);
        }
    });
};
module.exports.updateInfo = async (req, res) => {
    let errorArr = [];
    //.isEmpty() trả ra trạng thái nhập thành công hay không có 2 trạng thái true or false
    //.mapped() trả ra lỗi sai mà mình mắc phải ở các trường validation
    // console.log(validationResult(req).mapped());
    // console.log("-----------------");

    let validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        let errors = Object.values(validationError.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg);
        });
        return res.status(500).send(errorArr);
    }
    try {
        let updateUserItem = req.body;
        await user.updateUser(req.user._id, updateUserItem);
        let result = {
            message: tranSuccess.user_info_updated,
        };
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};
module.exports.updatePassword = async (req, res) => {
    let errorArr = [];
    //.isEmpty() trả ra trạng thái nhập thành công hay không có 2 trạng thái true or false
    //.mapped() trả ra lỗi sai mà mình mắc phải ở các trường validation
    //console.log(validationResult(req).mapped());
    //console.log("-----------------");

    let validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        let errors = Object.values(validationError.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg);
        });
        return res.status(500).send(errorArr);
    }
    try {
        let updateUserItem = req.body;
        await user.updatePassword(req.user._id, updateUserItem);
        let result = {
            message: tranSuccess.user_password_updated,
        };
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
};
