const should = require('should'),
  request = require('supertest'),
  app = require('../index'),
  URI = require('./spec_helper').URI,
  mongoose = require('mongoose');

const validUser = {password: 'secret', lastName: 'Trump', firstName: 'Donald', email: 'donald.trump@gov.us'};


describe('************* AUTH REGISTRATION *************', () => {

  after(done=> {
    const colls = 'users';
    mongoose.connection.collections[colls].drop(err=> done());
  });

  it('should FAIL [422] to create a user without paramters', (done) => {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .expect(422)
      .end((err, res)=> {
        if (err) done(err);

        res.body.error.should.be.eql('You must enter an email address.');
        done();
      });
  });

  it('should FAIL [422] to create a user with incomplete paramter', (done) => {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send({email: 'trump@gov.us', lastName: 'Trump', firstName: 'Donald'})
      .expect(422)
      .end((err, res)=> {
        if (err) done(err);
        res.body.error.should.be.eql('You must enter a password.');
        done();
      });
  });

  it('should CREATE [201] a valid user', (done) => {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(201)
      .end((err, res)=> {
        if (err) done(err);
        res.body.token.should.be.an.instanceOf(String);
        res.body.user.should.be.an.instanceOf(Object);
        done();
      });
  });

  it('should FAIL [422] to create a user with occupied email', (done) => {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(422)
      .end((err, res)=> {
        if (err) done(err);
        res.body.error.should.be.eql('That email address is already in use.');
        done()
      });

  });
});

describe('************* AUTH LOGIN *************', () => {

  before((done)=> {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(201)
      .end((err, res)=> {
        if (err) done(err);
        done();
      });
  });

  after((done)=> {
    const colls = 'users';
    mongoose.connection.collections[colls].drop(err=> done());
  });

  it('should FAIL [400] to login without parameters', (done) => {
    request(app)
      .post('/api/auth/login')
      .set('X-Real-IP', URI)
      .expect(400, done);
  });

  it('should FAIL [400] to login with bad parameters', (done) => {
    request(app)
      .post('/api/auth/login')
      .set('X-Real-IP', URI)
      .type('form')
      .send({wrongparam: 'err'})
      .expect(400, done);
  });

  it('should FAIL [401] to login with invalid credential', (done) => {
    request(app)
      .post('/api/auth/login')
      .set('X-Real-IP', URI)
      .type('form')
      .send({email: 'err', password: '22'})
      .expect(401, done);
  });

  it('should LOGIN [200] with valid credential', (done) => {
    request(app)
      .post('/api/auth/login')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(200)
      .end((err, res)=> {
        if (err) done(err);
        res.body.token.should.be.an.instanceOf(String);
        res.body.user.should.be.an.instanceOf(Object);
        done();
      });
  });
});
