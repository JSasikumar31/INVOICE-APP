require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.Email_User,
    pass: process.env.Email_Password,
  },
});

const mailOptions = {
  from: {
    name: "Robocoupler",
    address: process.env.Email_User,
  }, // sender address
  to: [ "janapareddysasi31@gmail.com"], // list of receivers
  subject: "INVOICE FROM ROBOCOUPLER ✔", // Subject line
  text: "THX FOR THE PURCHASE", // plain text body
  html: "<b>Hello world?</b>", // html body
  attachments: [
    {
      filename: "sample pdf",
      path: path.join(__dirname, "mypdf.pdf"),
      contentType: "application/pdf",
    },
    {
      filename: "sample jpg",
      path: path.join(__dirname, "mainlogo.jpg"),
      contentType: "application/jpg",
    },
  ],
};
const sendMail = async () => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("email has been sent");
  } catch (error) {
    console.log(error);
  }
};
sendMail(transporter, mailOptions);
