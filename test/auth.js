process.env.NODE_ENV = 'test';

let config = require('../config.json');
let server = require('../app');
let jwt = require('jsonwebtoken');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Auth', () => {
  describe('Test auth middleware', () => {
      it('it responds with 401 status code if no token provided', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(401);
              done();
            });
      });
      it('it responds with 404 status code if valid token provided', (done) => {
        chai.request(server)
            .get('/')
            .set('Authorization', 'Bearer ' + jwt.sign({ sub: "5a14659cc05e3c0001c31f4b" }, config.secret))
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
      });
  });

  describe('POST /users/authenticate', function(){
      it('it responds with 400 status code if bad credentials', function(done) {
          chai.request(server)
              .post('/users/authenticate')
              .send({username:"bad", password:"wrong"})
              .end((err, res) => {
                  res.should.have.status(400);
                done();
          });
      });
      it('it responds with 200 status code if good credentials', function(done) {
          chai.request(server)
              .post('/users/authenticate')
              .send({username:"pkuhner", password:"test"})
              .end((err, res) => {
                  res.should.have.status(200);
                done();
          });
      });
      it('it returns JWT token, _id, username, firstName, lastName and isTeacher if good username or password', function(done) {
          chai.request(server)
              .post('/users/authenticate')
              .send({username:"pkuhner", password:"test"})
              .end((err, res) => {
                  res.body.should.have.property("token");
                  res.body.should.have.property("_id");
                  res.body.should.have.property("username");
                  res.body.should.have.property("isTeacher");
                  res.body.should.have.property("firstName");
                  res.body.should.have.property("lastName");
                done();
          });
      });
  });
});
