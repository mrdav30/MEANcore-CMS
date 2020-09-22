import _ from 'lodash';
import mongoose from 'mongoose';
const Pages = mongoose.model('Pages');

export const getAll = (req, res) => {
  Pages.find().exec((err, pages) => {
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

export const getById = (req, res) => {
  Pages.findById(req.params._id).exec((err, page) => {
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

export const create = (req, res) => {
  const config = req.app.locals.config;
  const pageParam = req.body;
  // set author as current user
  pageParam.authorId = req.user._id;
  // generate slug from title if empty
  pageParam.slug = pageParam.slug || config.helpers.slugify(pageParam.title);

  Pages(pageParam)
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
  const pageParam = req.body;
  // generate slug from title if empty
  pageParam.slug = pageParam.slug || config.helpers.slugify(pageParam.title);

  // fields to update
  const set = _.omit(pageParam, '_id');

  Pages.updateOne({
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
  Pages.deleteOne({
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
