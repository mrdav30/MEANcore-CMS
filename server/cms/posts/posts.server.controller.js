'use strict';

var _ = require('lodash'),
  slugify = require('../../helpers'),
  mongoose = require('mongoose'),
  Posts = mongoose.model('Posts');

exports.getAll = function (req, res) {
  Posts.find({}).sort({
    publishDate: -1
  }).exec(function (err, posts) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.send({
      posts: posts
    });
  });
}

exports.getById = function (req, res) {
  Posts.findById(req.params._id).exec(function (err, post) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.send({
      post: post
    });
  });
}

exports.create = function (req, res) {
  var postParam = req.body;
  // set author as current user
  postParam.authorId = req.user._id;
  // generate slug from title if empty
  postParam.slug = postParam.slug || slugify(postParam.title);

  Posts(postParam)
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
  var postParam = req.body;
  // generate slug from title if empty
  postParam.slug = postParam.slug || slugify(postParam.title);
  postParam.updated = Date.now();

  // fields to update
  var set = _.omit(postParam, '_id');

  Posts.updateOne({
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
  Posts.deleteOne({
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
