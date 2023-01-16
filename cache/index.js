const express = require('express')
const client = require('prom-client')

const app = express()
const port = 3001;

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

app.use(express.json());

let cache_arr=[];

app.post('/save-phrase', (req, res) => {
    /*
    check if key 'user_id' and 'phrase' and 'address' exists in list, and if the length of list is equal to 3
    */
    if (Object.keys(req.body).some(key => key === 'userId') &&
    Object.keys(req.body).some(key => key === 'movies') && 
    Object.keys(req.body).some(key => key === 'address') && Object.keys(req.body).length===3) {
        /*
        append elements to an array and output the body of json
        */
    let isUserInCache = false
    for (user of cache_arr){
        if (user['userId'] == req.body['userId']){
            console.log("user exist" + req.body)
            for (movie of req.body['movies']){
                if (!user['movies'].includes(movie)){
                    user['movies'].push(movie)
                }
           }
           isUserInCache = true
           break
        }
    }
        if (isUserInCache == false){
            console.log("save new user" + req.body)
            cache_arr.push(req.body)
        }
        res.send(cache_arr)
    } else {
        res.send("Invalid parameters")
    }

})

app.post('/save-persons', (req, res) => {
    // console.log(cache_arr);
    cache_arr.push(req.body);
    console.log(cache_arr);
    res.send(req.body)
})

app.get('/get-hist/:id/:address', (req, res) => {
    console.log(req.socket.remoteAddress)
    for (user of cache_arr){
        if (req.params.address !== user['address']){
            continue
        }
        if (user['userId'] == req.params.id){
            console.log(user)
            res.status(200).json(user);
            return
        }
    }
    res.status(400).json({status:"Unable to find user with this Id"});
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
