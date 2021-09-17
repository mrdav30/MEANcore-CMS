import * as cmsConfig from './cms-config.server.controller.js';

export default (app) => {
    app.route('/api/admin/cms-config')
        .get(cmsConfig.getConfig)
        .post(cmsConfig.create);
    app.route('/api/admin/cms-config/:_id')
        .put(cmsConfig.update);
}