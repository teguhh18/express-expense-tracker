const mongoose = require("mongoose");
const validator = require("validator");

const deleteTransaction = async (req, res) => {
  const transactionModels = mongoose.model("transactions");
  const usersModel = mongoose.model("users");
//   console.log("param", req.params);

  const { transaction_id } = req.params;
  if (!validator.isMongoId(transaction_id.toString()))
    throw "Invalid transaction ID";

  const getTransaction = await transactionModels.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw "Transaction not found";

  if (getTransaction.transaction_type === "income") {
    await usersModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount * -1,
        },
      },
      {
        runValidators: true,
      }
    );
  } else {
    await usersModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount,
        },
      },
      {
        runValidators: true,
      }
    );
  }

    await transactionModels.deleteOne({
      _id: transaction_id
    });

  res.status(200).json({
    status: "success",
    message: "Transaction deleted successfully",
  });
};

module.exports = deleteTransaction;
