const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes")
const {MongoClient} = require('mongodb');
const History = require("./models")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/movie_history');

const port = 3030;

app.use(express.json());

app.post('/history', async (req, res, next) => {
    // var userData = new History(req.body);
    // userData.save()
    //   .then(item => {
    //     console.log(req.body['user'])
    //     res.send("item saved to database");
    //   })
    //   .catch(err => {
    //     res.status(400).send("unable to save to database");
    //   });
    
    let id = req.body['user_id']
   let history = await History.findOne({ 'user_id': id }).exec();
    if (history == null) {
      userData = new History(req.body).save()
    } else { 
      console.log(history)
      let movies = req.body['movies']
      for (let elm of movies) {
      console.log(elm);
      if (history.movies.includes(elm) == false){
        history.movies.push(elm)
      }
    }
    history.save()
    }
    res.status(200).send("ok")
})

// app.get('/history', (req, res) => {
//
// })

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

app.use(Router);