
var Facebook = require('./facebook');

exports.version = '0.0.1';

exports.get = function (u) {
  return new Facebook().get(u);
};

exports.post = function (u) {
  return new Facebook().post(u);
};

exports.del = function (u) {
  return new Facebook().del(u);
};

exports.search = function (s) {
  return new Facebook().search(s);
};

exports.fql = function (q) {
  return new Facebook().fql(q);
};

exports.token = function (t) {
  return new Facebook().token(t);
};
