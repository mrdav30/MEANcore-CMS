'use strict';

module.exports = function (app) {
    var posts = require('./posts.server.controller');

    app.route('/api/admin/posts')
        .get(posts.getAll)
        .post(posts.create);
    app.route('/api/admin/posts/:_id')
        .get(posts.getById)
        .put(posts.update)
        .delete(posts._delete);
};