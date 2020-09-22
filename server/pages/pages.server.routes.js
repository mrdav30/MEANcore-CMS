import * as pages from './pages.server.controller.js';

export default (app) => {
    app.route('/api/admin/pages')
        .get(pages.getAll)
        .post(pages.create);
    app.route('/api/admin/pages/:_id')
        .get(pages.getById)
        .put(pages.update)
        .delete(pages._delete);
}
