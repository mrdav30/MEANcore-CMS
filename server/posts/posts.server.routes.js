import * as posts from './posts.server.controller.js';

export default (app) => {
    app.route('/api/admin/posts')
        .get(posts.getAll)
        .post(posts.create);
    app.route('/api/admin/posts/:_id')
        .get(posts.getById)
        .put(posts.update)
        .delete(posts._delete);
}
