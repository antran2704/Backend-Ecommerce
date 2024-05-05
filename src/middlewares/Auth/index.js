const {
  UnauthorizedError,
  ForbiddenError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const { verifyToken } = require("../../helpers/jwt");
const { KeyTokenServices, ApiKeyServices } = require("../../services");
const { HEADER } = require("./data");

const AuthenMiddleware = {
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
      return new UnauthorizedError(401, decoded.message).send(res);
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
  checkAuthorizationHeader: (req, res, next) => {
    const apiKeyHeader = req.header(HEADER.API_KEY);
    
    if (!apiKeyHeader) {
      return new BadResquestError().send(res);
    }

    next();
  },
};

module.exports = AuthenMiddleware;
