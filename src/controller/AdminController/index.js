const { User } = require("../../models/index");
const {
  AdminServices,
  KeyTokenServices,
  CartServices,
  ApiKeyServices,
} = require("../../services");

const crypto = require("node:crypto");
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

const convertObjectToString = require("../../helpers/convertObjectString");
const keyTokenServices = require("../../services/KeyToken/keyToken.services");
const getSelect = require("../../helpers/getSelect");
const { isValidObjectId } = require("mongoose");

const AdminController = {
  // [GET] USERS
  getUsers: async (req, res) => {
    try {
      const users = await AdminServices.getUsers();

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

    try {
      const users = await AdminServices.getUser(id, {
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
  // [POST] CONFIRM EMAIL AND ADD USER
  creatUser: async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !email || !password) {
      return new BadResquestError(400, "Data confirm email invalid").send(res);
    }

    try {
      const user = await AdminServices.getUserByEmail(email);

      if (user) {
        return new BadResquestError(400, "Email is used").send(res);
      }
      const passwordHash = await generateBcrypt(password);
      const newUser = await AdminServices.createUser({
        name,
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
        "0000"
      );

      if (!newApiKey) {
        return new BadResquestError(400, "Create api key failed").send(res);
      }

      return new CreatedResponse(201, newUser).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return new BadResquestError(400, "Data login invalid").send(res);
    }

    const query = req.query;
    const select = getSelect(query);

    try {
      const user = await AdminServices.getUserByEmail(email, select);

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

      const apiKey = await ApiKeyServices.getApiKeyByUserId(user._id, {
        key: 1,
        permissions: 1,
      });

      if (!apiKey) {
        return new NotFoundError(404, "Not found api key");
      }

      if (!apiKey.permissions.includes("0000")) {
        return new ForbiddenError().send(res);
      }

      const privateKey = crypto.randomUUID();
      const publicKey = crypto.randomUUID();

      if (!privateKey || !publicKey) {
        return new BadResquestError(400, "create private or public key failed");
      }

      const accessToken = generateToken(
        { id: convertObjectToString(user._id) },
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

      const keyTokenUser = await KeyTokenServices.getKeyByUserId(user._id, {
        _id: 1,
        privateKey: 1,
        refreshToken: 1,
      });

      if (keyTokenUser) {
        const keyTokenUpdated = await KeyTokenServices.updateKeyToken(
          user._id,
          { privateKey, publicKey, refreshToken, apiKey }
        );
        await keyTokenUpdated.updateOne({
          $addToSet: { refreshTokenUseds: keyTokenUser.refreshToken },
        });

        return new GetResponse(200, {
          accessToken,
          publicKey,
          refreshToken,
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

      return new GetResponse(200, {
        accessToken,
        publicKey,
        refreshToken,
        apiKey: apiKey.key,
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
      const user = await AdminServices.updateUser(id, payload);

      if (!user) {
        return new BadResquestError(400, "Update user failed").send(res);
      }

      return new CreatedResponse().send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return new BadResquestError(400, "body data is required").send(res);
    }

    try {
      const keyToken = await KeyTokenServices.getRefeshToken(refreshToken, {
        user: 1,
        privateKey: 1,
        publicKey: 1,
      });

      if (!keyToken) {
        return new NotFoundError(404, "Not found key token").send(res);
      }

      const user = await AdminServices.getUser(keyToken.user);

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
        return new BadResquestError(400, decoded.message).send(res);
      }

      const newAccessToken = generateToken(
        { id: convertObjectToString(user._id) },
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
  changePassword: async (req, res) => {
    const { email, password, newPassword } = req.body;

    if (!email || !password || !newPassword) {
      return new BadResquestError().send(res);
    }

    try {
      const user = await AdminServices.getUserByEmail(email);

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

      const passwordHash = await generateBcrypt(newPassword);

      const updated = await AdminServices.changePassword(
        decoded.id,
        passwordHash
      );

      if (!updated) {
        return new BadResquestError().send(res);
      }

      return new CreatedResponse(updated).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  banUser: async (req, res) => {
    const { user_id } = req.body;

    try {
      const banned = await AdminServices.banUser(user_id);

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
      const unban = await AdminServices.unbanUser(user_id);

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

module.exports = AdminController;
