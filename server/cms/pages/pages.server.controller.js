'use strict';

var _ = require('lodash'),
  slugify = require('../../helpers'),
  mongoose = require('mongoose'),
  Pages = mongoose.model('Pages');

exports.getAll = function (req, res) {
  Pages.find().exec(function (err, pages) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.send({
      pages: pages
    });
  })
}

exports.getById = function (req, res) {
  Pages.findById(req.params._id).exec(function (err, page) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.send({
      page: page
    });
  })
}

exports.create = function (req, res) {
  var pageParam = req.body;
  // set author as current user
  pageParam.authorId = req.user._id;
  // generate slug from title if empty
  pageParam.slug = pageParam.slug || slugify(pageParam.title);

  Pages(pageParam)
    .save(function (err) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      res.status(200).send();
    });
}

exports.update = function (req, res) {
  var pageParam = req.body;
  // generate slug from title if empty
  pageParam.slug = pageParam.slug || slugify(pageParam.title);

  // fields to update
  var set = _.omit(pageParam, '_id');

  Pages.updateOne({
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
    });
}

exports._delete = function (req, res) {
  Pages.deleteOne({
      _id: mongoose.Types.ObjectId(req.params._id)
    },
    function (err) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      res.status(200).send();
    });
}
