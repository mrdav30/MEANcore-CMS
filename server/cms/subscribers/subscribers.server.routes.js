'use strict';

module.exports = function (app) {
    var subscribers = require('./subscribers.server.controller');

    app.route('/api/admin/subscribers')
        .get(subscribers.getAll);
    app.route('/api/subscribe/send_confirmation')
        .post(subscribers.sendConfirmation)
    app.route('/api/subscribe/validate/:token')
        .get(subscribers.validateSubscriptionToken)
    app.route('/api/subscribe/send_validation')
        .post(subscribers.validateSubscription)
    app.route('/api/unsubscribe/:email')
        .delete(subscribers._delete);
    app.route('/api/subscribe/get_contact')
        .get(subscribers.getContact);
};