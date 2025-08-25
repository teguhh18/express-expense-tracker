const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");
const emailManager = require("../../../managers/emailManager");

const register = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { name, email, password, confirm_password, balance } = req.body;

  const getDuplicateEmail = await usersModel.findOne({ email: email });

  // VALIDATION
  if (!name) throw "Name is required";
  if (!email) throw "Email is required";
  if (!password) throw "Password is required";
  if (!balance) throw "Balance is required";
  if (password.length < 6) throw "Password must be at least 6 characters long";
  if (getDuplicateEmail) throw "Email already exists";
  if (password !== confirm_password)
    throw "Password and Confirm Password do not match";
  if (typeof balance !== "number") throw "Balance must be a number";

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10),
    balance: balance,
  });

  const accessToken = jwtManager(createdUser);

  // (to, subject, text)
  await emailManager(
    createdUser.email,
    "Welcome to Expense Tracker App",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lorem turpis, commodo sit amet aliquam a, viverra vel leo. Duis tincidunt gravida libero, vel faucibus nunc ornare eget. Curabitur vitae dolor ullamcorper, semper massa at, malesuada purus. Sed mattis ligula ac nisl ornare, quis consequat neque ornare."
  );

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    accessToken: accessToken,
  });
};

module.exports = register;
