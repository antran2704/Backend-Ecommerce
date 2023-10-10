const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv");
const { engine } = require("express-handlebars");
const { default: helmet } = require("helmet");
const compression = require("compression");

const routes = require("./src/routes");
const configHbs = require("./src/configs/handlerbar");
const db = require("./src/db/index");

// database
db.connect();

// middleware
env.config();
app.use(cors());
app.use(helmet());
app.use(compression());

app.engine("hbs", engine(configHbs));
app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// routes
routes(app);

module.exports = app;