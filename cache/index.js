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
    let isUserInCache = false
    for (user of cache_arr){
        if (user['userId'] == req.body['userId']){
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
            cache_arr.push(req.body)
        }
        res.send(cache_arr)
    } else {
        res.send("Invalid parameters")
    }

})

app.get('/get-hist/:id', (req, res) => {
    console.log(req.params.id)
    for (user of cache_arr){
        if (user['userId'] == req.params.id){
            res.status(200).send(user);
            return
        }
    }
    res.status(400).send("Unable to find user with this Id");
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
