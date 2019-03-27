'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var redirectsSchema = new Schema({
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


redirectsSchema.static.getByFrom = function (from, callback) {
  var _this = this;

  _this.findOne({
    from: from
  }).exec(function (err, redirect) {
    if (err) {
      return callback(err.name + ': ' + err.message)
    }

    callback(null, redirect);
  });
}

mongoose.model('Redirects', redirectsSchema);
