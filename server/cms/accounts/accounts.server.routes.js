'use strict';

module.exports = function (app) {
    var account = require('./accounts.server.controller');

    app.route('/api/admin/accounts/current').get(account.getCurrentAccount);
    app.route('/api/admin/accounts/:_id')
        .get(account.getById)
        .put(account.updateAccount)
        .delete(account.deleteAccount)
};