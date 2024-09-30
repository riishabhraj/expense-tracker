import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransactions,
  addTransaction,
  removeTransaction,
} from "./redux/userSlice";
import { RxCross2 } from "react-icons/rx";s
import { AiOutlinePlus } from "react-icons/ai";

const formatNumber = (number) => {
  return parseFloat(number.toFixed(2)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });
};

const App = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const { transactions, income, expense, balance } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    dispatch(setTransactions(storedTransactions));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { title, amount: parseFloat(amount), _id: Date.now() };
    dispatch(addTransaction(data));

    const updatedTransactions = [...transactions, data];
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    setTitle("");
    setAmount("");
  };

  const handleDelete = (id) => {
    dispatch(removeTransaction(id));
    const updatedTransactions = transactions.filter(transaction => transaction._id !== id);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?money,business')" }}>
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Expense Tracker</h1>
        <h2 className="text-xl font-semibold text-gray-700">Your Balance</h2>
        <p className={`text-3xl font-bold ${balance > 0 ? "text-green-600" : "text-red-600"}`}>
          ${formatNumber(balance)}
        </p>

        <div className="flex justify-between py-4 border-b mb-4">
          <div className="flex-1 text-center">
            <h3 className="font-semibold text-gray-600">INCOME</h3>
            <p className="text-green-600 text-xl font-bold">${formatNumber(income)}</p>
          </div>
          <div className="flex-1 text-center">
            <h3 className="font-semibold text-gray-600">EXPENSE</h3>
            <p className="text-red-600 text-xl font-bold">${formatNumber(expense)}</p>
          </div>
        </div>

        <div className="mt-4">
          {transactions.length > 0 ? (
            <h2 className="font-semibold text-lg">Transactions</h2>
          ) : (
            <h2 className="font-semibold text-lg">No Transactions</h2>
          )}
          <div className="flex flex-col gap-3 mt-2">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className={`flex justify-between items-center p-3 rounded-lg shadow-md ${
                  transaction.amount > 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <p className="font-semibold">{transaction.title}</p>
                <div className="flex items-center">
                  <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatNumber(transaction.amount)}
                  </p>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="ml-3 text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <RxCross2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <h2 className="font-semibold text-lg">Add New Transaction</h2>
          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="title" className="font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              id="title"
              placeholder="Enter title..."
              required
            />
            <label htmlFor="amount" className="font-medium">Amount</label>
            <p>(negative - expense, positive - income)</p>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              type="number"
              id="amount"
              placeholder="Enter amount..."
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <AiOutlinePlus size={20} className="mr-2" />
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;