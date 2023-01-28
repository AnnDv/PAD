const API_KEY = "8b853ea22b2da094a00861a8d60da1e6";
const API_URL = "https://api.themoviedb.org/3/search/movie";
const request = require('sync-request');
const client = require('prom-client');

const register = new client.Registry()

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


// Mock slow endpoint, waiting between 3 and 6 seconds to return a response
const createDelayHandler = async (req, res) => {
    if ((Math.floor(Math.random() * 100)) === 0) {
      throw new Error('Internal Error')
    }
    // Generate number between 3-6, then delay by a factor of 1000 (miliseconds)
    const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3
    await new Promise(res => setTimeout(res, delaySeconds * 1000))
    res.end('Slow url accessed!');
};



const express = require('express');
const app = express();

const PORT = 5001;

const HISTORYPORT = 3030
const HISTORYHOST = 'history';

app.use(express.json());

app.listen(PORT, () => {
    console.log("Reco has started on port: " + PORT)
})

app.post('/reco', (req, res) => {
    // res.sendStatus(201);
    res.send(recognition(req.body));
});

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

app.get('/history/:id', (req, res) => {
    res.send(getHistory(req.params.id))
})

function recognition(body) {
    console.log(body)
    let phrase = body["phrase"];
    let userId = body["userId"];
    //let address = body["address"];

    console.log(phrase);
    console.log(userId);

    let clientServerOptions = {
        uri: API_URL + `?api_key=${API_KEY}&language=en-US&query=${phrase}&page=1&include_adult=false`,
        method: 'GET',
        timeout: 3000,
    };

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri, {
            "timeout": clientServerOptions.timeout
        }
    );

    // console.log(responseFromAuth.getBody()["results"]);

    movies_result = JSON.parse(responseFromAuth.getBody());
    movies = movies_result["results"];
    title = [];
    for(movie of movies) {
        title.push(movie["original_title"])
    };

    // console.log(movies);
    
    let resultFromHist = postHistoryData({"userId": userId, "movies": title, "address": "reco"});
    
    // console.log(responseFromAuth);
    
    return resultFromHist;
}

function postHistoryData(body) {
    console.log(body)
    let clientServerOptions = {
        uri: 'http://' + HISTORYHOST + ':' + HISTORYPORT + '/history',
        body: body,
        method: 'POST',
    };

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri, {
            'json' : body
        });

    console.log(responseFromAuth.body);
    return responseFromAuth.body;
}

function getHistory(id) {
    let clientServerOptions = {
        uri: 'http://' + HISTORYHOST + ':' + HISTORYPORT + '/history/' + id + '/reco',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri);

    console.log(responseFromAuth.body);
    return responseFromAuth.body;
}
// module.exports = app;
// module.exports = {postHistoryData};