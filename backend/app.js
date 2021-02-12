const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config");

// middleware to parse json response from frontend
app.use(bodyParser.json());
app.use(morgan("tiny"));

const api = process.env.API_URL;

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Real-Estate",
  })
  .then(() => {
    console.log("Database connection ready...");
  })
  .catch((err) => console.log(err));

// webserver listen to port
app.listen(3001, () => {
  console.log(api);
  console.log("Server is running on 3000");
});
