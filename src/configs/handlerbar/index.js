const path = require("path");

const configHbs = {
  extname: ".hbs",
  partialsDir: [path.resolve(__dirname, "../../views/partials")],
};

module.exports = configHbs;
