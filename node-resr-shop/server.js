const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");

const uri =
`mongodb+srv://${process.env.MONGO_ATLAS_NAME}:${process.env.MONGO_ATLAS_PW}@cluster0.6gk9dki.mongodb.net/node-rest-shop?retryWrites=true&w=majority`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((resulr) => {
    console.log("Connect to db");
    // listen for requests
    // We're only going to listen for requests after this connection is complete
    server.listen(port);
  })
  .catch((err) => {
    console.log("Erreur", err);
  });

const port = process.env.PORT || 3000;

const server = http.createServer(app);
