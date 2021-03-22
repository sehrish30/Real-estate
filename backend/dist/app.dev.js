"use strict";

var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var morgan = require("morgan");

var mongoose = require("mongoose");

var cors = require("cors");

var authJwt = require("./helpers/jwt");

var errorHandler = require("./helpers/error-handler");

var http = require("http");

require("dotenv/config");
/*---------------------------------
              Web socket
--------------------------------- */


var SocketServer = require("./socket/index.js"); // middleware to parse json response from frontend


app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors()); // * sometype of http request get, post etc ok

app.options("*", cors);
/*---------------------------------
              SECURITY
--------------------------------- */
// Server secured based on token
// all requests will be asked auth token

app.use(authJwt()); // handle error in the server

app.use(errorHandler);
/*---------------------------------
              ROUTES
--------------------------------- */

var usersRoutes = require("./routes/users");

var agentRoutes = require("./routes/agencies");

var propertyRoutes = require("./routes/properties");

var chatsRoutes = require("./routes/chats");
/*---------------------------------
              ROUTER
--------------------------------- */


app.use("/users", usersRoutes);
app.use("/agencies", agentRoutes);
app.use("/properties", propertyRoutes);
app.use("/chats", chatsRoutes);
/*---------------------------------
       MONGOOSE CONNECTION
--------------------------------- */

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "Real-Estate",
  useCreateIndex: true,
  useFindAndModify: false
}).then(function () {
  console.log("Database connection ready...");
})["catch"](function (err) {
  return console.log(err);
}); // production

var server = app.listen(process.env.PORT || 3000, function () {
  SocketServer(server);
  var port = server.address().port;
  console.log("Port is ".concat(port));
}); // const serverr = http.createServer(app);
// SocketServer(serverr);
// let port = 3002;
// serverr.listen(port, () => {
//   console.log(`Sever listening on ${port}`);
// });