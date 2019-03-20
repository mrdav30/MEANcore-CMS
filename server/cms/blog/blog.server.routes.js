'use strict';

var path = require('path');

module.exports = function (app) {
  var blog = require('./blog.server.controller'),
    pagination = require(path.resolve('./server/middleware/pagination'));

  app.use('/api/blog', blog.checkForRedirects);

  app.route('/api/blog/sharedData')
    .get(blog.retrieveSharedData);

  app.route('/api/blog/posts/:view')
    .get(pagination, blog.retrieveAllPosts, blog.sendViewModel);
  app.route('/api/blog/posts/search/:searchText')
    .get(pagination, blog.retrievePostsBySearch, blog.sendViewModel);
  // posts for tag route
  app.route('/api/blog/posts/tag/:tag')
    .get(pagination, blog.retrievePostsByTag, blog.sendViewModel);
  // posts for date route
  app.route('/api/blog/posts/date/:year/:month')
    .get(pagination, blog.retrievePostsByDate, blog.sendViewModel);
  // posts for author route
  app.route('/api/blog/posts/author/:authorId')
    .get(pagination, blog.retrievePostsByAuthor, blog.sendViewModel);

  // post by id route (permalink used by disqus comments plugin)
  app.route('/api/blog/post').get(blog.retrievePostByID);
  // post details route
  app.route('/api/blog/post/details/:year/:month/:day/:slug').get(blog.retrievePostByDetails);

  // page details route
  app.route('/api/blog/page/:slug').get(blog.retrievePageDetails);
};
