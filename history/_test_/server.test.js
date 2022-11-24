const mongoose = require('mongoose');
const app = require('../server.js');
const History = require("../models");
const request = require('supertest'); //install
const supertest = require("supertest");
const nock = require('nock');

describe('history server', () => {
    beforeEach((done) => {
        mongoose.connect("mongodb://localhost:27017/movie_history",
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => done());
      });

    afterEach((done) => {
        mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
        });
    });


    test("POST /api/history", async () => {
        const movieList = ["star", 'happy'];

        await supertest(app).post("/save_user_history").send({'userId': 'jake', 'movies': ["star", 'happy'], 'address': 'socket'})
          .expect(200)
          .then((response) => {
            // console.log(response.body);

            expect(response.body.movies).toStrictEqual(movieList);
        });
    });

    test("get data from db", async () => {

      const getMovies = {userId: 'jake', movies: ["star", 'happy'], address: 'socket'};

      nock('http://localhost:3000')
        .get('/get-hist/jake/socket')
        .reply(200, getMovies);
      
      const res = await (await supertest(app).get("/history/jake/socket")).body;
      console.log(res);
      // expect(res.body)


        // console.log(getData.movies);

        // expect(getData.movies).toEqual('star')

        // const post = await History.create({userId: 'jake', movies: ["star", 'happy'], address: 'socket'});
        // post.save();

        // await supertest(app).get("/history/jake/socket")
        //   .expect(200)
        //   .then((response) => {
        //     console.log(response.body);

            // expect(body.movies).toStrictEqual(movies);
        });
    // })
})

// describe('', () =>{
//     beforeEach(() => {
//         let fake_api = nock('http://localhost:3000/')
//           .get('/get-hist/jake/socket')
//           .reply(200, {movies: ["star", 'happy']});
//     })

//     test("get data from db", async () => {
//         // const movieList = ["star", 'happy'];

//         const post = await History.create({userId: 'jake', movies: ["star", 'happy'], address: 'socket'});

//         await supertest(app).get("/history/jake/socket")
//           .expect(200)
//           .then((response) => {
//             console.log(response.body);

//             expect(response.body.movies).toStrictEqual(post.movies);
//         });
//     })
// } )


// describe('testing with a dummy json', function(){
//     before(function(){
//         /*
//             Mock API using nock for the REST API
//             Endpoint. Any calls to URL https://jsonplaceholder.typicode.com
//             will be intercepted by the fake_api nock  
//         */
//         let fake_api = nock('https://jsonplaceholder.typicode.com')
//                 .get('/todos/1')
//                 .reply(200, {_id: '123ABC',_rev: '946B7D1C' });
//     })
//     it('should return the expected json response', async function(){
//         let response = await supertest(app)
//                     .get('/getAPIResponse')
//         /* Checking if the response has OK status code*/
//         assert(response.statusCode, 200)
//         /* Checking for the _id returned from the fake_api */
//         assert(response.body._id, '123ABC')
//     })
//     after(function(){
//         /* Once the uni test case has executed, clean up the nock.
//             Now calls to the URL https://jsonplaceholder.typicode.com
//             won't be intercepted. 
//         */
//         nock.cleanAll();
//     })
//   })
