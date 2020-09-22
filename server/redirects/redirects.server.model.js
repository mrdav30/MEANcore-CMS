import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const redirectsSchema = new Schema({
  from: {
    type: String,
    trim: true
  },
  to: {
    type: String,
    trim: true
  },
}, {
  strict: false
});


redirectsSchema.statics = {
  getByFrom(from, callback) {
    const _this = this;

    _this.findOne({
        from: from
      })
      .lean()
      .exec((err, redirect) => {
        if (err) {
          return callback(err.name + ': ' + err.message)
        }

        callback(null, redirect);
      });
  }
}


mongoose.model('Redirects', redirectsSchema);
