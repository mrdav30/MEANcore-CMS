'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  slugify = config.helpers.slugify,
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var postsSchema = new Schema({
  thumbnailUrl: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  body: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    trim: true
  },
  publishDate: {
    type: String,
    trim: true
  },
  url: {
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
postsSchema.index({
  name: 'text',
  description: 'text'
}, {
  weights: {
    tags: 5,
    title: 4,
    body: 3,
    summary: 1
  }
})
var Posts = mongoose.model('Posts', postsSchema);

var service = {};

service.getAll = getAll;
service.getByUrl = getByUrl;
service.getById = getById;
service.findText = findText;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll(query, pagination, callback) {
  var options = {};
  if (pagination) {
    options.skip = pagination.page_size * (pagination.page_number - 1);
    options.limit = pagination.page_size;
  }

  Posts.countDocuments(query).exec(function (err, totalCount) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    Posts.find(query, {}, options).sort({
      publishDate: -1
    }).exec(function (err, posts) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, posts, totalCount);
    });
  })
}

function getByUrl(year, month, day, slug, callback) {
  Posts.findOne({
    publishDate: year + '-' + month + '-' + day,
    slug: slug
  }).exec(function (err, post) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, post)
  });
}

function getById(_id, callback) {
  Posts.findById(_id).exec(function (err, post) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, post)
  });
}

function findText(searchText, pagination, callback) {
  var options = {},
    query = {
      publish: true,
      $text: {
        $search: searchText
      }
    };
  if (pagination) {
    options.skip = pagination.page_size * (pagination.page_number - 1);
    options.limit = pagination.page_size;
  }

  Posts.countDocuments(query).exec(function (err, totalCount) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    Posts.find(query, {}, options).sort({
      publishDate: -1
    }).exec(function (err, posts) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, posts, totalCount)
    })
  })
}

function create(postParam, callback) {
  // generate slug from title if empty
  postParam.slug = postParam.slug || slugify(postParam.title);

  Posts(postParam).save(function (err, doc) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null)
  });
}

function update(_id, postParam, callback) {
  // generate slug from title if empty
  postParam.slug = postParam.slug || slugify(postParam.title);

  // fields to update
  var set = _.omit(postParam, '_id');

  Posts.update({
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
  Posts.remove({
      _id: mongoose.Types.ObjectId(_id)
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
}
