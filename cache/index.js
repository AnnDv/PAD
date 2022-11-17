const express = require('express')

const app = express()
const port = 3000;

app.use(express.json());

let cache_arr=[];

app.post('/save-phrase', (req, res) => {
    /*
    check if key 'user_id' and 'phrase' exists in list, and if the length of list is equal to 2
    */
    if (Object.keys(req.body).some(key => key === 'userId') &&
    Object.keys(req.body).some(key => key === 'movies') && Object.keys(req.body).length===2) {
        /*
        append elements to an array and output the body of json
        */
    for (user of cache_arr){
        if (user['userId'] == req.body['userId']){
            for (movie of req.body['movies']){
                if (movie in user['movies']){

                }
                else{
                    user['movie'].push(movie)
                }
           }
        }
    }
       
        // cache_arr.push(req.body)
        console.log(req.body)
        res.send(cache_arr)
    } else {
        res.send("Invalid parameters")
    }

})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})