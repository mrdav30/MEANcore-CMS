'use strict';

var path = require('path'),
  config = config = require(path.resolve('./config/config')),
  moment = require('moment'),
  errorHandler = require(path.resolve('./server/errors.server.controller')),
  emailService = config.services.emailService,
  transferService = config.services.transferService,
  subscribersModel = require('./subscribers.server.model'),
  crypto = require('crypto'),
  async = require('async');

exports.sendConfirmation = function (req, res) {
  async.waterfall([
    function (done) {
      //generate token for email confirmation
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      //ensure email isn't already subscribed
      subscribersModel.getByEmail(req.body.email, function (err, subscriber) {
        if (err) {
          return done(err);
        } else if (subscriber) {
          return done('You are already subscribed');
        } else {
          // email isn't found, assign confirm token
          done(null, token);
        }
      });
    },
    function (token, done) {
      // email data and options for subscriber confirmation
      var mailOptions = {
        to: req.body.email,
        from: config.mailer.from,
        subject: config.app.title + ' Newsletter: Please Confirm Subscription',
        path: 'server/cms/subscribers/templates/confirm-subscription-email',
        data: {
          appName: config.app.title,
          url: 'http://' + req.headers.host + req.baseUrl + '/api/subscribe/validate/' + token,
          fromEmail: config.mailer.from
        }
      };

      emailService.sendEmail(req, res, mailOptions, function (err) {
        if (err) {
          return done(err);
        }

        done(null, token);
      });
    },
    function (token, done) {
      // store confirmation token for now
      var subscriber = {
        email: req.body.email,
        optIn: 0, // opt-out until validation
        subscriptionConfirmToken: token,
        subscriptionConfirmExpires: Date.now() + 3600000 // 1 hour
      };

      subscribersModel.create(subscriber, function (err) {
        if (err) {
          return done(err);
        }

        done(null);
      });
    }
  ], function (err) {
    if (err) {
      return res.status(200).send({
        message: errorHandler.getErrorMessage(err),
        msgSent: false
      });
    }

    res.status(200).send({
      message: "Thanks! A welcome email has been sent to your inbox",
      msgSent: true
    });
  });
}

/**
 * Confirm subscription GET from email token
 */
exports.validateSubscriptionToken = function (req, res) {
  subscribersModel.getByConfirmToken(req.params.token, function (err, subscriber) {
    if (!subscriber) {
      return res.redirect(req.baseUrl + '/subscribe/validate/invalid');
    }

    res.redirect(req.baseUrl + '/subscribe/validate/' + req.params.token);
  });
};

exports.getAll = function (req, res) {
  subscribersModel.getAll(function (err, subscribers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.send({
      subscribers: subscribers
    });
  })
}

exports.validateSubscription = function (req, res) {
  subscribersModel.getByConfirmToken(req.body.token, function (err, subscriber) {
    if (!subscriber) {
      return res.status(200).send({
        message: err,
        validated: false
      });
    }

    subscriber.optIn = 1;
    subscriber.optInDate = moment().format('YYYY/MM/DD');
    subscriber.subscriptionConfirmToken = undefined;
    subscriber.subscriptionConfirmExpires = undefined;

    subscriber.save(subscriber, function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).send({
        message: 'You are now subscribed',
        validated: true
      });
    });
  });
}

exports.update = function (req, res) {
  subscribersModel.update(req.params._id, req.body, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).send();
  })
}

exports._delete = function (req, res) {
  subscribersModel.delete(req.params._id, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).send({
      message: 'You are now unsubscribed',
      unsubscribed: true
    });
  })
}

exports.getContact = function (req, res) {
  transferService.responseFile('server/cms/subscribers/_content/', 'techievor_vCard.vcf', res);
}
