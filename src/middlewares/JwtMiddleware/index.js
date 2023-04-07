const { verifyToken } = require("../../helpers/jwt");

const JwtMiddleware = {
  checkToken: async (req, res, next) => {
    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];
    const secretKey = process.env.PRIVATE_JWT_ID;

    if (!token) {
      res.status(400).json({
        status: 400,
        message: "Invalid token",
      });
      return;
    }
    
    const decoded = verifyToken(token, secretKey);

    if (decoded.message === "jwt expired") {
      res.status(400).json({
        status: 400,
        message: "jwt expired",
      });
      return;
    }
    if (decoded.name === "JsonWebTokenError") {
      res.status(400).json({
        status: 400,
        message: "invalid token",
      });
      return;
    }

    next();
  },
  checkTokenMail: async (req, res, next) => {
    const authorization = req.header("Mail");
    const token = authorization.split(" ")[1];
    const secretKey = process.env.PRIVATE_JWT_EMAIL;

    if (!token) {
      res.status(400).json({
        status: 400,
        message: "Invalid token",
      });
      return;
    }

    const decoded = verifyToken(token, secretKey);

    if (decoded.message === "jwt expired") {
      res.status(400).json({
        status: 400,
        message: "jwt expired",
      });
      return;
    }
    if (decoded.name === "JsonWebTokenError") {
      res.status(400).json({
        status: 400,
        message: "invalid token",
      });
      return;
    }

    next();
  },
};

module.exports = JwtMiddleware;
