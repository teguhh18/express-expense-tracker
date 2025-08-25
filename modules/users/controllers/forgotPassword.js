const mongoose = require("mongoose");
const emailManager = require("../../../managers/emailManager");


const forgotPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email } = req.body;

  if (!email) throw "Email is required";

  const getUser = await usersModel.findOne({ email: email });
  if (!getUser) throw "User not found";

  const resetCode = Math.floor(100000 + Math.random() * 900000);

  await usersModel.updateOne(
    { email: email },
    { reset_code: resetCode },
    {
      runValidators: true,
    }
  );

// (to, subject, text)
    await emailManager(email, "Reset Password-Expense", "Your password reset code is: " + resetCode);

  res.status(200).json({
    status: "Reset code sent to email successfully",
  });
};

module.exports = forgotPassword;
