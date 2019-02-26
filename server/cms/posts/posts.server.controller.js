'use strict';

var _ = require('lodash'),
    postsModel = require('./posts.server.model');

exports.getAll = function (req, res) {
    // retrieve all posts
    postsModel.getAll({}, null, function (err, posts) {
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
    postsModel.getById(req.params._id, function (err, post) {
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
    // set author as current user
    req.body.authorId = req.user.get('_id');
    postsModel.create(req.body, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    });
}

exports.update = function (req, res) {
    postsModel.updateOne(req.params._id, req.body, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    });
}

exports._delete = function (req, res) {
    postsModel.delete(req.params._id, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    });
}