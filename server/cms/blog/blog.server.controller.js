'use strict';

var async = require('async'),
  moment = require('moment'),
  path = require('path'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  slugify = config.helpers.slugify,
  googleAnalytics = config.services.googleAnalytics,
  errorHandler = require('../../errors.server.controller.js'),
  mongoose = require('mongoose'),
  Pages = mongoose.model('Pages'),
  Posts = mongoose.model('Posts'),
  Redirects = mongoose.model('Redirects'),
  User = mongoose.model('User');

exports.checkForRedirects = function (req, res, next) {
  var url = req.url.toLowerCase();

  // redirects entered into cms
  Redirects.getByFrom(url, function (err, redirect) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    if (redirect) {
      // 301 redirect to new url
      return res.redirect(301, redirect.TO);
    }

    next();
  })
}

exports.retrieveSharedData = function (req, res, next) {
  var vm = {};
  async.series([
    function (callback) {
      // return only the publishDate and tags from published posts
      Posts.find({
          publish: true
        }, {
          publishDate: 1,
          tags: 1
        })
        .lean()
        .exec((err, posts) => {
          if (err) {
            return callback(err);
          }

          vm.posts = posts ? posts : [];

          callback(null);
        });
    },
    function (callback) {
      refreshPostViews(callback)
    },
    function (callback) {
      loadYears(vm, callback);
    },
    function (callback) {
      loadTags(vm, callback);
    }
  ], function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    // posts data no longer required
    delete vm.posts;

    res.status(200).send({
      vm: vm ? vm : {}
    })
  })
}

function refreshPostViews(callback) {
  var runTimeConfig;
  try {
    runTimeConfig = JSON.parse(fs.readFileSync(path.resolve('./_content/blog_runtime_config.json')));
  } catch (e) {
    runTimeConfig = {};
  }

  var lastRefreshDate = !runTimeConfig.VIEWS_LAST_REFRESHED ? new Date() : new Date(runTimeConfig.VIEWS_LAST_REFRESHED);
  var ONE_HOUR = 60 * 60 * 1000; /* ms */ ;
  // Check if one hour has passed since last refresh
  if ((Date.parse(new Date()) - Date.parse(lastRefreshDate)) > ONE_HOUR) {
    async.waterfall([
      function (done) {
        // retrieve google analytics for posts
        googleAnalytics.getData('2005-01-01', 'today', 'ga:pagePath', 'ga:pageviews', 'ga:pagePath=@/blog/post/', function (err, analytics) {
          if (err) {
            return done(err);
          }

          done(null, analytics)
        });
      },
      function (analytics, done) {
        Posts.find({
            publish: true
          })
          .exec((err, posts) => {
            if (err) {
              return done(err)
            }

            async.each(posts, (post, cb) => {
              post.views = _.result(_.find(analytics, {
                'pagePath': post.url
              }), 'pageviews');

              post.save(() => {
                cb()
              });
            }, (err) => {
              if (err) {
                return done(err);
              }

              done();
            })
          })
      },
      function (done) {
        runTimeConfig.VIEWS_LAST_REFRESHED = new Date();
        fs.writeFileSync(path.resolve('./_content/blog_runtime_config.json'), JSON.stringify(runTimeConfig));
        done(null);
      }
    ], (err) => {
      if (err) {
        // don't fail on error
        console.error(err);
      }

      callback(null);
    })
  } else {
    callback(null);
  }
}

function loadYears(vm, callback) {
  vm.years = [];

  // get all publish dates
  var dates = _.map(vm.posts, 'publishDate');

  // loop through dates and create list of unique years and months
  async.each(dates, function (dateString, cb) {
    var date = moment(dateString);

    var year = _.find(vm.years, {
      value: date.format('YYYY')
    });

    if (!year) {
      year = {
        value: date.format('YYYY'),
        months: []
      };
      vm.years.push(year);
    }

    var month = _.find(year.months, {
      value: date.format('MM')
    });

    if (!month) {
      month = {
        value: date.format('MM'),
        name: moment(date).format('MMMM'),
        postCount: 1
      };
      year.months.push(month);
    } else {
      month.postCount += 1;
    }

    cb(null);
  }, function (err) {
    callback(err);
  });
}

function loadTags(vm, callback) {
  // get unique array of all tags
  vm.tags = _.chain(vm.posts)
    .map('tags')
    .flatten()
    .uniq()
    .sort()
    .filter(function (el) {
      return el;
    }) // remove undefined/null values
    .map(function (tag) {
      return {
        text: tag,
        slug: slugify(tag)
      };
    })
    .value();

  callback(null);
}

exports.retrieveAllPosts = function (req, res, next) {
  // pass in view name to get appropriate meta title
  var forView = req.params.view ? req.params.view : '',
    query = {
      publish: true
    },
    vm = {
      metaTitle: forView,
      metaImage: req.protocol + '://' + req.get('host') + config.app.logo,
      metaDescription: config.app.description,
      pagination: req.pagination ? req.pagination : null
    };

  retrieveViewModel(vm, query, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }

    if (vm && !vm.posts) {
      return res.status(200).send({
        vm: vm ? vm : {},
        message: 'No posts found'
      });
    }

    res.status(200).send({
      vm: vm
    });
  });
}

