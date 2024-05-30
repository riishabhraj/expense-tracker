import express from "express";
import Transaction from "../models/transaction.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/maketransaction", async (req, res) => {
  try {
    const newTransaction = await Transaction.create(req.body);
    res.status(201).json({ message: "success", data: newTransaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
