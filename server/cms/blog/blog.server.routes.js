'use strict';

var path = require('path');

module.exports = function (app) {
  var blog = require('./blog.server.controller'),
    pagination = require(path.resolve('./server/middleware/pagination'));

  app.use('/api/blog', blog.checkForRedirects);

  app.route('/api/blog/sharedData')
    .get(blog.retrieveSharedData);

  app.route('/api/blog/posts/:view')
    .get(pagination, blog.retrieveAllPosts);
  app.route('/api/blog/posts/search/:searchText')
    .get(pagination, blog.retrievePostsBySearch);
  // posts for tag route
  app.route('/api/blog/posts/tag/:tag')
    .get(pagination, blog.retrievePostsByTag);
  // posts for date route
  app.route('/api/blog/posts/date/:year/:month')
    .get(pagination, blog.retrievePostsByDate);
  // posts for author route
  app.route('/api/blog/posts/author/:authorId')
    .get(pagination, blog.retrievePostsByAuthor);

  // post by id route (permalink used by disqus comments plugin)
  app.route('/api/blog/post').get(blog.retrievePostByID);
  // post details route
  app.route('/api/blog/post/details/:year/:month/:day/:slug').get(blog.retrievePostByDetails);

  // page details route
  app.route('/api/page/:slug').get(blog.retrievePageDetails);
};
