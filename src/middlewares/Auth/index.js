const {
  BadResquestError,
  UnauthorizedError,
} = require("../../helpers/errorResponse");
const { verifyToken } = require("../../helpers/jwt");

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
  Authentication: async (req, res, next) => {
    const tokenHeader = req.header("Authorization");
    const publicKeyHeader = req.header("public-key");
    if (!tokenHeader || !publicKeyHeader) {
      return new UnauthorizedError().send(res);
    }

    const accessToken = tokenHeader.split(" ")[1];
    const publicKey = publicKeyHeader.split(" ")[1];

    const decoded = verifyToken(accessToken, publicKey);
    if (decoded.message) {
      return new BadResquestError(400, decoded.message).send(res);
    }

    req.accessToken = accessToken;
    req.publicKey = publicKey;
    next();
  },
};

module.exports = UserMiddleware;
