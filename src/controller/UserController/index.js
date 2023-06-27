const { User } = require("../../models/index");
const handleSendMail = require("../../configs/mailServices");
const { checkBcrypt, generateBcrypt } = require("../../helpers/bcrypt");
const { generateToken } = require("../../helpers/jwt");

const UserController = {
  // [GET] ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      console.log(users)
      return res.status(200).json({
        status: 200,
        payload: users,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [POST] SEND CONFIRM EMAIL

  sendConfirmEmail: async (req, res) => {
    const { name, email, password } = req.body;
    const passwordHash = await generateBcrypt(password);

    const mailContent = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Antrandev blog thông báo:",
      text: "Vui lòng nhấn vào link này để xác nhận",
      html: `<a href='${process.env.HOST_URL}?name=${name}&p=${passwordHash}&emai=${email}'>Link</a>`,
    };
    handleSendMail(mailContent);

    return res.status(200).json({
      status: 200,
      message: "Email sent successfully",
    });
  },
  // [POST] CONFIRM EMAIL AND ADD USER
  confirmEmail: async (req, res) => {
    // p is password
    const { name, p, email } = req.body;
    const password = p;

    try {
      const newUser = await new User({
        name,
        email,
        password,
        checkedEmail: true,
      });

      await newUser.save();

      return res.status(200).json({
        status: 200,
        message: "Add user successfully",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const secretKey = process.env.PRIVATE_JWT_ID;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).status({
          status: 404,
          message: "User is not exit",
        });
      }
      const isAuth = await checkBcrypt(password, user.password);

      if (!isAuth) {
        return res.status(403).status({
          status: 403,
          message: "Password is incorrect",
        });
      }

      const refreshToken = generateToken(
        { id: user._id },
        secretKey,
        "365 days"
      );
      const token = generateToken({ id: user._id }, secretKey, "1h");

      return res.status(200).json({
        status: 200,
        payload: {
          name: user.name,
          avatar: user.avatar,
          email,
          token,
          refreshToken,
        },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  refreshToken: async (req, res) => {
    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];
    const secretKey = process.env.PRIVATE_JWT_ID;

    if (!token) {
      return res.status(400).json({
        status: 400,
        message: "Token is invalid",
      });
    }
    try {
      const decoded = await verifyToken(token, secretKey);
      const token = generateToken({ id: decoded.id }, secretKey, "1h");
      res.status(200).json({
        status: 200,
        payload: {
          token,
        },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.body;
    try {
      const user = await User.findByIdAndDelete({ _id: id });

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User is not exit",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Delete user successfully",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = UserController;
