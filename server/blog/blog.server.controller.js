import async from 'async';
import moment from 'moment';
import {
  resolve
} from 'path';
import fs from 'fs';
import _ from 'lodash';
import mongoose from 'mongoose';
const Pages = mongoose.model('Pages');
const Posts = mongoose.model('Posts');
const Redirects = mongoose.model('Redirects');
const User = mongoose.model('User');

export const checkForRedirects = (req, res, next) => {
  const config = req.app.locals.config;
  const url = req.url.toLowerCase();

  // redirects entered into cms
  Redirects.getByFrom(url, (err, redirect) => {
    if (err) {
      return res.status(400).send({
        message: config.helpers.config.helpers.getErrorMessage(err)
      });
    }

    if (redirect) {
      // 301 redirect to new url
      return res.redirect(301, redirect.TO);
    }

    next();
  });
}

export const retrieveSharedData = (req, res) => {
  const config = req.app.locals.config;
  let vm = {};
  async.series([
    (callback) =>{
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
    (callback) => {
      refreshPostViews(config, callback)
    },
    (callback) => {
      loadYears(vm, callback);
    },
    (callback) => {
      loadTags(config, vm, callback);
    }
  ], (err) => {
    if (err) {
      return res.status(400).send({
        message: config.helpers.config.helpers.getErrorMessage(err)
      });
    }

    // posts data no longer required
    delete vm.posts;

    res.status(200).send({
      vm: vm ? vm : {}
    })
  })
}

const refreshPostViews = (config, callback) =>  {
  let runTimeConfig;
  try {
    runTimeConfig = JSON.parse(fs.readFileSync(resolve('./_content/blog_runtime_config.json')));
  } catch (e) {
    runTimeConfig = {};
  }


  const lastRefreshDate = !runTimeConfig.VIEWS_LAST_REFRESHED ? new Date() : new Date(runTimeConfig.VIEWS_LAST_REFRESHED);
  const ONE_HOUR = 60 * 60 * 1000; /* ms */
  // Check if one hour has passed since last refresh
  if ((Date.parse(new Date()) - Date.parse(lastRefreshDate)) > ONE_HOUR) {
    async.waterfall([
      (done) => {
        // retrieve google analytics for posts
        config.services.getData(config, '2005-01-01', 'today', 'ga:pagePath', 'ga:pageviews', 'ga:pagePath=@/blog/post/', (err, analytics) => {
          if (err) {
            return done(err);
          }

          done(null, analytics)
        });
      },
      (analytics, done) => {
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
      (done) => {
        runTimeConfig.VIEWS_LAST_REFRESHED = new Date();
        fs.writeFileSync(resolve('./_content/blog_runtime_config.json'), JSON.stringify(runTimeConfig));
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

    if(runTimeConfig && Object.keys(runTimeConfig).length === 0 && runTimeConfig.constructor === Object){
      runTimeConfig.VIEWS_LAST_REFRESHED = new Date();
      fs.writeFileSync(resolve('./_content/blog_runtime_config.json'), JSON.stringify(runTimeConfig));
    }

    callback(null);
  }
}

const loadYears = (vm, callback) => {
  vm.years = [];

  // get all publish dates
  const dates = _.map(vm.posts, 'publishDate');

  // loop through dates and create list of unique years and months
  async.each(dates, (dateString, cb) => {
    const date = moment(dateString);

    let year = _.find(vm.years, {
      value: date.format('YYYY')
    });

    if (!year) {
      year = {
        value: date.format('YYYY'),
        months: []
      };
      vm.years.push(year);
    }

    let month = _.find(year.months, {
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
  }, (err) => {
    callback(err);
  });
}

const loadTags = (config, vm, callback) => {
  // get unique array of all tags
  vm.tags = _.chain(vm.posts)
    .map('tags')
    .flatten()
    .uniq()
    .sort()
    .filter((el) => {
      return el;
    }) // remove undefined/null values
    .map((tag) => {
      return {
        text: tag,
        slug: config.helpers.slugify(tag)
      };
    })
    .value();

  callback(null);
}

export const retrieveAllPosts = (req, res) => {
  const config = req.app.locals.config;
  // pass in view name to get appropriate meta title
  const forView = req.params.view ? req.params.view : '',
    query = {
      publish: true
    },
    vm = {
      metaTitle: forView,
      metaImage: req.protocol + '://' + req.get('host') + config.app.logo,
      metaDescription: config.app.description,
      pagination: req.pagination ? req.pagination : null
    };

  retrieveViewModel(config, vm, query, (err) => {
    if (err) {
      return res.status(400).send({
        message: config.helpers.getErrorMessage(err)
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

export const retrievePostsBySearch = (req, res) => {
  const config = req.app.locals.config;
  const query = _.trim(req.params.searchText),
    vm = {
      metaTitle: 'Posts containing ' + query,
      metaImage: req.protocol + '://' + req.get('host') + config.app.logo,
      pageHeader: 'Posts containing "' + query + '" :',
      pagination: req.pagination ? req.pagination : null
    };

  retrieveViewModel(config, vm, query, (err) => {
    if (err) {
      return res.status(400).send({
        message: config.helpers.getErrorMessage(err)
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

export const retrievePostsByTag = (req, res) => {
  const config = req.app.locals.config;
  // always return only published posts
  //query by tag
  const queryTag = "^" + _.replace(req.params.tag, '-', '.*')
  const query = {
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
  retrieveViewModel(config, vm, query, (err) => {
    if (err) {
      return res.status(400).send({
        message: config.helpers.getErrorMessage(err)
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

export const retrievePostsByDate = (req, res) => {
  const config = req.app.locals.config;
  // always return only published posts
  //query by date
  const queryDate = "^" + req.params.year + ".*" + req.params.month + ".*",
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
  retrieveViewModel(config, vm, query, (err) => {
    if (err) {
      return res.status(400).send({
        message: config.helpers.getErrorMessage(err)
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

export const retrievePostsByAuthor = (req, res) => {
  const config = req.app.locals.config;
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
    .exec((err, account) => {
      if (err) {
        return res.status(400).send({
          message: config.helpers.getErrorMessage(err)
        })
      } else if (!account) {
        // redirect to home page if there are no posts with author
        return res.status(200).send({
          message: 'Author not found'
        });
      }

      // always return only published posts
      //query by date
      const query = {
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

      retrieveViewModel(config, vm, query, (err) => {
        if (err) {
          return res.status(400).send({
            message: config.helpers.getErrorMessage(err)
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
const retrieveViewModel = (config, vm, query, callback) => {
  async.waterfall([
      (done) => {
        //check if query is search text
        if (typeof query === 'string') {
          Posts.findText(query, vm.pagination, (err, posts, totalCount) => {
            if (err) {
              return done({
                message: config.helpers.getErrorMessage(err)
              });
            }

            if (vm.pagination) {
              vm.pagination.collectionSize = totalCount;
            }

            done(null, posts);
          });
        } else {
          let options = {};
          if (vm.pagination) {
            options.skip = vm.pagination.page_size * (vm.pagination.page_number - 1);
            options.limit = vm.pagination.page_size;
          }

          Posts.countDocuments(query).exec((err, totalCount) => {
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
                views: 1,
                readTime: 1
              }, options).sort({
                publishDate: -1
              })
              .lean()
              .exec((err, posts) => {
                if (err) {
                  return done({
                    message: config.helpers.getErrorMessage(err)
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
      (posts, done) => {
        // loop through each post and set meta data
        async.each(posts, (post, cb) => {
          //slugify tags
          post.slugTags = _.map(post.tags, (tag) => {
            return {
              text: _.trim(tag),
              slug: config.helpers.slugify(tag)
            };
          });

          post.showImage = false;

          User.findById(post.authorId, {
              displayName: 1
            })
            .lean()
            .exec((err, account) => {
              if (err) {
                return cb(err);
              } else if (!account) {
                return cb(null);
              }

              // add author's information to posts
              post.authorName = account.displayName;

              cb(null);
            });
        }, (err) => {
          if (err) {
            return done({
              message: config.helpers.getErrorMessage(err)
            });
          }

          done(null, posts);
        });
      },
    ],
    (err, result) => {
      if (err && err.message) {
        return callback(err.message);
      }

      vm.posts = result ? result : null;

      callback(null);
    })
}

// post by id route (permalink used by disqus comments plugin)
export const retrievePostByID = (req, res) => {
  const config = req.app.locals.config;
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
          message: config.helpers.getErrorMessage(err)
        });
      } else if (!post) {
        return res.status(404).send({
          message: 'Not found'
        });
      }

      // 301 redirect to main post url
      const postUrl = '/blog/post/' + moment(post.publishDate).format('YYYY/MM/DD') + '/' + post.slug;
      return res.redirect(301, postUrl);
    })
}

// post details route
export const retrievePostByDetails = (req, res) => {
  const config = req.app.locals.config;
  const hostDomain = req.protocol + '://' + req.get('host');

  async.waterfall([
    (callback) => {
      Posts.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug, (err, post) => {
        if (err) {
          return callback(err)
        } else if (!post) {
          return callback('Post not found');
        }

        //  permalink used by disqus comment and social links
        post.perma_link = hostDomain + '/api/blog/post?id=' + post._id;

        post.url = hostDomain + post.url;

        // slugify post tags
        post.slugTags = _.map(post.tags, (tag) => {
          return {
            text: tag,
            slug: config.helpers.slugify(tag)
          };
        });

        callback(null, post)
      })
    },
    (post, callback) => {
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
        .exec((err, account) => {
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
  ], (err, post) => {
    if (err) {
      return res.status(400).send({
        message: config.helpers.getErrorMessage(err)
      });
    }

    // meta tags
    let vm = {};
    vm.metaTitle = post.title;
    vm.metaDescription = post.summary;
    vm.post = post ? post : {};

    res.status(200).send({
      vm: vm ? vm : []
    })
  })
}

export const retrievePageDetails = (req, res) => {
  const config = req.app.locals.config;
  let vm = {};

  Pages.getBySlug(req.params.slug, (err, page) => {
    if (err) {
      return res.status(400).send({
        message: config.helpers.getErrorMessage(err)
      });
    } else if (!page) {
      return res.status(404).send({
        message: 'Not found'
      })
    }

    vm.page = page;

    // meta tags
    vm.metaTitle = vm.page.title;
    vm.metaDescription = vm.page.description;

    res.status(200).send({
      vm: vm ? vm : []
    })
  })
}
