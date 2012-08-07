/*!
 * fbagent
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module requires
 */

var Facebook = require('./facebook');

/*!
 * Module version
 */

exports.version = '0.3.1';

/**
 * # .get(url)
 *
 * Make a request to the Facebook Graph
 * using the `GET` method.
 *
 * @param {String} url
 * @api public
 */

exports.get = function (u) {
  return new Facebook().get(u);
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

exports.post = function (u) {
  return new Facebook().post(u);
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

exports.del = function (u) {
  return new Facebook().del(u);
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

exports.search = function (s) {
  return new Facebook().search(s);
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

exports.fql = function (q) {
  return new Facebook().fql(q);
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

exports.token = function (t) {
  return new Facebook().token(t);
};
