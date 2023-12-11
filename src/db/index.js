const mongoose = require("mongoose");
const config = require("../configs/config.DB");
mongoose.set("strictQuery", true);

const connectString = `${config.host}:${config.port}/${config.name}`;
// const connectString = config.url;`
async function connect() {
  try {
    await mongoose.connect(connectString);
    console.log("connected database succesfully");
  } catch (error) {
    console.log(error, "connect database false");
  }
}

module.exports = { connect };