const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");

//@desc     Register users
//@route    POST /api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please add all fields");
  }

  //check if user exists
  const userExists = await Users.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await Users.create({ name, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
//@desc     Auth users
//@route    POST /api/login
//@access   Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check for user email
  const user = await Users.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});
//@desc     Get user data
//@route    GET /api/users/me
//@access   private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await Users.findById(req.user.id);

  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

//generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
