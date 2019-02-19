'use strict';

var path = require('path'),
  userValidation = require(path.resolve('./app/users/users.validation.server')),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.getCurrentAccount = function (req, res) {
  if (!req.user) {
    return res.status(400).send({
      message: 'User not logged in!'
    });
  }

  User.findById(req.user.get('_id')).exec(function (err, account) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    // remove password property
    account.password = undefined;

    res.send({
      account: account
    });
  });
}

exports.getById = function (req, res) {
  User.findById(req.params._id).exec(function (err, account) {
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

  userValidation.validateChanges(req, account, function (err, userExists, result) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else if (userExists) {
      return res.status(200).send({
        userExists: true,
        possibleUsername: result
      });
    } else {
      account.displayName = result.displayName ? result.displayName : result.username;
      account.email = result.email;
      // if account doesn't exist, create it, otherwise update
      if (!account._id) {
        User(account).save(function (err, doc) {
          if (err) {
            return res.status(400).send({
              message: err
            });
          }

          res.status(200).send({
            message: 'Success!'
          });
        });
      } else {
        // fields to update
        var set = _.omit(account, '_id');

        User.update({
            _id: mongoose.Types.ObjectId(account._id)
          }, {
            $set: set
          },
          function (err, doc) {
            if (err) {
              return res.status(400).send({
                message: err
              });
            }

            res.status(200).send({
              message: 'Success!'
            });
          });
      }
    }
  });
}

exports.deleteAccount = function (req, res) {
  let user = req.user.toObject() || null;
  if (req.params._id !== user._id) {
    // can only delete own account
    return res.status(401).send('You can only delete your own account');
  }

  User.remove({
    _id: mongo.helper.toObjectID(user._id)
  }).exec(function (err) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.status(200).send({
      message: 'Success!'
    });
  });
}
