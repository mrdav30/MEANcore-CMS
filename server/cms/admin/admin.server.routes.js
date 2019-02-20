'use strict';

var express = require('express'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  userAuth = require(path.resolve('./server/users/users.authorization.server.controller'));

var oneWeekSeconds = 60 * 60 * 24 * 7;
var oneWeekMilliseconds = oneWeekSeconds * 1000; // 1 week in milliseconds,

module.exports = function (app) {
  var admin = require('./admin.server.controller');

  app.use(['/admin'], admin.checkInstall, userAuth.hasAuthorization(['admin'], config.appBase));

  app.use('/api/admin/image-uploads', express.static(path.resolve(config.imageUploadRepository), {
    maxAge: oneWeekMilliseconds,
    index: false
  }));

  app.use('/api/admin/content/images', express.static(path.resolve(config.adminContentRepository + 'images/'), {
    maxAge: oneWeekMilliseconds,
    index: false
  }));

  // use session auth to secure the front end admin files
  // handle file upload
  app.route('/api/admin/upload').post(admin.getUpload().single('upload'), admin.upload);
};