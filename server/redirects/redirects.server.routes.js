import * as redirects from './redirects.server.controller.js';

export default (app) => {
    app.route('/api/admin/redirects')
        .get(redirects.getAll)
        .post(redirects.create);
    app.route('/api/admin/redirects/:_id')
        .get(redirects.getById)
        .put(redirects.update)
        .delete(redirects._delete);
}
