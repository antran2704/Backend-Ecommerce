const express = require("express");
const path = require("path");
const cors = require("cors");
const env = require("dotenv");
const { engine } = require("express-handlebars");
const app = express();

const routes = require("./src/routes");
const configHbs = require("./src/configs/handlerbar");
const db = require("./src/db/index");
const port = 3001;

env.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("hbs", engine(configHbs));
app.set("view engine", "hbs");
app.set("views", "./src/views");

db.connect();
routes(app);
app.listen(port, () => {
  console.log(`app listen on ${port}`);
});
