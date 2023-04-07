const { User } = require("../../models/index");

const UserMiddleware = {
  check: async (req, res, next) => {
    const { name, password, email } = req.body;
    const format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // check valid user name
    if (name.match(format)) {
      res.status(200).json({
        status: 200,
        message: "User name must be A -> Z and 0 -> 9",
      });
      return;
    }

    // check valid email
    if (email.match(validRegex)) {
      res.json({ status: 200, message: "Email is invalid" });
      return;
    }

    // check valid password
    if (password.match(format)) {
      res.status(200).json({
        status: 200,
        message: "Password must be A -> Z and 0 -> 9",
      });
      return;
    }

    try {
      // check user name exited
      const exitUserName = await User.findOne({ name });
      if (exitUserName) {
        res.status(200).json({
          status: 200,
          message: "User name is used",
        });
        return;
      }

      // check password
      if (password.length < 6) {
        res.status(200).json({
          status: 200,
          message: "Password must be than 6 characters",
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = UserMiddleware;
