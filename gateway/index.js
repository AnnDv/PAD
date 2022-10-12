const express = require('express');
const axios = require('axios');
const app = express();
const {setupLogging} = require('./logging');
const {ROUTES} = require('./routes') 
const {setupProxies} = require('./proxy')
const {setupAuth} = require("./auth");
const request = require('sync-request');
const cookieParser = require('cookie-parser')

const PORT = 8000;
const HOST = 'localhost';

const AUTHPORT = 8887;
const AUTHHOST = 'localhost';

const RECOGPORT = 5000;
const RECOGHOST = 'localhost';

const CAHCHEPORT = 3000;
const CACHEHOST = 'localhost'

app.use(express.json());
app.use(cookieParser())

// enable requests logging 
setupLogging(app);
// enable proxy
setupProxies(app, ROUTES);
// enable auth
setupAuth(app, ROUTES);

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

app.post('/reco', (req, res) =>{
    res.send(recognition(req.cookies["x-auth-token"], req.body))
})

app.post('/cache', (req, res) => {
    
    // createNewUser(req.body)
    res.send(cacheUser(req.body));
    
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

function verifyUser(cookies){
    console.log("AUTH cookies=" + cookies)
    let clientServerOptions = {
        uri: 'http://' + AUTHHOST + ':' + AUTHPORT + '/verifyuser',
        method: 'GET'
        // headers: {
        //     'x-auth-token': token
        // }
    }

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri, {
            headers: {
                "Cookie":"x-auth-token=" + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJqYWtlIiwiZXhwIjoxNjY1NTAxNTE0fQ.ICI4cabQWAJUObU8muL-z5SP2p0PB9Wpl2UXQKhI7mg"
            }});
    
    let parsedJson = JSON.parse(responseFromAuth.body)
    console.log("response   " + responseFromAuth.body)
    console.log("response   " + parsedJson["status"])
    return parsedJson["status"]
}

function recognition(cookies){
    if(!verifyUser(cookies)){
        return "Invalid user"
    } else {
        let clientServerOptions = {
            uri: 'http://' + RECOGHOST + ':' + RECOGPORT + '/recognition',
            method: 'POST',
            headers: {
                Cookie: cookies
            }
        }
    
        let responseFromAuth = request(clientServerOptions.method, 
            clientServerOptions.uri, {
                headers: {
                    "Cookie":"x-auth-token=" + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJqYWtlIiwiZXhwIjoxNjY1NTAxNTE0fQ.ICI4cabQWAJUObU8muL-z5SP2p0PB9Wpl2UXQKhI7mg"

                }
            });
    
        console.log(responseFromAuth.body)
        return responseFromAuth.body
    }
}

function cacheUser(body){
    // create a dict for newuser
    let clientServerOptions = {
        uri: 'http://' + CACHEHOST + ':' + CAHCHEPORT + '/save-phrase',
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