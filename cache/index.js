const express = require('express')

const app = express()
const port = 3000;

app.use(express.json());

let cache_arr=[];

app.post('/save-phrase', (req, res) => {
    if (Object.keys(req.body).some(key => key === 'user_id') &&
    Object.keys(req.body).some(key => key === 'phrase') && Object.keys(req.body).length===2) {
        cache_arr.push(req.body)
        console.log(req.body)
        res.send(cache_arr)
    } else {
        res.send("Invalid parameters")
    }

})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})