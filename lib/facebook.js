/*!
 * fbagent - facebook constructor
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module requires
 */

var superagent = require('superagent')
  , qs = require('querystring')
  , url = require('url')
  , debug = require('debug')('fbagent');

/*!
 * Primary graph url
 */

var graphUrl = 'https://graph.facebook.com';

/*!
 * Main exports
 */

module.exports = Facebook;

/**
 * # Facebook (constructor)
 *
 * Storage constructor for a request.
 * @api public
 */

function Facebook (opts) {
  for (var o in opts) {
    this[o] = opts[o];
  }
}

/**
 * # .get(url)
 *
 * Make a request to the Facebook Graph
 * using the `GET` method.
 *
 * @param {String} url
 * @api public
 */

Facebook.prototype.get = function (u) {
  this.method = 'GET';
  this.url = u;
  return this;
};

/**
 * # .post(url)
 *
 * Make a request to the Facebook Graph
 * that will be creating or updating an object.
 * A token must also be provided.
 *
 * @param {String} url
 * @api public
 */

Facebook.prototype.post = function (u) {
  this.method = 'POST';
  this.url = u;
  return this;
};

/**
 * # .send(options)
 *
 * Will populate the data to be sent to the
 * Facebook Graph on a post submission.
 *
 * @param {Object} options
 * @api public
 */

Facebook.prototype.send = function (opts) {
  this.postData = opts;
  return this;
};

/**
 * # .del(url)
 *
 * Start a new request to the Facebook Graph
 * that will be removing an object. A token
 * must also be provided.
 *
 * @param {String} url
 * @api public
 */

Facebook.prototype.del= function (u) {
  if (!u.match(/[?|&]method=delete/i)) {
    u += ~u.indexOf('?') ? '?' : '&';
    u += 'method=delete';
  }

  this.method = 'POST';
  this.url = u;
  return this;
};

/**
 * # .search(url)
 *
 * Start a new request to the Facebook Graph
 * that will be a search
 *
 * @param {String} search
 * @api public
 */

Facebook.prototype.search = function (opts) {
  this.method = 'GET';
  this.url = '/search?' + qs.stringify(opts);
  return this;
};

/**
 * # .fql(query)
 *
 * Start a new request to the Facebook Graph
 * that will return the response of an FQL query.
 *
 * @param {Object|String} fql query
 * @api public
 */

Facebook.prototype.fql = function (query) {
  if ('string' !== typeof query) query = JSON.stringify(query);
  this.method = 'GET';
  this.url = '/fql?q=' + encodeURIComponent(query);
  return this;
};

/**
 * # .token(accessToken)
 *
 * Start a new request to the Facebook Graph
 * that will be tagged with the specificied
 * access token.
 *
 * @param {String} access token
 * @api public
 */

Facebook.prototype.token = function (token) {
  this.accessToken = token;
  return this;
};

/**
 * # .end(callback)
 *
 * Finalize and make the request to the Facebook Graph.
 * Only available option is a callback which will return
 * in standard node.js form.
 *
 *      fbagent
 *        .get('/me')
 *        .token(access_token)
 *        .end(function (err, res) {
 *          // res is json or body of response
 *        });
 *
 * @param {Function} callback will return (err, result)
 * @api public
 */

Facebook.prototype.end = function (cb) {
  if (!this.url) return cb(new Error('Facebook request url not defined.'));
  if (this.url.charAt(0) !== '/') this.url = '/' + this.url;

  var self = this
    , uri = this.url

  this.url = graphUrl + this.url;

  if (this.method === 'GET') {
    if (this.accessToken) {
      this.url += ~this.url.indexOf('?') ? '&' : '?';
      this.url += "access_token=" + this.accessToken;
    }
    var request = superagent.get(this.url);
  } else if (this.method === 'POST') {
    if (!this.token) return cb(new Error('Access Token required to post.'));
    var postData = this.postData || {}
      , request = superagent.post(this.url);
    postData['access_token'] = this.accessToken;
    request.send(postData);
  } else {
    return cb(new Error('Facebook method not defined'));
  }

  debug((this.accessToken ? 'tokened ' : '') + '%s %s', this.method, uri);
  request.end(function (res) {
    var result = null
      , err = null

    if (~res.headers['content-type'].indexOf('image')) {
      result = { image: true, location: res.headers.location };
      return cb(null, result);
    }

    if (res.text && res.text.length > 0) {
      var text = res.text;
      if (~text.indexOf('{') && ~text.indexOf('}')) {
        try { result = JSON.parse(text); }
        catch (ex) { err = ex }
      } else {
        if (!~text.indexOf('=')) text = 'data=' + text;
        if (text.charAt(0) !== '?') text = '?' + text;
        try { result = url.parse(text, true).query; }
        catch (ex) { err = ex }
      }
    }

    if (!err && (result && result.error)) err = result.error;
    debug((err ? 'ERR :: ' : 'OK :: ') + '%d %s %s', res.status, self.method, uri);
    cb(err, result);
  });
};

