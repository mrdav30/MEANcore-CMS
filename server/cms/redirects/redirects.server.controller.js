'use strict';

var _ = require('lodash'),
  Redirects = require('mongoose').model('Redirects');

exports.getAll = function (req, res) {
  Redirects.find().exec(function (err, redirects) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.send({
      redirects: redirects
    });
  })
}

exports.getById = function (req, res) {
  Redirects.findById(req.params._id).exec(function (err, redirect) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.send({
      redirect: redirect
    });
  })
}

exports.create = function (req, res) {
  var redirectParam = req.body;
  // ensure to and from are lowercase
  redirectParam.from = redirectParam.from.toLowerCase();
  redirectParam.to = redirectParam.to.toLowerCase();

  Redirects(redirectParam)
    .save(function (err) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      res.status(200).send();
    })
}

exports.update = function (req, res) {
  var redirectParam = req.body;
  // ensure to and from are lowercase
  redirectParam.from = redirectParam.from.toLowerCase();
  redirectParam.to = redirectParam.to.toLowerCase();

  // fields to update
  var set = _.omit(redirectParam, '_id');

  Redirects.updateOne({
      _id: mongoose.Types.ObjectId(req.params._id)
    }, {
      $set: set
    },
    function (err) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      res.status(200).send();
    })
}

exports._delete = function (req, res) {
  Redirects.deleteOne({
      _id: mongoose.Types.ObjectId(req.params._id)
    },
    function (err) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      res.status(200).send();
    })
}
