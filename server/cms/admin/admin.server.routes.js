'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  userAuth = require(path.resolve('./server/users/users.authorization.server.controller'));

module.exports = function (app) {
  app.use(['/admin'], userAuth.hasAuthorization(['admin'], config.appBase));
};
