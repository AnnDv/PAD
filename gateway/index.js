const express = require('express');
const axios = require('axios');
const app = express();
const {setupLogging} = require('./logging');
const {ROUTES} = require('./routes') 
const {setupProxies} = require('./proxy')
const {setupAuth} = require("./auth");
const request = require('sync-request');
const cookieParser = require('cookie-parser');
const {circuitBreaker} = require("./circuitBreaker");
const CircuitBreaker = require('./Circuitbreak');

const PORT = 8000;
const HOST = 'localhost';

const AUTHPORT = 8887;
const AUTHHOST = 'localhost';

const RECOGPORT = 5001;
const RECOGHOST = 'localhost';

const CAHCHEPORT = 3000;
const CACHEHOST = 'localhost';

const HISTPORT = 3030;
const HISTHOST = 'localhost';

app.use(express.json());
app.use(cookieParser());

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
    const newUserBreaker = new CircuitBreaker(createNewUser);

    // // function timer() {
    //     newUserBreaker
    //       .fire()
    //       .then(console.log)
    // }

    // setInterval(timer, 1000);
    // setTimeout(function( ) { clearInterval( newUserInterval ); }, 5000);
      
    
    createNewUser(req.body)
    res.send(createNewUser(req.body));
    
    
})

app.post('/login', (req, res) => {
    // result = circuitBreaker(3, loginUser, req.body);
    // console.log("ahtung " + result);
    // if(result == "404"){
    //     res.send("Service is not responding")
    // }else{
    //     console.log(result)
    //     user_header = result.headers['set-cookie'];
    //     res.setHeader('set-cookie', user_header).send();
    // }
    user_header = loginUser(req.body)
    console.log(user_header)
    res.setHeader('set-cookie', user_header.headers['set-cookie']).send();
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

app.get('/get-history', (req, res) => {
    console.log('get historyyyy');
    res.send(showUserHistory(req.cookies["x-auth-token"]))
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
            'json' : clientServerOptions.body
        });

    console.log(responseFromAuth.headers['set-cookie']);
    return responseFromAuth;
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
    }

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri, {
            headers: {
                "Cookie": "x-auth-token="+cookies
            }});
    
    let parsedJson = JSON.parse(responseFromAuth.body)
    return parsedJson
}

function recognition(cookies, body){
    // console.log(body);
    let pJson= verifyUser(cookies)
    if(!pJson["status"]){
        return "Invalid user"
    } else {
        let clientServerOptions = {
            uri: 'http://' + RECOGHOST + ':' + RECOGPORT + '/reco',
            method: 'POST',
            headers: {
                Cookie: cookies
            },
            timeout: 1
        }
        
        let finalBody = pJson
        let data = pJson["data"]
        
        finalBody["userId"] = data["userId"]
        finalBody["phrase"] = body["phrase"]

        console.log("final Body: " + finalBody["userId"])

        let respFromReco = request(clientServerOptions.method, 
            clientServerOptions.uri, {
                'json' : finalBody,
                // 'timeout': clientServerOptions.timeout
            });
        
        return respFromReco.body
    }
}

function cacheUser(body){
    // create a dict for cache
    let clientServerOptions = {
        uri: 'http://' + CACHEHOST + ':' + CAHCHEPORT + '/save-phrase',
        body: body,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    // POST request to JSON endpoint
    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri, {
            'json' : clientServerOptions.body});

    return responseFromAuth.body
}

function showUserHistory(cookies){
    let pJson= verifyUser(cookies);
    console.log("verify ", pJson);
    if(!pJson["status"]){
        return "Invalid user"
    } else {
        let finalBody = pJson;
        let data = pJson["data"];
        
        finalBody["userId"] = data["userId"]
        let clientServerOptions = {
            uri: 'http://' + RECOGHOST + ':' + RECOGPORT + '/history/' + finalBody["userId"],
            method: 'GET',
            headers: {
                Cookie: cookies
            }
        }
        console.log("options ", clientServerOptions);

        let respFromReco = request(clientServerOptions.method, 
            clientServerOptions.uri);
        
        return respFromReco.body
    }
}
