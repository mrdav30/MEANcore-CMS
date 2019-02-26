'use strict';

var _ = require('lodash'),
    redirectsModel = require('./redirects.server.model');

exports.getAll = function (req, res) {
    redirectsModel.getAll(function (err, redirects) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.send({
            redirects: redirects
        });
    })
}

exports.getById = function (req, res) {
    redirectsModel.getById(req.params._id, function (err, redirect) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.send({
            redirect: redirect
        });
    })
}

exports.create = function (req, res) {
    redirectsModel.create(req.body, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    })
}

exports.update = function (req, res) {
    redirectsModel.updateOne(req.params._id, req.body, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    })
}

exports._delete = function (req, res) {
    redirectsModel.delete(req.params._id, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send();
    })
}