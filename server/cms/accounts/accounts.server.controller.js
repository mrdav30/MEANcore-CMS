'use strict';

var path = require('path'),
  _ = require('lodash'),
  userValidation = require(path.resolve('./server/users/users.validation.service')),
  errorHandler = require('../../errors.server.controller.js'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.getCurrentAccount = function (req, res) {
  var user = req.user || null;

  if (!user) {
    return res.status(400).send({
      message: 'User not logged in!'
    });
  }

  User.findById(user._id)
  .lean()
  .exec(function (err, account) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    // Remove sensitive data
    account.password = undefined;
    account.salt = undefined;

    res.send({
      account: account
    });
  });
}

exports.getById = function (req, res) {
  User.findById(req.params._id)
  .lean()
  .exec(function (err, account) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    if (account) {
      res.send({
        account: account
      });
    } else {
      res.status(404).send();
    }
  });
}

exports.updateAccount = function (req, res) {
  var account = req.body;

  // remove password property if it wasn't updated
  if (!account.password.length) {
    delete account.password;
  }

  userValidation.validateChanges(req, account, function (err, result) {
    if (err && !result) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (result && result.userExists) {
      return res.status(200).send({
        userExists: true,
        possibleUsername: result.availableUsername
      });
    }

    res.status(200).send({
      message: 'Success!'
    });
  });
}

exports.deleteAccount = function (req, res) {
  let user = req.user || null;
  if (req.params._id !== user._id) {
    // can only delete own account
    return res.status(401).send('You can only delete your own account');
  }

  User.deleteOne({
    _id: mongo.helper.toObjectID(user._id)
  }).exec(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).send({
      message: 'Success!'
    });
  });
}
