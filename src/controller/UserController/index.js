const { User } = require("../../models/index");
const crypto = require('node:crypto');
const handleSendMail = require("../../configs/mailServices");
const { checkBcrypt, generateBcrypt } = require("../../helpers/bcrypt");
const { generateToken } = require("../../helpers/jwt");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
  UnauthorizedError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { UserServices } = require("../../services");

const { templateEmail } = require("./emailTemplate");

const UserController = {
  // [GET] USERS
  getUsers: async (req, res) => {
    try {
      const users = await UserServices.getUsers();

      if (!users) {
        return new NotFoundError(404, "Not found users").send(res);
      }

      return new GetResponse(200, users).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getUser: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return new BadResquestError(400, "Id is invalid").send(res);
    }

    try {
      const users = await UserServices.getUser(id);

      if (!users) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      return new GetResponse(200, users).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  // [POST] SEND CONFIRM EMAIL
  sendConfirmEmail: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return new BadResquestError(400, "Data send email invalid").send(res);
    }

    try {
      const user = await UserServices.getUserByEmail(email);

      if (user) {
        return new BadResquestError(400, "Email is used").send(res);
      }

      const passwordHash = await generateBcrypt(password);
      let mailContent = {
        to: email,
        subject: "Antran shop thông báo:",
        template: templateEmail.signup,
        context: {
          host: process.env.HOST_URL,
          name,
          password: passwordHash,
          email,
        },
      };

      handleSendMail(mailContent);

      return new CreatedResponse(201, req.body).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [POST] CONFIRM EMAIL AND ADD USER
  creatUser: async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !email || !password) {
      return new BadResquestError(400, "Data confirm email invalid").send(res);
    }

    try {
      const newUser = await UserServices.createUser({
        name,
        email,
        password,
        verify: true,
      });
      if (!newUser) {
        return new BadResquestError(400, "Create user failed").send(res);
      }

      return new CreatedResponse(201, newUser).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    // const secretKey = process.env.PRIVATE_JWT_ID;

    if (!email || !password) {
      return new BadResquestError(400, "Data login invalid").send(res);
    }

    try {
      const user = await UserServices.getUserByEmail(email, {
        _id: 1,
        name: 1,
        email: 1,
        password: 1,
      });
      if (!user) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      const paswordCompare = await checkBcrypt(password, user.password);

      if(!paswordCompare) {
        return new UnauthorizedError().send(res);
      }

      const privateKey = crypto.randomUUID();

      console.log("privateKey:::", privateKey)

      // const isAuth = await checkBcrypt(password, user.password);

      // if (!isAuth) {
      //   return res.status(403).status({
      //     status: 403,
      //     message: "Password is incorrect",
      //   });
      // }

      // const refreshToken = generateToken(
      //   { id: user._id },
      //   secretKey,
      //   "365 days"
      // );
      // const token = generateToken({ id: user._id }, secretKey, "1h");

      // return res.status(200).json({
      //   status: 200,
      //   payload: {
      //     name: user.name,
      //     avatar: user.avatar,
      //     email,
      //     token,
      //     refreshToken,
      //   },
      // });

      return new GetResponse(200, privateKey).send(res);
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
