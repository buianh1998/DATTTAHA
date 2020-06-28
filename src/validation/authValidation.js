import { check } from "express-validator/check";
import { transValidation } from "../../lang/vi";
let register = [
    check("email", transValidation.email_incorrect)
        .isEmail() // phải đúng kiểu email
        .trim(), // phải viết liền k đấu
    check("gender", transValidation.gender_incorrect).isIn(["male", "female"]),
    //isIn là chỉ chọn 1 trong 2 trường trên
    check("password", transValidation.password_incorrect)
        .isLength({ min: 8, max: 32 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
        .trim(),
    // length là password phải có tối thiểu bao nhiêu ký tự
    // matches là phải có chữ hoa chữ thường số
    check("password_confirmation", transValidation.password_confirmation_incorrect).custom((value, { req }) => {
        return value === req.body.password;
    }),
];

module.exports = {
    register: register,
};
