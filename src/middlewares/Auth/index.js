const {
  BadResquestError,
  UnauthorizedError,
  ForbiddenError,
} = require("../../helpers/errorResponse");
const { verifyToken } = require("../../helpers/jwt");
const { KeyTokenServices, ApiKeyServices } = require("../../services");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "Authorization",
  PUBLIC_KEY: "public-key",
};

const UserMiddleware = {
  checkValidEmail: async (req, res, next) => {
    const { email } = req.body;
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)/;

    if (!email) {
      return new BadResquestError(400, "Invalid email").send(res);
    }

    // check valid email
    if (!validRegex.test(email)) {
      return new BadResquestError(400, "Email is invalid").send(res);
    }
    next();
  },
  checkValidPassword: async (req, res, next) => {
    const { password } = req.body;
    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!password) {
      return new BadResquestError(400, "Invalid password").send(res);
    }

    // check valid password
    if (format.test(password)) {
      return new BadResquestError(
        400,
        "Password name must be A -> Z and 0 -> 9"
      ).send(res);
    }

    if (password.length < 6) {
      return new BadResquestError(
        400,
        "Password must be than 6 characters"
      ).send(res);
    }
    next();
  },
  checkValidName: async (req, res, next) => {
    const { name } = req.body;
    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!name) {
      return new BadResquestError(400, "Invalid name").send(res);
    }

    // check valid user name
    if (format.test(name)) {
      return new BadResquestError(
        400,
        "User name must be A -> Z and 0 -> 9"
      ).send(res);
    }

    next();
  },
  authentication: async (req, res, next) => {
    const tokenHeader = req.header(HEADER.AUTHORIZATION);
    const publicKeyHeader = req.header(HEADER.PUBLIC_KEY);
    if (!tokenHeader || !publicKeyHeader) {
      return new UnauthorizedError().send(res);
    }

    const accessToken = tokenHeader.split(" ")[1];
    const publicKey = publicKeyHeader.split(" ")[1];

    const decoded = verifyToken(accessToken, publicKey);
    if (decoded.message) {
      return new BadResquestError(400, decoded.message).send(res);
    }

    const keyToken = await KeyTokenServices.getKeyByUserId(decoded.id);

    if (!keyToken) {
      return new UnauthorizedError().send(res);
    }

    req.user_id = keyToken.user;
    req.accessToken = accessToken;
    req.publicKey = publicKey;
    req.keyToken = keyToken;

    next();
  },
  authorization: (permission) => {
    return async (req, res, next) => {
      const keyToken = req.keyToken;
      const apiKeyHeader = req.header(HEADER.API_KEY);

      if (!apiKeyHeader) {
        return new ForbiddenError().send(res);
      }

      const key = apiKeyHeader.split(" ")[1];
      const apikey = await ApiKeyServices.getApiKey(key);

      if (!apikey || apikey.user_id.toString() !== keyToken.user.toString()) {
        return new ForbiddenError().send(res);
      }

      if (!apikey.permissions.includes(permission)) {
        return new ForbiddenError().send(res);
      }

      req.apiKey = apikey;

      next();
    };
  },
};

module.exports = UserMiddleware;
