const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const app = express();

const routes = require("./src/routes");
const db = require("./src/db/index");
const port = 3001;

env.config();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

db.connect();
routes(app);

app.listen(port, () => {
  console.log(`app listen on ${port}`);
});
