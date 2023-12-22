const mongoose = require("mongoose");
const config = require("../configs/config.DB");
mongoose.set("strictQuery", true);

// const connectString = config.url;

const connectString = `${config.host}:${config.port}/${config.name}`;
async function connect() {
  try {
    await mongoose.connect(connectString);
    console.log("connected database succesfully");
  } catch (error) {
    console.log(error, "connect database false");
  }
}

module.exports = { connect };