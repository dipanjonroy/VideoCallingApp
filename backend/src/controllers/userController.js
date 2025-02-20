const User = require("../models/userModel");
const ExpressError = require("../utilities/ExpressError");

module.exports.userRegister = async(req,res)=>{
  const {name,username, email, password} = req.body;

  const isUser = await User.exists({username:username});
  if(isUser){
    throw new ExpressError(401, "Username is already taken.")
  }

  const existEmail = await User.exists({email:email});
  if(existEmail){
    throw new ExpressError(401, "Email is already taken.")
  }

const formData = {name,username,email,password};

const newUser = await User.create(formData)

  res.status(201).json({
    success: true,
    message: "Registration is successfull.",
    newUser
  })
}