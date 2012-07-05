var chai = require('chai')
  , should = chai.should();

var fbagent = require('..')
  , config = require('./config.json');

describe('fbagent', function () {

  it('should have a version', function () {
    fbagent.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  describe('untokened get requests', function () {

    it('can get a user', function (done) {
      fbagent
        .get('/jakeluer')
        .end(function (err, res) {
          should.not.exist(err);
          res.should.have.property('username', 'jakeluer');
          done();
        });
    });

  });

  describe('tokened request', function () {
    var testUser;

    it('can create a test user', function (done) {
      fbagent
        .get(config.appId + '/accounts/test-users')
        .token(config.appId + '|' + config.appSecret)
        .send({
            installed: true
          , name: 'Rory Williams'
          , permissions: config.scope
          , method: 'post'
        })
        .end(function (err, res) {
          should.not.exist(err);
          testUser = res;
          testUser.should.include.keys('id', 'access_token', 'email', 'password');
          done();
        });
    });

    it('can get a protected resource', function (done) {
      fbagent
        .get('/me')
        .token(testUser.access_token)
        .end(function (err, res) {
          should.not.exist(err);
          res.should.include.keys('id', 'name', 'email');
          done();
        });
    });

    it('can post to a protected resource', function (done) {
      fbagent
        .post('/me/feed')
        .token(testUser.access_token)
        .send({ message: 'If only I could remember where i parked my tardis.' })
        .end(function (err, res) {
          should.not.exist(err);
          done();
        });
    });

    it('can delete a protected resource', function (done) {
      fbagent
        .del('/' + testUser.id)
        .token(config.appId + '|' + config.appSecret)
        .end(function (err, res) {
          should.not.exist(err);
          done();
        });
    });
  });

});
