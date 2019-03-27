'use strict';

var slugify = require('../../helpers'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var pagesSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  body: {
    type: String,
    trim: true
  },
  publish: {
    type: Boolean
  },
  authorId: {
    type: String
  }
}, {
  strict: false
});
var Pages = mongoose.model('Pages', pagesSchema);

var service = {};

service.getAll = getAll;
service.getBySlug = getBySlug;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll(callback) {
  Pages.find().exec(function (err, pages) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, pages);
  });
}

function getBySlug(slug, callback) {
  Pages.findOne({
    slug: slug
  }).exec(function (err, page) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, page);
  });
}

function getById(_id, callback) {
  Pages.findById(_id).exec(function (err, page) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, page);
  });
}

function create(pageParam, callback) {
  // generate slug from title if empty
  pageParam.slug = pageParam.slug || slugify(pageParam.title);

  Pages(pageParam).save(function (err, doc) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null)
  });
}

function update(_id, pageParam, callback) {
  // generate slug from title if empty
  pageParam.slug = pageParam.slug || slugify(pageParam.title);

  // fields to update
  var set = _.omit(pageParam, '_id');

  Pages.updateOne({
      _id: mongoose.Types.ObjectId(_id)
    }, {
      $set: set
    },
    function (err, doc) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
}

function _delete(_id, callback) {
  Pages.deleteOne({
      _id: mongoose.Types.ObjectId(_id)
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
}
