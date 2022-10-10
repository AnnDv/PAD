const express = require('express');
const axios = require('axios');
const app = express();
const {setupLogging} = require('./logging');
const {ROUTES} = require('./routes') 
const {setupProxies} = require('./proxy')
const {setupAuth} = require("./auth");
const request = require('sync-request');
// const morgan = require('morgan')
// const routes = require('./routes')


const PORT = 8000;
const HOST = 'localhost';

const AUTHPORT = 8887;
const AUTHHOST = 'localhost';

app.use(express.json());

setupLogging(app);
setupProxies(app, ROUTES);
setupAuth(app, ROUTES);


// create endpoint
// app.use('/', routes)

app.listen(PORT, () => {
    console.log("Gateway has started on port: " + PORT)
})

app.get('/', (req, res) => {
    console.log('hello')
    res.send("Simple API Gateway") 
})

app.post('/newuser', (req, res) => {
    
    // createNewUser(req.body)
    res.send(createNewUser(req.body));
    
})

app.post('/login', (req, res) => {
    
    // createNewUser(req.body)
    res.send(loginUser(req.body));
    
})

app.get('/log-out', (req, res) =>{
    
    res.send(logoutUser(req.headers.cookie))
})

// makes request to newuser endpoint in authetication microservice
function createNewUser(body){
    // create a dict for newuser
    let clientServerOptions = {
        uri: 'http://' + AUTHHOST + ':' + AUTHPORT + '/newuser',
        body: body,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // POST request to JSON endpoint
    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri, {
            'json' : clientServerOptions.body});

    return responseFromAuth.body
}

// makes request to login endpoint in authetication microservice
function loginUser(body){
    let clientServerOptions = {
        uri: 'http://' + AUTHHOST + ':' + AUTHPORT + '/login',
        body: body,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri, {
            'json' : clientServerOptions.body});

    // console.log(responseFromAuth)
    return responseFromAuth.body
}

// makes request to logout endpoint in authetication microservice
function logoutUser(auth_token){
    console.log(auth_token)
    let clientServerOptions = {
        uri: 'http://' + AUTHHOST + ':' + AUTHPORT + '/logout',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri);

    return responseFromAuth.body;
}