import nodemailer from "nodemailer";
let adminEmail = "theanhbui17121998@gmail.com";
let adminPassword = "0942559724";
let adminHost = "smtp.gmail.com";
let adminPort = 587;

let sendMail = (to, subject, htmlContent) => {
    let transporter = nodemailer.createTransport({
        host: adminHost,
        port: adminPort,
        secure: false,
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    });
    let options = {
        from: adminEmail,
        to: to,
        subject: subject,
        html: htmlContent
    };
    return transporter.sendMail(options); //this default return promise
};
module.exports = sendMail;
