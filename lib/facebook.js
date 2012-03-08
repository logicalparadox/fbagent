var superagent = require('superagent')
  , qs = require('querystring')
  , url = require('url');

var graphUrl = 'https://graph.facebook.com';

module.exports = Facebook;

function Facebook (opts) {
  for (var o in opts) {
    this[o] = opts[o];
  }
}

Facebook.prototype.get = function (u) {
  this.method = 'GET';
  this.url = u;
  return this;
};

Facebook.prototype.post = function (u) {
  this.method = 'POST';
  this.url = u;
  return this;
};

Facebook.prototype.del= function (u) {
  if (!u.match(/[?|&]method=delete/i)) {
    u += ~u.indexOf('?') ? '?' : '&';
    u += 'method=delete';
  }

  this.method = 'POST';
  this.url = u;
  return this;
};

Facebook.prototype.search = function (opts) {
  this.method = 'GET';
  this.url = '/search?' + qs.stringify(opts);
  return this;
};

Facebook.prototype.send = function (opts) {
  this.postData = opts;
  return this;
};

Facebook.prototype.fql = function (query) {
  if ('string' !== typeof query) query = JSON.stringify(query);
  this.method = 'GET';
  this.url = '/fql?q=' + encodeURIComponent(query);
  return this;
};

Facebook.prototype.token = function (token) {
  this.accessToken = token;
  return this;
};

Facebook.prototype.end = function (cb) {
  var self = this
    , request;

  if (!this.url) return cb(new Error('Facebook request url not defined.'));
  if (this.url.charAt(0) !== '/') this.url = '/' + this.url;
  this.url = graphUrl + this.url;

  if (this.method == 'GET') {
    if (this.accessToken) {
      this.url += ~this.url.indexOf('?') ? '&' : '?';
      this.url += "access_token=" + this.accessToken;
    }
    var request = superagent.get(this.url);
  } else if (this.method == 'POST') {
    if (!this.token) return cb(new Error('Access Token required to post.'));
    var postData = this.postData || {};
    postData['access_token'] = this.accessToken;
    var request = superagent.post(this.url).send(postData);
  } else {
    return cb(new Error('Facebook method not defined'));
  }

  request.end(function (res) {
    var result = null
      , err = null;
    if (res.status == 200 && ~res.headers['content-type'].indexOf('text/javascript')) {
      result = JSON.parse(res.text);
    } else if (res.status == 403) {
      err = JSON.parse(res.text).error;
    } else {
      console.log(res);
    }
    cb(err, result);
  });
};

