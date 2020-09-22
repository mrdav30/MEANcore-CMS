import * as subscribers from './subscribers.server.controller.js';

export default (app) => {
  app.route('/api/admin/subscribers/')
    .get(subscribers.getAll);
  app.route('/api/admin/subscriber/:email')
    .get(subscribers.getByEmail);

  app.route('/api/subscribe/send_confirmation')
    .post(subscribers.sendConfirmation)
  app.route('/api/subscribe/validate/:token')
    .get(subscribers.validateSubscriptionToken)
  app.route('/api/subscribe/send_validation')
    .post(subscribers.validateSubscription)

    app.route('/api/admin/subscribers/:_id')
    .delete(subscribers._deleteById);
  // app.route('/api/unsubscribe/:email')
  //   .delete(subscribers._delete);

  app.route('/api/subscribe/get_contact')
    .get(subscribers.getContact);
}
