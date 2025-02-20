const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    minLength: [3, "Name must be at least 3 characters long."],
    required: true,
  },

  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    minLength: [3, "Username must be at least 3 characters long."],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be at least 6 characters long."],
    select: false,
    set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
  },
});

const User = model("User", userSchema);

module.exports = User;
