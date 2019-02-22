'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var subscribersSchema = new Schema({
    email: {
        type: String,
        trim: true
    },
    optIn: {
        type: Number
    },
    optInDate: {
        type: Date
    },
    /* For subscription confirmation */
    subscriptionConfirmToken: {
        type: String
    },
    subscriptionConfirmExpires: {
        type: Date
    }
}, {
    strict: false
});
var Subscribers = mongoose.model('Subscribers', subscribersSchema);

var service = {};

service.getAll = getAll;
service.getByEmail = getByEmail;
service.getByConfirmToken = getByConfirmToken;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll(callback) {
    Subscribers.find().exec(function (err, subscribers) {
        if (err) {
            return callback(err.name + ': ' + err.message)
        }

        callback(null, subscribers);
    });
}

function getByEmail(email, callback) {
    Subscribers.findOne({
        email: email
    }).exec(function (err, subscriber) {
        if (err) {
            return callback(err.name + ': ' + err.message)
        }

        callback(null, subscriber);
    });
}

function getByConfirmToken(token, callback) {
    Subscribers.findOne({
        subscriptionConfirmToken: token,
        subscriptionConfirmExpires: {
            $gt: Date.now()
        }
    }, function (err, subscriber) {
        if (err) {
            return callback(err.name + ': ' + err.message)
        }

        callback(null, subscriber);
    });
}

function create(subscribersParam, callback) {
    Subscribers(subscribersParam).save(function (err, doc) {
        if (err) {
            return callback(err.name + ': ' + err.message)
        }

        callback(null);
    });
}

function update(_id, subscribersParam, callback) {
    // fields to update
    var set = _.omit(subscribersParam, '_id');

    Subscribers.update({
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

function _delete(email, callback) {
    Subscribers.remove({
            email: email
        },
        function (err) {
            if (err) {
                return callback(err.name + ': ' + err.message)
            }

            callback(null);
        });
}