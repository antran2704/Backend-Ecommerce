const { User } = require("../../models/index");

const UserMiddleware = {
  checkValidData: async (req, res, next) => {
    const { name, password, email } = req.body;
    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)/;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Invalid data",
      });
    }
    // check valid user name
    if (format.test(name)) {
      return res.status(200).json({
        status: 200,
        message: "User name must be A -> Z and 0 -> 9",
      });
    }

    // check valid email
    if (!validRegex.test(email)) {
      return res.json({ status: 200, message: "Email is invalid" });
    }

    // check valid password
    if (format.test(password)) {
      return res.status(200).json({
        status: 200,
        message: "Password must be A -> Z and 0 -> 9",
      });
    }

    try {
      // check user name exited
      const exitUserName = await User.findOne({ name });
      if (exitUserName) {
        return res.status(200).json({
          status: 200,
          message: "User name is used",
        });
      }

      // check password
      if (password.length < 6) {
        return res.status(200).json({
          status: 200,
          message: "Password must be than 6 characters",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = UserMiddleware;
