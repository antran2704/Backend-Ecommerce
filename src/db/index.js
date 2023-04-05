const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function connect() {
  console.log(process.env.DATABASE_URL)
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connected database succesfully");
  } catch (error) {
    console.log(error, "connect database false");
  }
}

module.exports = { connect };