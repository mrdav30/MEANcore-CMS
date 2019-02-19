'use strict';

module.exports = function (app) {
    var redirects = require('./redirects.server.controller');

    app.route('/api/admin/redirects')
        .get(redirects.getAll)
        .post(redirects.create);
    app.route('/api/admin/redirects/:_id')
        .get(redirects.getById)
        .put(redirects.update)
        .delete(redirects._delete);
};