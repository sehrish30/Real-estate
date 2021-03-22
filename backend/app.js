const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

const http = require("http");

require("dotenv/config");

/*---------------------------------
              Web socket
--------------------------------- */
const SocketServer = require("./socket/index.js");

// middleware to parse json response from frontend
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
// * sometype of http request get, post etc ok
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
const propertyRoutes = require("./routes/properties");
const chatsRoutes = require("./routes/chats");

/*---------------------------------
              ROUTER
--------------------------------- */
app.use(`/users`, usersRoutes);
app.use(`/agencies`, agentRoutes);
app.use(`/properties`, propertyRoutes);
app.use(`/chats`, chatsRoutes);

/*---------------------------------
       MONGOOSE CONNECTION
--------------------------------- */
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Real-Estate",
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connection ready...");
  })
  .catch((err) => console.log(err));

// production
var server = app.listen(process.env.PORT || 3000, () => {
  SocketServer(server);
  var port = server.address().port;
  console.log(`Port is ${port}`);
});

// const serverr = http.createServer(app);
// SocketServer(serverr);
// let port = 3002;
// serverr.listen(port, () => {
//   console.log(`Sever listening on ${port}`);
// });
