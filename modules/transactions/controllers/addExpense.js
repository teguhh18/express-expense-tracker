const mongoose = require("mongoose");
const validator = require("validator");

const addExpense = async (req, res) => {
    const userModels = mongoose.model("users");
    const transactionModels = mongoose.model("transactions");

    const {amount, remarks} = req.body;

    // VALIDATION
    if(!amount) throw "Amount is required";
    if(!remarks) throw "Remarks are required";
    if(remarks.length < 5) throw "Remarks must be at least 5 characters long";

    if(!validator.isNumeric(amount.toString())) throw "Amount must be a number";

    if(amount < 0) throw "Amount must not be negative";

    await transactionModels.create({
        user_id: req.user._id,
        amount:amount,
        remarks:remarks,
        transaction_type: "expense"
    });

    await userModels.updateOne({
        _id: req.user._id
    },{
        $inc: { balance: amount * -1 }
    },{
        runValidators: true
    })

    res.status(200).json({
        status: "success",
        message: "Expense added successfully",
    });
}

module.exports = addExpense;