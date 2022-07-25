const express = require("express");
const app = express();
var cors = require("cors");
const { json } = require("express");
require("dotenv").config();
const port = process.env.PORT;

//------ middleware ------------//
app.use(cors());
app.use(json());

//------------------------------//

app.get("/", (req, res) => {
  res.send("Welcome to BookShelf server development branch.");
});

app.listen(port, () => {
  console.log(`BookShelf listening on port ${port}`);
});