exports.retrievePostsBySearch = function (req, res, next) {
  var query = _.trim(req.params.searchText),
    vm = {
      metaTitle: 'Posts containing ' + query,
      metaImage: req.protocol + '://' + req.get('host') + config.app.logo,
      pageHeader: 'Posts containing "' + query + '" :',
      pagination: req.pagination ? req.pagination : null
    };

  retrieveViewModel(vm, query, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }

    if (vm && !vm.posts) {
      return res.status(200).send({
        vm: vm ? vm : {},
        message: 'No posts found'
      });
    }

    res.status(200).send({
      vm: vm
    });
  });
}

exports.retrievePostsByTag = function (req, res, next) {
  // always return only published posts
  //query by tag
  var queryTag = "^" + _.replace(req.params.tag, '-', '.*')
  var query = {
      publish: true,
      tags: new RegExp(queryTag, "i")
    },
    // meta info
    vm = {
      metaTitle: 'Posts tagged ' + _.replace(req.params.tag, '-', ' '),
      metaImage: req.protocol + '://' + req.get('host') + config.app.logo,
      pageHeader: 'Posts tagged "' + _.replace(req.params.tag, '-', ' ') + '" :',
      pagination: req.pagination ? req.pagination : null
    };
  retrieveViewModel(vm, query, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }

    if (vm && !vm.posts) {
      return res.status(200).send({
        vm: vm ? vm : {},
        message: 'No posts found'
      });
    }

    res.status(200).send({
      vm: vm
    });
  });
}

exports.retrievePostsByDate = function (req, res, next) {
  // always return only published posts
  //query by date
  var queryDate = "^" + req.params.year + ".*" + req.params.month + ".*",
    query = {
      publish: true,
      publishDate: new RegExp(queryDate)
    },
    // meta info
    vm = {
      metaTitle: 'Posts for ' + moment(req.params.month, 'MM').format('MMMM') + ' ' + req.params.year,
      metaImage: req.protocol + '://' + req.get('host') + config.app.logo,
      pageHeader: 'Posts for ' + moment(req.params.month, 'MM').format('MMMM') + ' ' + req.params.year + ' :',
      pagination: req.pagination ? req.pagination : null
    };
  retrieveViewModel(vm, query, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }

    if (vm && !vm.posts) {
      return res.status(200).send({
        vm: vm ? vm : {},
        message: 'No posts found'
      });
    }

    res.status(200).send({
      vm: vm
    });
  });
}

exports.retrievePostsByAuthor = function (req, res, next) {

  User.findOne({
      _id: req.params.authorId
    }, {
      displayName: 1,
      about: 1,
      email: 1,
      avatarUrl: 1,
      workplace: 1,
      location: 1,
      education: 1,
      created: 1,
      twitterUrl: 1,
      facebookUrl: 1,
      githubUrl: 1,
      linkedinUrl: 1,
      stackOverflowUrl: 1,
      personalUrl: 1
    })
    .lean()
    .exec(function (err, account) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      } else if (!account) {
        // redirect to home page if there are no posts with author
        return res.status(200).send({
          message: 'Author not found'
        });
      }

      // always return only published posts
      //query by date
      var query = {
          publish: true,
          authorId: req.params.authorId
        },
        vm = {
          metaTitle: 'Posts by ' + account.displayName,
          metaImage: req.protocol + '://' + req.get('host') + config.app.logo,
          pageHeader: 'Posts by ' + account.displayName + ' :',
          pagination: req.pagination ? req.pagination : null,
          author: {
            name: account.displayName,
            about: account.about,
            email: account.email,
            avatar: account.avatarUrl,
            workplace: account.workplace,
            location: account.location,
            education: account.education,
            created: account.created,
            twitterUrl: account.twitterUrl,
            facebookUrl: account.facebookUrl,
            githubUrl: account.githubUrl,
            linkedinUrl: account.linkedinUrl,
            stackOverflowUrl: account.stackOverflowUrl,
            personalUrl: account.personalUrl
          }
        };

      retrieveViewModel(vm, query, function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          })
        }

        if (vm && !vm.posts) {
          return res.status(200).send({
            vm: vm ? vm : {},
            message: 'No posts found'
          });
        }

        res.status(200).send({
          vm: vm
        });
      });
    });
}

