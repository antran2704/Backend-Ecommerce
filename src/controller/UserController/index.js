const { User } = require("../../models/index");
const {
  UserServices,
  KeyTokenServices,
  CartServices,
  ApiKeyServices,
  CacheUserServices,
} = require("../../services");

const crypto = require("node:crypto");
const handleSendMail = require("../../configs/mailServices");
const { checkBcrypt, generateBcrypt } = require("../../helpers/bcrypt");
const { generateToken, verifyToken } = require("../../helpers/jwt");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
  UnauthorizedError,
  ForbiddenError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");

const { templateEmail } = require("./emailTemplate");
const convertObjectToString = require("../../helpers/convertObjectString");
const keyTokenServices = require("../../services/KeyToken/keyToken.services");
const getSelect = require("../../helpers/getSelect");
const { isValidObjectId } = require("mongoose");
const PERMISSION = require("../../common/permission.enum");
const { ROLE } = require("../../common");

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
    const id = req.user_id;

    if (!id || !isValidObjectId(id)) {
      return new BadResquestError(400, "Id is invalid").send(res);
    }

    const cacheUser = await CacheUserServices.getUser(
      CacheUserServices.KEY_USER + id
    );

    if (cacheUser && cacheUser._id) {
      return new GetResponse(200, cacheUser).send(res);
    }

    try {
      const user = await UserServices.getUser(id, {
        name: 1,
        email: 1,
        avartar: 1,
      });

      if (!user) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      return new GetResponse(200, user).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getUserByEmail: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return new BadResquestError(400, "Email is required").send(res);
    }

    try {
      const users = await UserServices.getUserByEmail(email, {
        name: 1,
        email: 1,
        avartar: 1,
      });

      if (!users) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      return new GetResponse(200, users).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
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
          host: process.env.ADMIN_ENDPOINT,
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
    const { name, email, avartar } = req.body;
    if (!name || !email) {
      return new BadResquestError(400, "Data confirm email invalid").send(res);
    }

    try {
      const user = await UserServices.getUserByEmail(email);

      if (user) {
        return new BadResquestError(400, "Email is used").send(res);
      }

      const newUser = await UserServices.createUser({
        name,
        email,
        avartar,
        verify: true,
        role: ROLE.USER,
      });
      if (!newUser) {
        return new BadResquestError(400, "Create user failed").send(res);
      }

      const newCart = await CartServices.createCart(newUser._id);

      const key = crypto.randomUUID();
      const newApiKey = await ApiKeyServices.createApiKey(
        newUser._id,
        key,
        PERMISSION.USER
      );

      if (!newCart) {
        return new BadResquestError(400, "Create cart failed").send(res);
      }

      if (!newApiKey) {
        return new BadResquestError(400, "Create api key failed").send(res);
      }

      return new CreatedResponse(201, newUser).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  login: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return new BadResquestError(400, "Data login invalid").send(res);
    }

    const query = req.query;
    const select = getSelect(query);

    try {
      const user = await UserServices.getUserByEmail(email, select);

      if (!user) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      if (user.banned) {
        return new ForbiddenError(403, "User was banned").send(res);
      }

      const apiKey = await ApiKeyServices.getApiKeyByUserId(user._id, {
        key: 1,
        permission: 1,
      });

      if (!apiKey) {
        return new NotFoundError(404, "Not found api key");
      }

      // if (apiKey.permissions.includes("1111")) {
      //   return new ForbiddenError().send(res);
      // }

      const privateKey = crypto.randomUUID();
      const publicKey = crypto.randomUUID();

      if (!privateKey || !publicKey) {
        return new BadResquestError(400, "create private or public key failed");
      }

      const accessToken = generateToken(
        {
          id: convertObjectToString(user._id),
          role: user.role,
        },
        publicKey,
        process.env.ACCESS_TOKEN_LIFE
      );

      const refreshToken = generateToken(
        { id: convertObjectToString(user._id) },
        privateKey,
        process.env.REFRESH_TOKEN_LIFE
      );

      if (!accessToken || !refreshToken) {
        return new BadResquestError(
          400,
          "create private or public key failed"
        ).send(res);
      }

      const accessTokenDecode = verifyToken(accessToken, publicKey);
      const refreshTokenDecode = verifyToken(refreshToken, privateKey);

      const keyTokenUser = await KeyTokenServices.getKeyByUserId(user._id, {
        _id: 1,
        privateKey: 1,
        refreshToken: 1,
      });

      if (keyTokenUser) {
        const keyTokenUpdated = await KeyTokenServices.updateKeyToken(
          user._id,
          { privateKey, publicKey, refreshToken }
        );

        if (keyTokenUpdated.refreshTokenUseds.length > 5) {
          await keyTokenUpdated.updateOne({
            $set: { refreshTokenUseds: [keyTokenUser.refreshToken] },
          });
        } else {
          await keyTokenUpdated.updateOne({
            $addToSet: { refreshTokenUseds: keyTokenUser.refreshToken },
          });
        }

        // set cache user
        await CacheUserServices.setCacheUser(
          CacheUserServices.KEY_USER + user._id,
          {
            _id: user._id.toString(),
            name: user.name,
            avartar: user.avartar,
            email: user.email,
          }
        );

        await CacheUserServices.setExpriseUser(
          CacheUserServices.KEY_USER + user._id,
          refreshTokenDecode.exp,
          "GT"
        );

        return new GetResponse(200, {
          accessToken: {
            value: accessToken,
            exp: accessTokenDecode.exp,
          },
          publicKey,
          refreshToken: {
            value: refreshToken,
            exp: refreshTokenDecode.exp,
          },
          apiKey: apiKey.key,
        }).send(res);
      }

      const keyToken = await KeyTokenServices.createKeyToken(
        user._id,
        privateKey,
        publicKey,
        refreshToken
      );

      if (!keyToken) {
        return new BadResquestError(400, "Create key token failed").send(res);
      }

      // set cache user
      await CacheUserServices.setCacheUser(
        CacheUserServices.KEY_USER + user._id,
        {
          _id: user._id.toString(),
          name: user.name,
          avartar: user.avartar,
          email: user.email,
        }
      );

      await CacheUserServices.setExpriseUser(
        CacheUserServices.KEY_USER + user._id,
        refreshTokenDecode.exp,
        "GT"
      );

      return new GetResponse(200, {
        accessToken: {
          value: accessToken,
          exp: accessTokenDecode.exp,
        },
        publicKey,
        refreshToken: {
          value: refreshToken,
          exp: refreshTokenDecode.exp,
        },
        apiKey: apiKey.key,
      }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  creatUserBeta: async (req, res) => {
    const { password, email } = req.body;

    if (!email || !password) {
      return new BadResquestError(400, "Data confirm email invalid").send(res);
    }

    try {
      const user = await UserServices.getUserByEmail(email);

      if (user) {
        return new BadResquestError(400, "Email is used").send(res);
      }
      const passwordHash = await generateBcrypt(password);
      const newUser = await UserServices.createUser({
        email,
        password: passwordHash,
        verify: true,
      });

      if (!newUser) {
        return new BadResquestError(400, "Create user failed").send(res);
      }

      const key = crypto.randomUUID();
      const newApiKey = await ApiKeyServices.createApiKey(
        newUser._id,
        key,
        "1111"
      );

      if (!newApiKey) {
        return new BadResquestError(400, "Create api key failed").send(res);
      }

      const newCart = await CartServices.createCart(newUser._id);

      if (!newCart) {
        return new BadResquestError(400, "Create cart failed").send(res);
      }

      return new CreatedResponse(201, {
        email: newUser.email,
        avartar: newUser.avartar,
        _id: newUser._id,
      }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  loginBeta: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return new BadResquestError(400, "Data login invalid").send(res);
    }

    const query = req.query;
    const select = getSelect(query);

    try {
      const user = await UserServices.getUserByEmail(email, select);
      if (!user) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      if (user.banned) {
        return new ForbiddenError(403, "User was banned").send(res);
      }

      const paswordCompare = await checkBcrypt(password, user.password);

      if (!paswordCompare) {
        return new UnauthorizedError().send(res);
      }

      return new GetResponse(200, {
        email: user.email,
        avartar: user.avartar,
        _id: user._id,
      }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    if (!id || !payload) {
      return new BadResquestError().send(res);
    }

    try {
      const user = await UserServices.updateUser(id, payload);

      if (!user) {
        return new BadResquestError(400, "Update user failed").send(res);
      }

      // update cache user
      await CacheUserServices.setCacheUser(
        CacheUserServices.KEY_USER + user._id,
        {
          _id: user._id.toString(),
          name: user.name,
          avartar: user.avartar,
          email: user.email,
        }
      );

      return new CreatedResponse().send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  refreshToken: async (req, res) => {
    const refreshTokenHeader = req.header("refresh-token");
    if (!refreshTokenHeader) {
      return new UnauthorizedError().send(res);
    }

    const refreshToken = refreshTokenHeader.split(" ")[1];

    try {
      const keyToken = await KeyTokenServices.getRefeshToken(refreshToken, {
        user: 1,
        privateKey: 1,
        publicKey: 1,
      });

      if (!keyToken) {
        return new NotFoundError(404, "Not found key token").send(res);
      }

      const user = await UserServices.getUser(keyToken.user);

      if (!user) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      const checkRefreshTokenUsed = await keyTokenServices.checkTokenUsed(
        keyToken.user,
        refreshToken
      );

      if (checkRefreshTokenUsed) {
        await KeyTokenServices.deleteToken(keyToken.user);
        return new BadResquestError(400, "Refresh token used").send(res);
      }

      const decoded = verifyToken(refreshToken, keyToken.privateKey);

      if (decoded.message) {
        return new UnauthorizedError(401, decoded.message).send(res);
      }

      const newAccessToken = generateToken(
        { id: convertObjectToString(user._id), role: user.role },
        keyToken.publicKey,
        process.env.ACCESS_TOKEN_LIFE
      );

      if (!newAccessToken) {
        return new BadResquestError(400, "Create new access token failed").send(
          res
        );
      }

      return new GetResponse(200, { newAccessToken }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  sendConfirmChangePassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return new BadResquestError().send(res);
    }

    try {
      const user = await UserServices.getUserByEmail(email);

      if (!user) {
        return new NotFoundError(404, "Email not found").send(res);
      }

      const secretKey = crypto.randomUUID();
      const token = generateToken({ id: user._id }, secretKey, "1 day");

      keyTokenServices.updateKeyToken(user._id, {
        changePasswordKey: secretKey,
      });

      let mailContent = {
        to: email,
        subject: "Antran shop thông báo:",
        template: templateEmail.changePassword,
        context: {
          host: process.env.ADMIN_ENDPOINT,
          token,
          key: secretKey,
          email,
        },
      };

      handleSendMail(mailContent);

      return new CreatedResponse(201, req.body).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  checkChangePasswordKey: async (req, res) => {
    const { email, t_k: token, k_y: key } = req.query;
    if (!email || !token || !key) {
      return new BadResquestError().send(res);
    }
    try {
      const decoded = verifyToken(token, key);
      if (decoded.message) {
        return new BadResquestError(400, decoded.message).send(res);
      }

      const changePasswordKey = await KeyTokenServices.checkChangePasswordKey(
        decoded.id,
        key
      );

      if (!changePasswordKey) {
        return new BadResquestError(400).send(res);
      }

      return new GetResponse().send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  changePassword: async (req, res) => {
    const { email, token, key, password } = req.body;

    if (!email || !token || !key || !password) {
      return new BadResquestError().send(res);
    }

    try {
      const decoded = verifyToken(token, key);

      if (decoded.message) {
        return new BadResquestError(400, decoded.message).send(res);
      }

      const changePasswordKey = await KeyTokenServices.checkChangePasswordKey(
        decoded.id,
        key
      );

      if (!changePasswordKey) {
        return new BadResquestError(400).send(res);
      }

      const passwordHash = await generateBcrypt(password);

      const user = await UserServices.changePassword(decoded.id, passwordHash);

      if (!user) {
        return new BadResquestError().send(res);
      }

      keyTokenServices.updateKeyToken(user._id, {
        changePasswordKey: null,
      });

      return new CreatedResponse().send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  banUser: async (req, res) => {
    const { user_id } = req.body;

    try {
      const banned = await UserServices.banUser(user_id);

      if (!banned) {
        return new BadResquestError(400, "Ban user failed").send(res);
      }

      return new CreatedResponse(201, "Ban user success").send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  unbanUser: async (req, res) => {
    const { user_id } = req.body;

    try {
      const unban = await UserServices.unbanUser(user_id);

      if (!unban) {
        return new BadResquestError(400, "Unban user failed").send(res);
      }

      return new CreatedResponse(201, "Unban user success").send(res);
    } catch (error) {
      return new InternalServerError().send(res);
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
