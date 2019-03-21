'use strict';

var fs = require("fs"),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('server/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  userValidation = require(path.resolve('server/users/users.validation.service'));

exports.createAdministrator = function (req, res) {
  try {
    config.installed = JSON.parse(fs.readFileSync(path.resolve('./_content/install.json')));
  } catch (e) {
    config.installed = false;
  }

  if (config.installed) {
    return res.redirect('sign-in');
  }

  // Init Variables
  var user = new User(req.body);

  // check to ensure username isn't already taken
  userValidation.validateUserData(user.username, function (userExists, err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (userExists) {
      // User name already exists, provide other possibilities
      var possibleUsername = user.username || ((user.email) ? user.email.split('@')[0] : '');

      User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
        return res.status(200).send({
          userExists: true,
          possibleUsername: availableUsername
        });
      });
    } else {
      // installer defaults to the admin role
      user.roles = ['admin', 'user'];
      // Add missing user fields
      user.provider = 'local';
      user.displayName = user.firstName + ' ' + user.lastName;
      var config = req.app.locals.config;
      user.appName = config.app.name.toLowerCase();
      user.knownIPAddresses.push(req.connection.remoteAddress);

      // Then save the user
      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {

          // save installed flag in config file
          config.installed = true;
          fs.writeFileSync(path.resolve('./_content/install.json'), JSON.stringify(true));

          // Remove sensitive data before login
          user.password = undefined;
          user.salt = undefined;

          req.login(user, function (err) {
            if (err) {
              return res.status(400).send(err);
            }

            res.json({
              user: req.user
            });
          });
        }
      });
    }
  });
}
