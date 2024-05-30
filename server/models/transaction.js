import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  amount: {
    type: Number,
    // required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
