const express = require('express')

const app = express()
const port = 3001;

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
