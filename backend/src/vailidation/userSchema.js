const joi = require("joi");

module.exports.userSchema = joi.object({
  name: joi.string().min(3).required().trim().messages({
    "any.required": "Name is required",
    "string.min": "Name must be at least 3 characters long.",
  }),

  username: joi.string().trim().min(3).required().messages({
    "any.required": "Username is required.",
    "string.min": "Username must be at least 3 characters long.",
  }),

  email: joi.string().email().trim().required().messages({
    "any.required": "Email is required.",
    "string.email": "Please provide a valid email.",
  }),

  password: joi
    .string()
    .min(6)
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{3,30}$"
      )
    )
    .messages({
      "any.required": "Password is required.",
      "string.min": "password must be at least 6 characters long.",
      "string.pattern.base":
        "Password must contain at least one letter, one number, and one special character.",
    }),
});
