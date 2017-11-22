process.env.NODE_ENV = 'test';

let config = require('../config.json');
let server = require('../app');
let jwt = require('jsonwebtoken');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

let student = {
    firstName: "john",
    lastName: "doe",
    username: "jdoe",
    password: "test",
    group: "5TC4"
}

let teacher = {
    firstName: "bob",
    lastName: "marley",
    username: "bmarley",
    password: "test",
    isTeacher: true,
    trigram: "BMA"
}

describe('Registration', () => {
  describe('POST /users/register', function(){
      it('it responds with 400 status code if missing fields', function(done) {
          chai.request(server)
              .post('/users/register')
              .send({username:"bad", password:"wrong"})
              .end((err, res) => {
                  res.should.have.status(400);
                done();
          });
      });
      it('it responds with 200 status code if good form and teacher', function(done) {
          let user = teacher;
          chai.request(server)
              .post('/users/register')
              .send(user)
              .end((err, res) => {
                  res.should.have.status(200);
                done();
          });
      });
      it('it responds with 200 status code if good form and student', function(done) {
          let user = student;
          chai.request(server)
              .post('/users/register')
              .send(user)
              .end((err, res) => {
                  res.should.have.status(200);
                done();
          });
      });
      it('it responds with 400 status code if username is already taken', function(done) {
          let user = student;
          chai.request(server)
              .post('/users/register')
              .send(user)
              .end((err, res) => {
                  res.should.have.status(400);
                done();
          });
      });
  });
});
