import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
  income: 0,
  expense: 0,
  balance: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setTransactions(state, action) {
      state.transactions = action.payload;
      state.income = 0;
      state.expense = 0;
      state.balance = 0;
      action.payload.forEach((transaction) => {
        if (transaction.amount > 0) {
          state.income += transaction.amount;
        } else {
          state.expense += Math.abs(transaction.amount);
        }
        state.balance += transaction.amount;
      });
    },
    addTransaction(state, action) {
      state.transactions.push(action.payload);
      if (action.payload.amount > 0) {
        state.income += action.payload.amount;
      } else {
        state.expense += Math.abs(action.payload.amount);
      }
      state.balance += action.payload.amount;
    },
    removeTransaction(state, action) {
      const id = action.payload;
      const index = state.transactions.findIndex(
        (transaction) => transaction._id === id
      );

      if (index !== -1) {
        const deletedTransaction = state.transactions[index];
        state.balance -= deletedTransaction.amount;

        if (deletedTransaction.amount > 0) {
          state.income -= deletedTransaction.amount;
        } else {
          state.expense -= Math.abs(deletedTransaction.amount);
        }

        state.transactions.splice(index, 1);
      }
    },
  },
});

export const { setTransactions, addTransaction, removeTransaction } = userSlice.actions;

export default userSlice.reducer;
