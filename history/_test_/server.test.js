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

        await supertest(app).post("/save_user_history").send({'userId': 'bob', 'movies': ["star", 'happy'], 'address': 'socket'})
          .expect(200)
          .then((response) => {
            // console.log(response.body);

            expect(response.body.movies).toStrictEqual(movieList);
            console.log(response.body.movies)
        });
    });

    test("get data from db", async () => {

      const getMovies = {userId: 'bob', movies: ["star", 'happy'], address: 'socket'};

      nock('http://localhost:3000')
        .get('/get-hist/bob/socket')
        .reply(200, getMovies);
      
      const res = await (await supertest(app).get("/history/bob/socket")).body;
      console.log(res);
        });
})
