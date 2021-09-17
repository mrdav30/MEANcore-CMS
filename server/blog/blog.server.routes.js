import * as blog from './blog.server.controller.js';

export default (app) => {
  app.use('/api/blog', blog.checkForRedirects);

  app.route('/api/blog/sharedData')
    .get(blog.retrieveSharedData);

  app.route('/api/blog/posts/:view')
    .get(app.locals.config.helpers.pagination, blog.retrieveAllPosts);
  app.route('/api/blog/posts/search/:searchText')
    .get(app.locals.config.helpers.pagination, blog.retrievePostsBySearch);
  // posts for tag route
  app.route('/api/blog/posts/tag/:tag')
    .get(app.locals.config.helpers.pagination, blog.retrievePostsByTag);
  // posts for date route
  app.route('/api/blog/posts/date/:year/:month')
    .get(app.locals.config.helpers.pagination, blog.retrievePostsByDate);
  // posts for author route
  app.route('/api/blog/posts/author/:authorId')
    .get(app.locals.config.helpers.pagination, blog.retrievePostsByAuthor);

  // post by id route (permalink used by disqus comments plugin)
  app.route('/api/blog/post').get(blog.retrievePostByID);
  // post detail routes
  app.route('/api/blog/post/details/:year/:month/:day/:slug').get(blog.retrievePostByDetails);
  app.route('/api/blog/post/details/:slug').get(blog.retrievePostByDetails);

  // page details route
  app.route('/api/page/:slug').get(blog.retrievePageDetails);
}