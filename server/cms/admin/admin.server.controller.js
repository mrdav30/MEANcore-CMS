'use strict';

var path = require('path'),
    multer = require('multer'),
    _ = require('lodash'),
    config = require(path.resolve('./config/config')),
    fs = require("fs"),
    slugify = config.helpers.slugify,
    fileExists = config.helpers.fileExists;

exports.checkInstall = function (req, res, next) {

    try {
        config.installed = JSON.parse(fs.readFileSync(path.resolve(config.staticFiles + 'assets/install.json')));
    } catch (e) {
        config.installed = false;
        fs.writeFileSync(path.resolve(config.staticFiles + 'assets/install.json'), JSON.stringify(false));
    }

    if (!config.installed && req.path !== '/sign-up/install') {
        return res.redirect('sign-up/install');
    }

    next();
}

exports.upload = function (req, res, next) {
    // respond with image url
    res.status(200).send({
        "uploaded": true,
        "url": './api/admin/image-uploads/' + req.file.filename
    });
}

var getUpload = function () {
    // file upload config using multer
    var uploadDir = config.imageUploadRepository;

    var storage = multer.diskStorage({
        destination: uploadDir,
        filename: function (req, file, cb) {
            var fileExtension = path.extname(file.originalname);
            var fileBase = path.basename(file.originalname, fileExtension);
            var fileSlug = slugify(fileBase) + fileExtension;

            // ensure file name is unique by adding a counter suffix if the file exists
            var fileCounter = 0;
            while (fileExists(path.join(uploadDir, fileSlug))) {
                fileCounter += 1;
                fileSlug = slugify(fileBase) + '-' + fileCounter + fileExtension;
            }

            cb(null, fileSlug);
        }
    });
    var upload = multer({
        storage: storage
    });

    return upload;
}
exports.getUpload = getUpload;