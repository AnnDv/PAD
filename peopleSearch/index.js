const API_KEY = "8b853ea22b2da094a00861a8d60da1e6";
// const POPULAR_MOVIE_URL = "discover/movie?sort_by=popularity.desc&api_key=" + API_KEY;
// const PHRASE = ;
const API_URL = "https://api.themoviedb.org/3/search/person/";
// https://api.themoviedb.org/3/search/person?api_key=<<api_key>>&language=en-US&page=1&include_adult=false
// ?api_key=&language=en-US&query=&page=1&include_adult=false
const request = require('sync-request');

const express = require('express');
const app = express();

const PORT = 6001;

const CACHEPORT = 3001;
const CACHEHOST = 'localhost';

app.use(express.json());

app.listen(PORT, () => {
    console.log("Reco has started on port: " + PORT)
})

app.post('/people', (req, res) => {
    // res.sendStatus(201);
    res.send(recognition(req.body));
});

function recognition(body) {
    console.log(body)
    let person = body["person"];

    let clientServerOptions = {
        uri: API_URL + `?api_key=${API_KEY}&language=en-US&query=${person}&page=1&include_adult=false`,
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
    // title = [];
    // for(movie of movies) {
    //     title.push(movie["original_title"])
    // };

    // console.log(movies);
    
    let resultFromHist = postCacheData({"persons": movies, "address": "person"});
    
    // console.log(responseFromAuth);
    
    return resultFromHist;
}

function postCacheData(body) {
    console.log(body)
    let clientServerOptions = {
        uri: 'http://' + CACHEHOST + ':' + CACHEPORT + '/save-persons',
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