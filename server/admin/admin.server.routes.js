import {
  resolve
} from 'path';
import url from 'url';

export default async (app) => {

  const userAuthPath = url.pathToFileURL(resolve('./modules/core/server/users/users.authorization.server.controller.js')).href;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const userAuth = await import(userAuthPath);

  app.use(['/admin'], userAuth.hasAuthorization(['admin'], app.locals.config.appBase));
}
