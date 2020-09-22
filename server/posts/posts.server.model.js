import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postsSchema = new Schema({
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
  },
  views: {
    type: Number
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
});
postsSchema.index({
  publish: 1
});
postsSchema.index({
  tags: 1
});
postsSchema.index({
  publishDate: 1
});
postsSchema.index({
  authorId: 1
});
postsSchema.index({
  slug: 1
});

postsSchema.statics = {
  getByUrl(year, month, day, slug, callback) {
    const _this = this;

    _this.findOne({
        publishDate: year + '-' + month + '-' + day,
        slug: slug
      })
      .lean()
      .exec((err, post) => {
        if (err) {
          return callback(err.name + ': ' + err.message);
        }

        callback(null, post)
      });
  },
  findText(searchText, pagination, callback) {
    const _this = this;

    const options = {},
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

    _this.countDocuments(query).exec((err, totalCount) => {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      _this.find(query, {
          url: 1,
          tags: 1,
          authorId: 1,
          thumbnailUrl: 1,
          title: 1,
          publishDate: 1,
          summary: 1,
          views: 1
        }, options).sort({
          publishDate: -1
        })
        .lean()
        .exec((err, posts) => {
          if (err) {
            return callback(err.name + ': ' + err.message);
          }

          callback(null, posts, totalCount)
        })
    })
  }
}

mongoose.model('Posts', postsSchema);
