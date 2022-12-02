const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes")
const {MongoClient} = require('mongodb');
const History = require("./models")
const request = require('sync-request');
const { response } = require("./routes");

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

  console.log(req.body['movies'])
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
    let result = postCacheData({'userId': id, 'movies': moviestocache, 'address': req.body['address']})
    // console.log("resul    ", JSON.parse(result.toString()))
    history.save()
    }
    console.log(moviestocache)
    res.status(200).send("ok")
})

app.get('/history/:id/:address', (req, res) => {
  let id = req.params.id
  let result = getCacheData(id, req.params.address)
  console.log(result);
  if (result){
    res.json(result)
  } else {
    models.History.findById(id)
    .then(data => res.json(data))
  }     
})

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

function getCacheData(id, address) {
  let clientServerOptions = {
      uri: 'http://' + CACHEHOST + ':' + CACHEPORT + '/get-hist/' + id + '/' + address,
      body: '',
      method: 'GET',
  }
  console.log(clientServerOptions.uri)

  let responseFromAuth = request(clientServerOptions.method, 
      clientServerOptions.uri);
      // console.log(responseFromAuth)
    let result = JSON.parse(responseFromAuth.body);
    if(result['userId']){
      console.log(result)
    }
  
  return result;
}

module.exports = app;