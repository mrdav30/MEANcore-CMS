import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
import async from 'async';
const Posts = mongoose.model('Posts');

export const getAll = (req, res) => {
  Posts.find({
    parentId: null
  }).sort({
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
  let postParam = req.body;

  // generate slug from title if empty
  postParam.slug = postParam.slug || config.helers.slugify(postParam.title);
  postParam.updated = moment(Date.now()).format('YYYY-MM-DD');

  async.waterfall([
    function (done) {
      //  Check for unpublished changes
      if (postParam.unpublishedChanges) {
        // if not publishing changes
        if (!postParam.publishChanges) {
          // if parentId exists, update the draft
          if (postParam.parentId) {
            const set = _.omit(postParam, '_id');

            let update = {
              filter: {
                _id: mongoose.Types.ObjectId(req.params._id)
              },
              query: {
                $set: set
              }
            };

            done(null, update);
          } else {
            // otherwise create the draft
            postParam.parentId = postParam._id;
            postParam._id = mongoose.Types.ObjectId();

            Posts(postParam)
              .save(function (err, savedPost) {
                if (err) {
                  return done(err, null);
                } else {
                  // Then update the parent with the child Id
                  let update = {
                    filter: {
                      _id: mongoose.Types.ObjectId(savedPost.parentId)
                    },
                    query: {
                      $set: {
                        unpublishedChanges: true,
                        childId: savedPost._id
                      }
                    }
                  };

                  done(null, update);
                }
              });
          }
        } else {
          // if parentId exists, delete the draft first
          if (postParam.parentId) {
            Posts.deleteOne({
              _id: mongoose.Types.ObjectId(postParam._id)
            }, (err) => {
              if (err) {
                return done(err, null);
              } else {
                // Then update parent with draft changes
                // fields to update
                const set = _.omit(postParam, ['_id', 'parentId']);
                set.unpublishedChanges = false;
                set.publishChanges = false;

                let update = {
                  filter: {
                    _id: mongoose.Types.ObjectId(postParam.parentId)
                  },
                  query: [{
                      $set: set,
                    },
                    {
                      $unset: [
                        'childId'
                      ]
                    }
                  ]
                };

                done(null, update);
              }
            });
          } else {
            //publishing changes without draft
            const set = _.omit(postParam, '_id');
            set.unpublishedChanges = false;
            set.publishChanges = false;

            let update = {
              filter: {
                _id: mongoose.Types.ObjectId(req.params._id)
              },
              query: {
                $set: set
              }
            };

            done(null, update);
          }
        }
      } else {
        if (postParam.parentId && !postParam.publish) {
          // draft was unpublished, delete draft
          Posts.deleteOne({
            _id: mongoose.Types.ObjectId(postParam._id)
          }, (err) => {
            if (err) {
              return done(err, null);
            } else {
              // Then update parent with draft changes
              // fields to update
              const set = _.omit(postParam, ['_id', 'parentId']);
              set.unpublishedChanges = false;
              set.publishChanges = false;

              let update = {
                filter: {
                  _id: mongoose.Types.ObjectId(postParam.parentId)
                },
                query: [{
                    $set: set,
                  },
                  {
                    $unset: [
                      'childId'
                    ]
                  }
                ]
              };

              done(null, update);
            }
          });
        } else {
          const set = _.omit(postParam, '_id');

          let update = {
            filter: {
              _id: mongoose.Types.ObjectId(req.params._id)
            },
            query: {
              $set: set
            }
          };

          done(null, update);
        }
      }
    },
    function (update, done) {
      if (update) {
        Posts.updateOne(update.filter, update.query, (err) => {
          if (err) {
            return done(err);
          } else {
            done(null);
          }
        });
      } else {
        done(null);
      }
    }
  ], (err) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    res.status(200).send();
  })
}

export const _delete = (req, res) => {
  Posts.findById(req.params._id).exec((err, post) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }

    if (post.parentId) {
      // delete draft
      Posts.deleteOne({
        _id: mongoose.Types.ObjectId(req.params._id)
      }, (err) => {
        if (err) {
          return res.status(400).send({
            message: err
          });
        }

        // Then remove from parent
        Posts.updateOne({
          _id: mongoose.Types.ObjectId(post.parentId)
        }, [{
            $set: {
              unpublishedChanges: false,
              publishChanges: false
            },
          },
          {
            $unset: [
              'childId'
            ]
          }
        ], (err) => {
          if (err) {
            return res.status(400).send({
              message: err
            });
          }

          res.status(200).send();
        });
      });
    } else {
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
  });
}
