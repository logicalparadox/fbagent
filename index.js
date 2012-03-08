module.exports = (process && process.env && process.env.FBAGENT_COV)
  ? require('./lib-cov/fbagent')
  : require('./lib/fbagent');
