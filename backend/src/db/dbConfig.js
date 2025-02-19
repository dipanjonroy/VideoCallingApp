const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB is connected."))
    .catch((err) => console.log(err));
};

module.exports = connectToDB;
