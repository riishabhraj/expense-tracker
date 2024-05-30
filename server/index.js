import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import transactionRoute from "./routes/transaction.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use("/api/", transactionRoute);

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
