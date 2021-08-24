import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
const Posts = mongoose.model('Posts');

export const getAll = (req, res) => {
  Posts.find({}).sort({
    publishDate: -1
  }).exec((err, posts) => {
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

export const getById = (req, res) => {
  Posts.findById(req.params._id).exec((err, post) => {
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

export const create = (req, res) => {
  const config = req.app.locals.config;
  const postParam = req.body;
  // set author as current user
  postParam.authorId = req.user._id;
  // generate slug from title if empty
  postParam.slug = postParam.slug || config.helpers.slugify(postParam.title);

  Posts(postParam)
    .save((err) => {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      res.status(200).send();
    });
}

export const update = (req, res) => {
  const config = req.app.locals.config;
  const postParam = req.body;
  // generate slug from title if empty
  postParam.slug = postParam.slug || config.helers.slugify(postParam.title);
  postParam.updated = moment(Date.now()).format('YYYY-MM-DD');

  // fields to update
  const set = _.omit(postParam, '_id');

  Posts.updateOne({
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
  });
}

export const _delete = (req, res) => {
  Posts.deleteOne({
    _id: mongoose.Types.ObjectId(req.params._id)
  }, (err) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.status(200).send();
  });
}
