'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  BasicStrategy = require('passport-http').BasicStrategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use basic strategy
  // Retrieve required fields for auth only
  passport.use(new BasicStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function (username, password, done) {
      User.findOne({
          username: username
        })
        .select('username displayName email appName roles knownIPAddresses password salt')
        .exec(function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'Unknown user or invalid password'
            });
          }
          if (!user.authenticate(password)) {
            return done(null, false, {
              message: 'Unknown user or invalid password'
            });
          }

          return done(null, user);
        });
    }
  ));
};
