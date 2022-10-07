const express = require('express');
const axios = require('axios');
const app = express();
const {setupLogging} = require('./logging');
const {ROUTES} = require('./routes') 
const {setupProxies} = require('./proxy')
// const morgan = require('morgan')
// const routes = require('./routes')


const PORT = 8000;
const HOST = 'localhost';

app.use(express.json());

setupLogging(app)
setupProxies(app, ROUTES);

// create endpoint
// app.use('/', routes)

app.listen(PORT, () => {
    console.log("Gateway has started on port: " + PORT)
})

app.get('/', (req, res) => {
    console.log('hello')
    res.send("Simple API Gateway") 
})