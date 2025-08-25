const mongoose = require("mongoose");
const validator = require("validator");

const editTransaction = async (req, res) => {
  const transactionModels = mongoose.model("transactions");

  const { transaction_id, remarks } = req.body;

  if (!transaction_id) throw "Transaction ID is required";
  if (!validator.isMongoId(transaction_id.toString()))
    throw "Invalid transaction ID";

  const getTransaction = await transactionModels.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw "Transaction not found";

  await transactionModels.updateOne({
    _id: transaction_id,
  },{
    remarks
  },{
    runValidators: true
  })

  res.status(200).json({
    status: "success",
    message: "Transaction updated successfully",
  });
};

module.exports = editTransaction;
