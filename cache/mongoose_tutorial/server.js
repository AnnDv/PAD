require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes")


const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/usersdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const username = "linapadlab";
const password = "czUP5SMwYthQRnlA";
const cluster = "cluster0";
const dbname = "myFirstDatabase";

mongoose.connect(
  `mongodb+srv://linpadlab:czUP5SMwYthQRnlA@cluster0.qggsakt.mongodb.net/?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(Router);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});