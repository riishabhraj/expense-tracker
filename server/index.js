import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import transactionRoute from "./routes/transaction.js";
import cors from "cors";
import path from "path";
const __dirname = path.resolve();
const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
});

app.use("/api/", transactionRoute);

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
