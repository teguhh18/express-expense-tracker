const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./modules/users/users.routes");
const transactionsRoutes = require("./modules/transactions/transactions.routes");

const app = express();
app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.mongo_connection, {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// MODEL
require("./models/user.model");
require("./models/transactions.model");

// ROUTE
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionsRoutes);
// END ROUTE

// 404
app.use((req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Not Found",
  });
});

// ERROR HANDLER
app.use((error, req, res, next) => {
  console.error("💥 AN ERROR OCCURRED:", error);
  if (error) {
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
});

module.exports = app;
