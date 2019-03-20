'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  mkdirp = require('mkdirp'),
  fs = require("fs");

exports.checkInstall = function (req, res, next) {
  try {
    config.installed = JSON.parse(fs.readFileSync(path.resolve('./_content/install.json')));
  } catch (e) {
    config.installed = false;
    !fs.existsSync('./_content/') && mkdirp.sync('./_content/');
    fs.writeFileSync(path.resolve('./_content/install.json'), JSON.stringify(false));
  }

  if (!config.installed && req.path !== '/sign-up-admin/install') {
    return res.redirect('sign-up-admin/install');
  }

  next();
}
