'use strict';

module.exports = function (app) {
    var pages = require('./pages.server.controller');

    app.route('/api/admin/pages')
        .get(pages.getAll)
        .post(pages.create);
    app.route('/api/admin/pages/:_id')
        .get(pages.getById)
        .put(pages.update)
        .delete(pages._delete);
};