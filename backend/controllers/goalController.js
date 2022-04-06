const asyncHandler = require("express-async-handler");

const Goals = require("../models/goalModel");
const User = require("../models/userModel");

//@desc     Get Goals
//@route    GET /api/goals
//@access   Private
const getGoals = asyncHandler(async (req, res) => {
  const goal = await Goals.find({ user: req.user.id });

  res.status(200).json(goal);
});
//@desc     Set Goal
//@route    POST /api/goals
//@access   Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const goal = await Goals.create({ text: req.body.text, user: req.user.id });

  res.status(200).json(goal);
});
//@desc     Update Goals
//@route    PUT /api/goals/:id
//@access   Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goals.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  const user = await User.findById(req.user.id);
  //check for user
  if (!user) {
    res.status(401);
    throw new Error("user not found");
  }
  //make sure the logged in user matches the goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }

  const updatedGoal = await Goals.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});
//@desc     Delete Goals
//@route    DELETE /api/goals/:id
//@access   Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goals.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  const user = await User.findById(req.user.id);
  //check for user
  if (!user) {
    res.status(401);
    throw new Error("user not found");
  }
  //make sure the logged in user matches the goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }
  const deltedGoal = await Goals.findByIdAndDelete(req.params.id);
  res.status(200).json(deltedGoal);
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
