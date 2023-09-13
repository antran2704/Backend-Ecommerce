const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const handleSendMail = (mailContent, viewEngine) => {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    from: process.env.MAIL_USERNAME,
  });

  mailTransporter.use(
    "compile",
    hbs({
      viewEngine,
      viewPath: path.resolve(__dirname, "../../views"),
      extName: ".hbs",
    })
  );

  mailTransporter.sendMail(mailContent, function (err, data) {
    if (err) {
      console.log("Error in send email");
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = handleSendMail;
