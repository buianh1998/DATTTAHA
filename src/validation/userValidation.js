import { check } from "express-validator/check";
import { transValidation } from "../../lang/vi";
let updateValid = [
    check("username", transValidation.update_username)
        .optional() // optional cho phép đc null nếu k muốn điền
        .isLength({ min: 3, max: 17 })
        .matches(
            /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
        ),
    check("gender", transValidation.update_gender)
        .optional()
        .isIn(["male", "female"]),
    //isIn là chỉ chọn 1 trong 2 trường trên
    check("address", transValidation.update_address)
        .optional()
        .isLength({ min: 3, max: 40 }),

    check("phone", transValidation.update_phone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/)
];
let updatePassword = [
    check("curentPassword", transValidation.password_incorrect)
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("newPassword", transValidation.password_incorrect)
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("confirmnewPassword", transValidation.password_confirmation_incorrect).custom((value, { req }) => value === req.body.newPassword)
];
module.exports = {
    updateValid: updateValid,
    updatePassword: updatePassword
};
