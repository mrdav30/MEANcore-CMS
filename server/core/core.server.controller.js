'use strict';

var path = require('path'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  isBot = config.helpers.isBot,
<<<<<<< HEAD
  ssrService = config.services.ssrService;
=======
  ssrService = config.services.ssrService,
  uacController = require('../user-access-control/user-access-control.server.controller');
>>>>>>> meancore-cms-dev

/**
 * Get extention from path
 */
function getExtention(url) {
  return _.split(url, '.').pop();
}

/**
 * Render the server not found responses
 */
var renderNotFound = function (req, res) {
  res.status(404).json({
    error: 'Path not found'
  });
};
exports.renderNotFound = renderNotFound;

// check for webcrawlers and prerender
// otherwise move on to render index
exports.prerender = async function (req, res, next) {
  if (!isBot(req.headers['user-agent'])) {
    return next();
  } else {
<<<<<<< HEAD

=======
>>>>>>> meancore-cms-dev
    if (req.query.prerender) {
      return next();
    } else {
      const {
        html,
        ttRenderMs
      } = await ssrService.ssr(`${req.protocol}://${req.get('host')}${req.url}?prerender=true`);
      // Add Server-Timing! See https://w3c.github.io/server-timing/.
      res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
      return res.status(200).send(html + '<!-- SSR -->'); // Serve prerendered page as response.
    }
<<<<<<< HEAD

=======
>>>>>>> meancore-cms-dev
  };
}

/**
 * Render the main application page
 */
exports.renderIndex = async function (req, res) {
  var config = req.app.locals.config;
  var ext = getExtention(req.url);
  // TODO: change the way to identify extentions
  var exts = ['html', 'css', 'js', 'pdf', 'jpeg', 'gif', 'png'];
  if (!config.app.defaultPage || ~exts.indexOf(ext)) { // if not in extentions give 404
    renderNotFound(req, res); // We know its not found
  } else {
    var rootDir = path.normalize(config.staticFiles);
    res.sendFile(config.app.defaultPage, {
      root: rootDir
    });
  }
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).send({
    error: 'Oops! Something went wrong...'
  });
};
