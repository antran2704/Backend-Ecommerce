const bcrypt = require("bcrypt");
const { User } = require("../../models/index");

const BcryptMiddleware = {
  checkBcrypt: async (req, res) => {
    const { password, email } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).status({
          status: 404,
          message: "User is not exit",
        });
        return;
      }

      const isAuth = await bcrypt
        .compare(password, user.password)
        .then(function (result) {
          return result;
        });

      if (!isAuth) {
        res.status(400).status({
          status: 400,
          message: "Password is incorrect",
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = BcryptMiddleware;
