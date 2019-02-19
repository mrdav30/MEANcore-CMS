'use strict';

module.exports = function (app) {
    var subscribe = require('./subscribe.server.controller');

    app.route('/api/subscribers')
        .get(subscribe.getAll);
    app.route('/api/subscribe/send_confirmation')
        .post(subscribe.sendConfirmation)
    app.route('/api/subscribe/validate/:token')
        .get(subscribe.validateSubscriptionToken)
    app.route('/api/subscribe/send_validation')
        .post(subscribe.validateSubscription)
    app.route('/api/unsubscribe/:email')
        .delete(subscribe._delete);
    app.route('/api/subscribe/get_contact')
        .get(subscribe.getContact);
};