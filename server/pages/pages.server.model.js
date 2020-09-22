import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const pagesSchema = new Schema({
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

pagesSchema.statics = {
  getBySlug(slug, callback) {
    const _this = this;
  
    _this.findOne({
        slug: slug
      })
      .lean()
      .exec((err, page) => {
        if (err) {
          return callback(err);
        } else if (!page) {
          return callback('Failed to load Page from slug ' + slug);
        }
  
        callback(null, page)
      })
  }
}

mongoose.model('Pages', pagesSchema);
