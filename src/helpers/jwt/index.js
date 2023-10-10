const jwt = require("jsonwebtoken");
const { BadResquestError } = require("../errorResponse");

const generateToken = (payload, secretKey, tokenLife) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: tokenLife });
  return token;
};

const verifyToken = (token, secretKey) => {
  const decoded = jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return error;
    }
    return decoded;
  });

  return decoded;
};

const checkDecoded = (decoded, res) => {
  if (decoded.message === "jwt expired") {
    return new BadResquestError(400, decoded.message).send(res);
  }

  if (decoded.message === "invalid token") {
    return new BadResquestError(400, decoded.message).send(res);
  }

  if (decoded.message === "invalid signature") {
    return new BadResquestError(400, decoded.message).send(res);
  }

  return decoded;
}

module.exports = { generateToken, verifyToken, checkDecoded };
