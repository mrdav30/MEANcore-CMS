import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {
  randomBytes
} from 'crypto';
import mongoose from 'mongoose';
const Subscribers = mongoose.model('Subscribers');

export const sendConfirmation = (req, res) => {
  const config = req.app.locals.config;
  async.waterfall([
    (done) => {
      //generate token for email confirmation
      randomBytes(20, (err, buffer) => {
        const token = buffer.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      //ensure email isn't already subscribed
      Subscribers.findOne({
        email: req.body.email
      }).exec((err, subscriber) => {
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
    (token, done) => {
      // email data and options for subscriber confirmation
      const mailOptions = {
        to: req.body.email,
        from: config.mailer.from,
        subject: config.app.title + ' Newsletter: Please Confirm Subscription',
        path: 'server/cms/subscribers/templates/confirm-subscription-email.server.html',
        data: {
          appTitle: config.app.title,
          url: res.locals.host + '/api/subscribe/validate/' + token,
          fromEmail: config.mailer.from
        }
      };

      config.services.sendEmail(req, res, mailOptions, (err) => {
        if (err) {
          return done(err);
        }

        done(null, token);
      });
    },
    (token, done) => {
      // store confirmation token for now
      const subscriber = {
        email: req.body.email,
        // opt-out until validation
        optIn: 0,
        subscriptionConfirmToken: token,
        // set expiration to default seession cookie age
        subscriptionConfirmExpires: Date.now() + config.sessionCookie.maxAge
      };

      Subscribers(subscriber).save((err) => {
        if (err) {
          return done(err);
        }

        done(null);
      });
    }
  ], (err) => {
    if (err) {
      return res.status(200).send({
        message: config.helpers.getErrorMessage(err),
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
export const validateSubscriptionToken = (req, res) => {
  Subscribers.findOne({
    subscriptionConfirmToken: req.params.token,
    subscriptionConfirmExpires: {
      $gt: Date.now()
    }
  }, (err, subscriber) => {
    if (!subscriber) {
      return res.redirect(req.baseUrl + '/subscribe/validate/invalid');
    }

    res.redirect(req.baseUrl + '/subscribe/validate/' + req.params.token);
  });
}

export const getAll = (req, res) => {
  const config = req.app.locals.config;
  Subscribers.find()
    .exec((err, subscribers) => {
      if (err) {
        return res.status(200).send({
          message: config.helpers.getErrorMessage(err),
          msgType: 'error'
        });
      }

      res.send({
        subscribers: subscribers
      });
    })
}

export const getByEmail = (req, res) => {
  const config = req.app.locals.config;
  Subscribers.findOne({
      email: req.body.email
    })
    .exec((err, subscriber) => {
      if (err) {
        return res.status(200).send({
          message: config.helpers.getErrorMessage(err),
          msgType: 'error'
        });
      }

      res.send({
        subscriber: subscriber
      });
    })
}

export const validateSubscription = (req, res) => {
  const config = req.app.locals.config;
  Subscribers.findOne({
    subscriptionConfirmToken: req.body.token,
    subscriptionConfirmExpires: {
      $gt: Date.now()
    }
  }, (err, subscriber) => {
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

    subscriber.save(subscriber, (err) => {
      if (err) {
        return res.status(200).send({
          message: config.helpers.getErrorMessage(err),
          msgType: 'error'
        });
      }

      res.status(200).send({
        message: 'You are now subscribed',
        validated: true
      });
    });
  });
}

export const update = (req, res) => {
  const config = req.app.locals.config;
  const subscribersParam = req.body;

  const set = _.omit(subscribersParam, '_id');

  Subscribers.updateOne({
    _id: mongoose.Types.ObjectId(req.params._id)
  }, {
    $set: set
  }, (err) => {
    if (err) {
      return res.status(200).send({
        message: config.helpers.getErrorMessage(err),
        msgType: 'error'
      });
    }

    res.status(200).send();
  })
}

export const _deleteById = (req, res) => {
  const config = req.app.locals.config;
  Subscribers.deleteOne({
    _id: mongoose.Types.ObjectId(req.params._id)
  }, (err) => {
    if (err) {
      return res.status(200).send({
        message: config.helpers.getErrorMessage(err),
        msgType: 'error'
      });
    }

    res.status(200).send({
      message: 'Email removed from listing',
      unsubscribed: true
    });
  })
}

export const getContact = (req, res) => {
  const config = req.app.locals.config;
  config.services.responseFile('modules/server/subscribers/templates/', 'meancore_cms_vCard.vcf', res);
}
