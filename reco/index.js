const API_KEY = "8b853ea22b2da094a00861a8d60da1e6";
// const POPULAR_MOVIE_URL = "discover/movie?sort_by=popularity.desc&api_key=" + API_KEY;
// const PHRASE = ;
const API_URL = "https://api.themoviedb.org/3/search/movie";
// ?api_key=&language=en-US&query=&page=1&include_adult=false
const request = require('sync-request');

const express = require('express');
const app = express();

const PORT = 5001;
app.use(express.json());

app.listen(PORT, () => {
    console.log("Reco has started on port: " + PORT)
})

app.post('/reco', (req, res) => {
    
    // createNewUser(req.body)
    res.send(recognition(req.body));
});

function recognition(body) {
    console.log(body)
    let phrase = body["phrase"];

    let clientServerOptions = {
        uri: API_URL + `?api_key=${API_KEY}&language=en-US&query=${phrase}&page=1&include_adult=false`,
        method: 'GET',
    }

    let responseFromAuth = request(clientServerOptions.method, 
        clientServerOptions.uri
    );

    console.log(responseFromAuth.getBody()["results"]);
    movies_result = JSON.parse(responseFromAuth.getBody());
    movies = movies_result["results"];
    title = [];
    for(movie of movies) {
        // title = movie["original_title"];
        title.push(movie["original_title"])
    }
    
    return {"titles": title};
}