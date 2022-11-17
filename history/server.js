const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes")
const {MongoClient} = require('mongodb');
const History = require("./models")
const request = require('sync-request');

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

const CACHEPORT = 3000;
const CACHEHOST = 'localhost';

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

    console.log('movies;' + req.body['movies'])
  let id = req.body['userId']
   let history = await History.findOne({ 'userId': id }).exec();
   let moviestocache = req.body['movies']
    if (history == null) {
      userData = new History(req.body).save()
    } else {
      let movies = req.body['movies']
      for (let elm of movies) {
      if (history.movies.includes(elm) == false){
        history.movies.push(elm)
      }
    }
    let result = postCacheData({'userId': id, 'movies': moviestocache})
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

function postCacheData(body) {
  console.log(body)
  let clientServerOptions = {
      uri: 'http://' + CACHEHOST + ':' + CACHEPORT + '/save-phrase',
      body: body,
      method: 'POST',
  }

  let responseFromAuth = request(clientServerOptions.method, 
      clientServerOptions.uri, {
          'json' : body
      });

  console.log(responseFromAuth.body);
  return responseFromAuth.body;
}