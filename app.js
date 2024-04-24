const { createServer } = require("node:http");
const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv");
const { engine } = require("express-handlebars");
const { default: helmet } = require("helmet");
const compression = require("compression");

// middleware
env.config();

if (process.env.NODE_ENV === "development") {
  env.config({ path: "./.env.development" });
} else {
  env.config({ path: "./.env.production" });
}
const server = createServer(app);

const routes = require("./src/routes");
const configHbs = require("./src/configs/handlerbar");
const db = require("./src/db/index");
const { SocketConfig } = require("./src/configs/socket");
const ReddisConnect = require("./src/configs/Reddis");

// database Mongo
db.connect();

const client = new ReddisConnect();
const redisConnection = client.getConnection();

app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());

app.engine("hbs", engine(configHbs));
app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const newConnection = new SocketConfig(server);
const socket = newConnection.getSocket();

socket.on("connection", newConnection.connection);
// redisConnection.exists()
global.socket = socket;
global.redisGlobal = redisConnection;

// routes
routes(app);

module.exports = server;
