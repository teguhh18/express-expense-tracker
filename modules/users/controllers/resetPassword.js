const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailManager = require("../../../managers/emailManager");

const resetPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, reset_code, new_password } = req.body;

  if (!email) throw "Email is required";
  if (!reset_code) throw "Reset code is required";
  if (!new_password) throw "New password is required";
  if (new_password.length < 6)
    throw "New password must be at least 6 characters long";

  const getUserWithResetCode = await usersModel.findOne({
    email: email,
    reset_code: reset_code,
  });

  if (!getUserWithResetCode) throw "Reset code does not match";

  await usersModel.updateOne(
    { email: email, reset_code: reset_code },
    { password: await bcrypt.hash(new_password, 10), reset_code: null },
    { runValidators: true }
  );

  await emailManager(email, "Reset Password-Expense", "Your password has been reset successfully. If you have not done this, please contact support.");
  
  res.status(200).json({
    status: "success",
    message: "Reset password successfully",
  });
};

module.exports = resetPassword;
