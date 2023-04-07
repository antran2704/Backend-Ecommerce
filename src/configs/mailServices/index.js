const nodemailer = require("nodemailer");

const handleSendMail = (mailContent) => {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  mailTransporter.sendMail(mailContent, function (err, data) {
    if (err) {
      console.log("Error in send email");
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = handleSendMail;
