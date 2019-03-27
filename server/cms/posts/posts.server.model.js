'use strict';

var mongoose = require('mongoose'),
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
  updated: {
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

postsSchema.statics.getByUrl = function (year, month, day, slug, callback) {
  var _this = this;

  _this.findOne({
    publishDate: year + '-' + month + '-' + day,
    slug: slug
  }).exec(function (err, post) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, post)
  });
}

postsSchema.statics.findText = function (searchText, pagination, callback) {
  var _this = this;

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

  _this.countDocuments(query).exec(function (err, totalCount) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    _this.find(query, {}, options).sort({
      publishDate: -1
    }).exec(function (err, posts) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, posts, totalCount)
    })
  })
}

mongoose.model('Posts', postsSchema);
