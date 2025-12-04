const userModel = require("../models/userModel");
const Joi = require("joi"); // 1. Import Joi
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

const validateUser = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).required().messages({
      "string.min": "Full name must be at least 3 characters long",
      "any.required": "Full name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
    }),
  });

  return schema.validate(data);
};

module.exports.registeredUsers = async function (req, res) {
  try {
    let { email, password, fullName } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user)
      return res.status(401).send("You already ave an account,please login!");

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            password: hash,
            fullName,
          });
          let token = generateToken(user);
          res.cookie("token", token);
          res.send("User created successfully");
        }
      });
    });
    const { error } = validateUser({ email, password, fullName });

    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // changed to 201 for "Created"
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });
  if (!user) return res.status(500).send("Email or Password is incorrecr");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      res.send("You can login");
    }else{
      return res.status(500).send("Email or Password is incorrect");
    }
  });
};

module.exports.logoutUser = function (req, res) {
  res.clearCookie("token");
  res.send("You have been logged out");
};
