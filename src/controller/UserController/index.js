const { User } = require("../../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const handleSendMail = require("../../configs/mailServices");

const UserController = {
  // [GET] ALL USERS
  getAllUsers: async () => {
    try {
      const users = await User.find({});
      res.status(200).json({
        status: 200,
        payload: users,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [POST] SEND CONFIRM EMAIL

  sendConfirmEmail: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        status: 400,
        message: "Error in send confirm email",
      });
      return;
    }

    const mailContent = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Antrandev blog thông báo:",
      text: "Vui lòng nhấn vào link này để xác nhận",
      html: `<a href='${process.env.HOST_URL}?name=${name}&p=${password}&emai=${email}'>Link</a>`,
    };
    handleSendMail(mailContent);

    res.status(200).json({
      status: 200,
      message: "Email sent successfully",
    });
  },
  // [POST] CONFIRM EMAIL AND ADD USER
  confirmEmail: async (req, res) => {
    // p is password
    const { name, p, email } = req.body;
    const password = p;
    const saltRounds = 10;
    const passwordHash = bcrypt.hash(
      password,
      saltRounds,
      function (err, hash) {
        if (err) {
          console.log(err);
          return;
        }

        return hash;
      }
    );
    try {
      const newUser = await new User({
        name,
        email,
        password: passwordHash,
        checkedEmail: true,
      });
      await newUser.save();
      res.status(200).json({
        status: 200,
        message: "Add user successfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = UserController;
