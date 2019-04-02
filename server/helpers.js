var fileExists = require('./helpers/file-exists'),
    flattenData = require('./helpers/flatten-data'),
    pager = require('./helpers/pager'),
    shiftKeyCase = require('./helpers/shift-key-case'),
    slugify = require('./helpers/slugify'),
    fileProxy = require('./helpers/file-proxy'),
    isBot = require('./helpers/isBot'),
    imageStorage = require('./helpers/image-storage');

module.exports = {
    fileExists,
    flattenData,
    pager,
    shiftKeyCase,
    slugify,
    fileProxy,
    isBot,
    imageStorage
};