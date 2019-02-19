'use strict';

var config = require(path.resolve('./config/config')),
    emailService = config.services.emailService;

exports.sendContactRequest = function (req, res) {
    // email data and options
    var mailOptions = {
        to: config.mailer.from,
        from: req.body.email,
        subject: req.body.subject,
        emailHTML: req.body.message
    };

    emailService.sendEmail(req, res, mailOptions, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }

        res.status(200).send({
            message: "Message sent!"
        });
    });
}