const bcrypt = require("bcrypt");

const generateBcrypt = async (password) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt
    .hash(password, saltRounds)
    .then(function (hash) {
      return hash;
    });
  return passwordHash;
};

const checkBcrypt = async (password, hashPassword) => {
  const isAuth = await bcrypt
    .compare(password, hashPassword)
    .then(function (result) {
      return result;
    });
  return isAuth;
};

module.exports = { checkBcrypt, generateBcrypt };
