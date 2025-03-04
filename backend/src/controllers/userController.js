const User = require("../models/userModel");
const ExpressError = require("../utilities/ExpressError");
const bcrypt = require("bcrypt");
const createSecretToken = require("../utilities/jsonwebtoken");

//User register controller
module.exports.userRegister = async (req, res) => {
  const { name, username, email, password } = req.body;

  const isUser = await User.exists({ username: username });
  if (isUser) {
    throw new ExpressError(401, "Username is already taken.");
  }

  const existEmail = await User.exists({ email: email });
  if (existEmail) {
    throw new ExpressError(401, "Email is already taken.");
  }

  const formData = { name, username, email, password };

  const newUser = await User.create(formData);

  res.status(201).json({
    success: true,
    message: "Registration is successfull.",
    newUser,
  });
};

//User login controller
module.exports.userLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new ExpressError(401, "Invalid username or password");
  }

  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) {
    throw new ExpressError(401, "Invalid username or password");
  }

  const userId = user._id;

  const accessToken = createSecretToken(
    { userId },
    process.env.JWT_ACCESS_KEY,
    "10m"
  );

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 10,
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
  });

  res.status(201).json({
    success: true,
    message: "Log in successfully.",
  });
};

//user profile
module.exports.profile = async (req, res) => {
  const userId = req.user;

  const user = await User.findById(userId);

  if (!user) {
    throw new ExpressError(401, "User is not existed");
  }

  const userData = {
    name: user.name,
    email: user.email,
  };

  res.status(209).json({
    success: true,
    user: userData,
  });
};

module.exports.logOut = async(req,res)=>{
  res.clearCookie("accessToken")

   res.status(209).json({
    success: true,
    message: "Logged out successfully",
  });
}
