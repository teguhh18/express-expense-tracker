const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { email, password } = req.body;
  const getUser = await usersModel.findOne({ email: email });

  //   VALIDATION
  if (!email) throw "Email is required";
  if (!password) throw "Password is required";
  if (!getUser) throw "User not found";
  if (!(await bcrypt.compare(password, getUser.password)))
    throw "Email and password do not match";

  const accessToken = jwtManager(getUser);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    accessToken: accessToken,
  });
};
module.exports = login;
