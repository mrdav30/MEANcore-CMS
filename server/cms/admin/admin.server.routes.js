'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  userAuth = require(path.resolve('./server/users/users.authorization.server.controller'));

module.exports = function (app) {
  var admin = require('./admin.server.controller');

  app.use(['/admin'], admin.checkInstall, userAuth.hasAuthorization(['admin'], config.appBase));
};
