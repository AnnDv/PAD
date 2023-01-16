const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes")
const {MongoClient} = require('mongodb');
const History = require("./models")
const request = require('sync-request');
const { response } = require("./routes");
const http = require('http')
const url = require('url')
const client = require('prom-client')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const app = express();

app.use(express.json());

mongoose.connect('mongodb://mongo:27017/movie_history');

const port = 3030;

app.use(express.json());

const CACHEPORT = 3001;
const CACHEHOST = 'localhost';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'example-nodejs-app'
})

client.collectDefaultMetrics({ 
    app: 'node-application-monitoring-app',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register 
})


// Create a custom histogram metric
const httpRequestTimer = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
  });
  
  // Register the histogram
register.registerMetric(httpRequestTimer);

const createDelayHandler = async (req, res) => {
  if ((Math.floor(Math.random() * 100)) === 0) {
    throw new Error('Internal Error')
  }
  // Generate number between 3-6, then delay by a factor of 1000 (miliseconds)
  const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3
  await new Promise(res => setTimeout(res, delaySeconds * 1000))
  res.end('Slow url accessed!');
};


// Prometheus metrics route
app.get('/metrics', async (req, res) => {
  // Start the HTTP request timer, saving a reference to the returned method
  const end = httpRequestTimer.startTimer();
  // Save reference to the path so we can record it when ending the timer
  const route = req.route.path;
    
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});

// 
app.get('/slow', async (req, res) => {
  const end = httpRequestTimer.startTimer();
  const route = req.route.path;
  await createDelayHandler(req, res);
  end({ route, code: res.statusCode, method: req.method });
});

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