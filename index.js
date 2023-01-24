//import express
const express = require("express");

//create express object
const app = express();

//import mongoose
const mongoose = require("mongoose");

//import dotenv
const dotenv = require("dotenv");

//import routes
const router = require("./routes");

//configure dotenv
dotenv.config();

//connect to db
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Db connection failed:", err);
  });

//USe JSON
app.use(express.json());
app.use(router);

//listenting to port
app.listen(process.env.API_PORT, () => {
  console.log("API Running on port 3000");
});
