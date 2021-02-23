const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const cloudinary = require("cloudinary");

require("dotenv/config");

// middleware to parse json response from frontend
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
// * sometype of http request get, post etc
app.options("*", cors);

/*---------------------------------
              SECURITY
--------------------------------- */

// Server secured based on token
// all requests will be asked auth token
app.use(authJwt());

// handle error in the server
app.use(errorHandler);

/*---------------------------------
              ROUTES
--------------------------------- */
const usersRoutes = require("./routes/users");
const agentRoutes = require("./routes/agencies");

/*---------------------------------
              ROUTER
--------------------------------- */
const api = process.env.API_URL;
app.use(`/users`, usersRoutes);
app.use(`/agencies`, agentRoutes);

/*---------------------------------
       MONGOOSE CONNECTION
--------------------------------- */
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
app.listen(3000, () => {
  console.log(api);
  console.log("Server is running on 3000");
});
