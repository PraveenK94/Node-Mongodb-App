const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    console.log("MongoDb connected..");
  } catch (err) {
    console.error(err.message);
  }
};



module.exports = connDB;