// retrieve and transform published blog posts
function retrieveViewModel(vm, query, callback) {
  async.waterfall([
      function (done) {
        //check if query is search text
        if (typeof query === 'string') {
          Posts.findText(query, vm.pagination, function (err, posts, totalCount) {
            if (err) {
              return done({
                message: errorHandler.getErrorMessage(err)
              });
            }

            if (vm.pagination) {
              vm.pagination.collectionSize = totalCount;
            }

            done(null, posts);
          });
        } else {
          var options = {};
          if (vm.pagination) {
            options.skip = vm.pagination.page_size * (vm.pagination.page_number - 1);
            options.limit = vm.pagination.page_size;
          }

          Posts.countDocuments(query).exec(function (err, totalCount) {
            if (err) {
              return callback(err.name + ': ' + err.message);
            }

            Posts.find(query, {
                url: 1,
                tags: 1,
                authorId: 1,
                thumbnailUrl: 1,
                title: 1,
                publishDate: 1,
                summary: 1,
                views: 1
              }, options).sort({
                publishDate: -1
              })
              .lean()
              .exec(function (err, posts) {
                if (err) {
                  return done({
                    message: errorHandler.getErrorMessage(err)
                  });
                }

                // don't proceed if there are no posts
                if (!posts.length) {
                  return done(true);
                }

                if (vm.pagination) {
                  vm.pagination.collectionSize = totalCount;
                }

                done(null, posts);
              });
          })
        }
      },
      function (posts, done) { //, analytics
        // loop through each post and set meta data
        async.each(posts, (post, cb) => {
          //slugify tags
          post.slugTags = _.map(post.tags, function (tag) {
            return {
              text: _.trim(tag),
              slug: slugify(tag)
            };
          });

          post.showImage = false;

          User.findById(post.authorId, {
              displayName: 1
            })
            .lean()
            .exec(function (err, account) {
              if (err) {
                return cb(err);
              } else if (!account) {
                return cb(null);
              }

              // add author's information to posts
              post.authorName = account.displayName;

              cb(null);
            });
        }, function (err) {
          if (err) {
            return done({
              message: errorHandler.getErrorMessage(err)
            });
          }

          done(null, posts);
        });
      },
    ],
    function (err, result) {
      if (err && err.message) {
        return callback(err.message);
      }

      vm.posts = result ? result : null;

      callback(null);
    })
}

// post by id route (permalink used by disqus comments plugin)
exports.retrievePostByID = function (req, res) {
  if (!req.query.id) {
    return res.status(404).send({
      message: 'Not found'
    });
  }

  // find by post id or disqus id (old post id)
  Posts.findById(req.query.id, {
      publishDate: 1,
      slug: 1
    })
    .lean()
    .exec((err, post) => {
      if (err) {
        return res.status(404).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!post) {
        return res.status(404).send({
          message: 'Not found'
        });
      }

      // 301 redirect to main post url
      var postUrl = '/blog/post/' + moment(post.publishDate).format('YYYY/MM/DD') + '/' + post.slug;
      return res.redirect(301, postUrl);
    })
};

// post details route
exports.retrievePostByDetails = function (req, res) {
  var hostDomain = req.protocol + '://' + req.get('host');

  async.waterfall([
    function (callback) {
      Posts.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug, function (err, post) {
        if (err) {
          return callback(err)
        } else if (!post) {
          return callback('Post not found');
        }

        //  permalink used by disqus comment and social links
        post.perma_link = hostDomain + '/api/blog/post?id=' + post._id;

        post.url = hostDomain + post.url;

        // slugify post tags
        post.slugTags = _.map(post.tags, function (tag) {
          return {
            text: tag,
            slug: slugify(tag)
          };
        });

        callback(null, post)
      })
    },
    function (post, callback) {
      //retireve author's information
      User.findById(post.authorId, {
          displayName: 1,
          about: 1,
          email: 1,
          avatarUrl: 1,
          workplace: 1,
          location: 1,
          education: 1,
          created: 1,
          twitterUrl: 1,
          facebookUrl: 1,
          githubUrl: 1,
          linkedinUrl: 1,
          stackOverflowUrl: 1,
          personalUrl: 1
        })
        .lean()
        .exec(function (err, account) {
          if (err) {
            return callback(err);
          }

          // add author's information to posts
          post.author = {
            name: account.displayName,
            about: account.about,
            email: account.email,
            avatar: account.avatarUrl,
            workplace: account.workplace,
            location: account.location,
            education: account.education,
            created: account.created,
            twitterUrl: account.twitterUrl,
            facebookUrl: account.facebookUrl,
            githubUrl: account.githubUrl,
            linkedinUrl: account.linkedinUrl,
            stackOverflowUrl: account.stackOverflowUrl,
            personalUrl: account.personalUrl
          };

          callback(null, post);
        });
    }
  ], function (err, post) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    // meta tags
    var vm = {};
    vm.metaTitle = post.title;
    vm.metaDescription = post.summary;
    vm.post = post ? post : {};

    res.status(200).send({
      vm: vm ? vm : []
    })
  })
};

exports.retrievePageDetails = function (req, res, next) {
  var vm = {};

  Pages.getBySlug(req.params.slug, function (err, page) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!page) {
      return res.status(404).send({
        message: 'Not found'
      })
    };

    vm.page = page;

    // meta tags
    vm.metaTitle = vm.page.title;
    vm.metaDescription = vm.page.description;

    res.status(200).send({
      vm: vm ? vm : []
    })
  })
};
