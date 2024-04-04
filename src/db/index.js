const mongoose = require("mongoose");
const config = require("../configs/config.DB");
mongoose.set("strictQuery", true);

const connectString = process.env.NODE_ENV === "development" ? `${config.host}:${config.port}/${config.name}` : config.url;

async function connect() {
  try {
    await mongoose.connect(connectString);
    console.log("connected database succesfully");
  } catch (error) {
    console.log(error, "connect database false");
  }
}

module.exports = { connect };