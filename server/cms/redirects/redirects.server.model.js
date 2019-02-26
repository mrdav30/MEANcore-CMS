'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
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
var Redirects = mongoose.model('Redirects', redirectsSchema);

var service = {};

service.getAll = getAll;
service.getById = getById;
service.getByFrom = getByFrom;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll(callback) {
    Redirects.find().exec(function (err, redirects) {
        if (err) {
            return callback(err.name + ': ' + err.message)
        }

        callback(null, redirects);
    });
}

function getById(_id, callback) {
    Redirects.findById(_id).exec(function (err, redirect) {
        if (err) {
            return callback(err.name + ': ' + err.message)
        }

        callback(null, redirect);
    });
}

function getByFrom(from, callback) {

    Redirects.findOne({
        from: from
    }).exec(function (err, redirect) {
        if (err) {
            return callback(err.name + ': ' + err.message)
        }

        callback(null, redirect);
    });
}

function create(redirectParam, callback) {
    // ensure to and from are lowercase
    redirectParam.from = redirectParam.from.toLowerCase();
    redirectParam.to = redirectParam.to.toLowerCase();

    Redirects(redirectParam).save(function (err, doc) {
        if (err) {
            return callback(err.name + ': ' + err.message)
        }

        callback(null);
    });
}

function update(_id, redirectParam, callback) {
    // ensure to and from are lowercase
    redirectParam.from = redirectParam.from.toLowerCase();
    redirectParam.to = redirectParam.to.toLowerCase();

    // fields to update
    var set = _.omit(redirectParam, '_id');

    Redirects.updateOne({
            _id: mongoose.Types.ObjectId(_id)
        }, {
            $set: set
        },
        function (err, doc) {
            if (err) {
                return callback(err.name + ': ' + err.message)
            }

            callback(null);
        });
}

function _delete(_id, callback) {
    Redirects.deleteOne({
            _id: mongoose.Types.ObjectId(_id)
        },
        function (err) {
            if (err) {
                return callback(err.name + ': ' + err.message)
            }

            callback(null);
        });
}