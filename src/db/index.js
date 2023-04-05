const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connected database succesfully");
  } catch (error) {
    console.log(error, "connect database false");
  }
}

module.exports = { connect };