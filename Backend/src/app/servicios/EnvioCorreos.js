"use strict";
const nodemailer = require("nodemailer");
const config  = require('../../config').config;

// async..await is not allowed in global scope, must use a wrapper
async function enviarCorreo(email, queja) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
    console.log('Configuracion ', config);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"MI PISTIO" <mipistioumg@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Recepción de Queja", // Subject line
        html: `<b>“Señor cuentahabiente, agradecemos su comunicación, le informamos que
                su queja ha sido recibida exitosamente. Para el seguimiento o cualquier
                consulta relacionada, no olvide que el número de su queja es ${queja}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = { enviarCorreo }