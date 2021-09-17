import _ from 'lodash';
import mongoose from 'mongoose';
const CMSConfig = mongoose.model('CMSConfig');

export function getConfig(req, res) {
  CMSConfig.findOne().exec((err, cmsConfig) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.send({
      cmsConfig: cmsConfig
    });
  })
}

export function create(req, res) {
  const cmsConfigParam = req.body;

  CMSConfig(cmsConfigParam)
    .save((err, savedConfig) => {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      res.status(200).send({
        savedConfig: savedConfig
      });
    })
}

export function update(req, res) {
  const cmsConfigParam = req.body;

  // fields to update
  const set = _.omit(cmsConfigParam, '_id');

  CMSConfig.updateOne({
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
