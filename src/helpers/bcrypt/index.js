const bcrypt = require("bcrypt");

const checkBcrypt = async (password, hashPassword) => {
  const isAuth = await bcrypt
    .compare(password, hashPassword)
    .then(function (result) {
      return result;
    });
  return isAuth;
};

module.exports = { checkBcrypt };
