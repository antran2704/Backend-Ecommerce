const jwt = require("jsonwebtoken");

const generateToken = (payload, secretKey, tokenLife) => {
  const token = jwt(payload, secretKey, { expiresIn: tokenLife });
  return token;
};

const verifyToken = async (token, secretKey) => {
  const decoded = jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return error;
    }
    return decoded;
  });

  return decoded;
};

module.exports = { generateToken, verifyToken };
