"use strict";
import nodemailer from "nodemailer";
import 'dotenv/config';
const {nodemailerUser, nodemailerPassword} = process.env;

// async..await is not allowed in global scope, must use a wrapper
async function main(toAddress: string, subject: string, text: string, HTML: string) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: nodemailerUser,
        pass: nodemailerPassword // generated google mail password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: nodemailerUser, // sender address
    to: toAddress, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: HTML, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

//main().catch(error => console.error("Harish: " + error));
export default main;
