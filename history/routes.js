const express = require("express");
const historyModel = require("./models");
const app = express();

module.exports = app;

app.post("/save_user_history", async (request, response) => {
    const history = new historyModel(request.body);
  
    try {
      await history.save();
      response.send(history);
    } catch (error) {
      response.status(500).send(error);
    }
});