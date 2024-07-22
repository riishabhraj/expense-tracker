import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransactions,
  addTransaction,
  removeTransaction,
} from "./redux/userSlice";
import { RxCross2 } from "react-icons/rx";

const formatNumber = (number) => {
  return parseFloat(number.toFixed(2)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });
};

//Backend URL 
const URL = "http://localhost:3000";

const App = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const { transactions, income, expense, balance } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const res = await fetch(`${URL}/api/transactions`);
        const data = await res.json();
        dispatch(setTransactions(data));
      } catch (error) {
        console.log(error.message);
      }
    };
    getTransactions();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, amount: parseFloat(amount) };
    try {
      const res = await fetch(`${URL}/api/maketransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const newTransaction = await res.json(); // Assuming the API returns the created transaction with _id
      dispatch(addTransaction(data)); // Dispatching action with the returned transaction
    } catch (error) {
      console.log(error.message);
    }
    setTitle("");
    setAmount("");
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${URL}/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        dispatch(removeTransaction(id));
      } else {
        throw new Error("Failed to delete transaction");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto sm:my-10 flex flex-col justify-center p-5 sm:border-2 rounded-lg">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl sm:text-3xl mb-3 sm:mb-5 font-semibold">
          Expense Tracker
        </h1>
      </div>
      <h1 className="font-semibold text-lg sm:text-2xl">Your Balance</h1>
      <p
        className={`text-lg sm:text-2xl ${
          balance > 0 ? "text-green-500" : "text-red-500"
        } font-semibold`}
      >
        ${formatNumber(balance)}
      </p>
      <div className="flex justify-between py-2 sm:py-4 border my-2 sm:my-5 shadow-md">
        <div className="flex-1 text-center border-r-2">
          <div className="font-semibold text-sm sm:text-xl">INCOME</div>
          <p className="text-green-500 font-semibold text-lg sm:text-2xl">
            ${formatNumber(income)}
          </p>
        </div>
        <div className="flex-1 text-center">
          <div className="font-semibold text-sm sm:text-xl">EXPENSE</div>
          <p className="text-red-500 font-semibold text-lg sm:text-2xl">
            ${formatNumber(expense)}
          </p>
        </div>
      </div>

      <div className="mt-3">
        {transactions.length > 0 ? (
          <h1 className="font-semibold text-lg sm:text-xl">Transactions</h1>
        ) : (
          <h1 className="font-semibold text-xl">No Transactions</h1>
        )}
        <div className="flex flex-col gap-2 mt-2">
          {transactions.map((transaction, index) => (
            <div
              key={transaction._id || index}
              className={`shadow-md border-2 ${
                transaction.amount > 0 ? "shadow-green-500" : "shadow-red-500"
              } flex justify-between font-semibold sm:text-lg`}
            >
              <p className="p-2 sm:p-3">{transaction.title}</p>
              <div className="flex gap-3">
                <p className="py-2 sm:py-3">
                  {formatNumber(transaction.amount)}
                </p>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  className="transition ease-in-out bg-red-500 duration-300 border-l px-2 sm:px-3 hover:bg-red-300 transition-colors-2s font-bold"
                >
                  <RxCross2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col mt-5 sm:mt-7 gap-3 sm:gap-5"
      >
        <h1 className="font-semibold text-lg sm:text-xl">
          Add New Transaction
        </h1>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="title">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 py-1 sm:p-2 border rounded-lg"
            type="text"
            id="title"
            placeholder="Enter the title here..."
          />
          <div>
            <label htmlFor="amount">Amount</label>
            <p>(negative - expense, positive - income)</p>
          </div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-2 py-1 sm:p-2 border rounded-lg"
            type="number"
            id="amount"
            placeholder="Enter the amount here..."
          />
        </div>
        <button
          type="submit"
          className="p-1 border rounded-lg bg-blue-600 text-white hover:opacity-95 mb-2 "
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default App;
