var chai = require('chai')
  , should = chai.should()
  , chaihttp = require('chai-http');

chai.use(chaihttp);

var fbagent = require('..');

describe('fbagent', function () {

  it('should have a version', function () {
    fbagent.version.should.match(/^\d+\.\d+\.\d+$/);
  });

  describe('untokened get requests', function () {
    it('should work', function (done) {
      fbagent
        .get('/jakeluer')
        .end(function (err, res) {
          should.not.exist(err);
          res.should.have.property('username', 'jakeluer');
          done();
        });
    });
  });

});
