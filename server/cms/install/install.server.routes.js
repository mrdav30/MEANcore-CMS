'use strict';

module.exports = function (app) {
    var install = require('./install.server.controller');

    app.route('/api/install').post(install.createAdministrator);
};