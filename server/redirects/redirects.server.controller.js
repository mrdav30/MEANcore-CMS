import _ from 'lodash';
import mongoose from 'mongoose';
const Redirects = mongoose.model('Redirects');

export function getAll(req, res) {
  Redirects.find().exec((err, redirects) => {
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

export function getById(req, res) {
  Redirects.findById(req.params._id).exec((err, redirect) => {
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

export function create(req, res) {
  const redirectParam = req.body;
  // ensure to and from are lowercase
  redirectParam.from = redirectParam.from.toLowerCase();
  redirectParam.to = redirectParam.to.toLowerCase();

  Redirects(redirectParam)
    .save((err) => {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      res.status(200).send();
    })
}

export function update(req, res) {
  const redirectParam = req.body;
  // ensure to and from are lowercase
  redirectParam.from = redirectParam.from.toLowerCase();
  redirectParam.to = redirectParam.to.toLowerCase();

  // fields to update
  const set = _.omit(redirectParam, '_id');

  Redirects.updateOne({
    _id: mongoose.Types.ObjectId(req.params._id)
  }, {
    $set: set
  }, (err) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.status(200).send();
  })
}

export function _delete(req, res) {
  Redirects.deleteOne({
    _id: mongoose.Types.ObjectId(req.params._id)
  }, (err) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.status(200).send();
  })
}
