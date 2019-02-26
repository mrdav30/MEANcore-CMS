'use strict';

var _ = require('lodash'),
    pagesModel = require('./pages.server.model');

exports.getAll = function (req, res) {
    pagesModel.getAll(function (err, pages) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.send({
            pages: pages
        });
    })
}

exports.getById = function (req, res) {
    pagesModel.getById(req.params._id, function (err, page) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.send({
            page: page
        });
    })
}

exports.create = function (req, res) {
    // set author as current user
    req.body.authorId = req.user.get('_id');
    pagesModel.create(req.body, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    });
}

exports.update = function (req, res) {
    pagesModel.updateOne(req.params._id, req.body, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    });
}

exports._delete = function (req, res) {
    pagesModel.delete(req.params._id, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    });
}