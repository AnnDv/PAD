const API_KEY = "8b853ea22b2da094a00861a8d60da1e6";
// const POPULAR_MOVIE_URL = "discover/movie?sort_by=popularity.desc&api_key=" + API_KEY;
// const PHRASE = ;
const API_URL = "https://api.themoviedb.org/3/search/movie";
// ?api_key=&language=en-US&query=&page=1&include_adult=false
const request = require('sync-request');

const express = require('express');
const app = express();

const PORT = 5001;

const HISTORYPORT = 3030
const HISTORYHOST = 'localhost';

app.use(express.json());

app.listen(PORT, () => {
    console.log("Reco has started on port: " + PORT)
})

app.post('/reco', (req, res) => {
    res.send(recognition(req.body));
});

// app.post('/history', (req, res) => {
//     res.send(postHistoryData(req.body))
// })

function recognition(body) {
    console.log(body)
    let phrase = body["phrase"];
    let userId = body["userId"];

    console.log(phrase);
    console.log(userId);

    let clientServerOptions = {
        uri: API_URL + `?api_key=${API_KEY}&language=en-US&query=${phrase}&page=1&include_adult=false`,
        method: 'GET',
        // timeout: 1000,
    };

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri, {
            // "timeout": clientServerOptions.timeout
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
    
    let resultFromHist = postHistoryData({"userId": userId, "movies": title});
    
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