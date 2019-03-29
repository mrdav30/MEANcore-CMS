[![MEANcore-CMS Logo](https://github.com/mrdav30/MEANcore-CMS/blob/meancore-cms/client/assets/images/logo.png)](https://github.com/mrdav30/MEANcore-CMS)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/MEANcore-CMS/community#)
[![Dependencies Status](https://david-dm.org/mrdav30/MEANcore-CMS.svg)](https://david-dm.org/mrdav30/MEANcore-CMS)
[![devDependencies Status](https://david-dm.org/mrdav30/MEANcore-CMS/dev-status.svg)](https://david-dm.org/mrdav30/MEANcore-CMS?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/mrdav30/MEANcore-CMS/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mrdav30/MEANcore-CMS?targetFile=package.json)

# MEANcore-CMS

MEANcore-CMS is a blogging platform built using [MEANcore](https://github.com/mrdav30/MEANcore). MEANcore-CMS has been designed with developers in mind, to be easily extensible and customisable throughout the code base.

Check out the platform in action by visiting our blog powered by MEANcore-CMS, [Techievor](https://techievor.com).

Checkout our blog [Techievor](https://techievor.com) built on meancore for a full rundown on how to setup the MEAN stack with MEANcore:
* [Windows](https://techievor.com/blog/post/2019/02/28/how-to-install-the-mean-stack-on-windows)
* [CentOS](https://techievor.com/blog/post/2019/03/03/how-to-install-the-mean-stack-on-centos)

## Prerequisites
Review the steps for [MEANcore](https://github.com/mrdav30/MEANcore) before getting started.

Or you can checkout [Techievor](https://techievor.com) for a full rundown on [how to setup MEANcore-CMS](https://techievor.com/blog/post/2019/03/05/meancore-cms-mean-stack-cms-blogging-platform)

# Getting started

1. Go to project folder and create a .env file to setup your environment
```
NODE_ENV='development'
PRODUCTION=false
DOMAIN=
DOMAIN_PATTERN=
HOST_SECURE=
PROXY=

APP_NAME='meancore-cms'
APP_LOGO='assets/images/logo.png'
APP_DEFAULT_ROUTE='home'
APP_BASE_URL='/'
API_BASE_URL='api'
IMAGE_BASE_URL='/image-uploads'
IMAGE_STORAGE='./_content/image-uploads/'
TWITTER_HANDLE=''
META_TITLE_SUFFIX=' | The MEANcore Blog'

SESSION_SECRET='MEANCORE-CMS'
SESSION_KEY='meancore-cms-key'
SESSION_COLLECTION='meancore-cms-sessions'

GOOGLE_ANALYTICS_ID=''
GOOGLE_CLIENT_EMAIL=''
GOOGLE_PRIVATE_KEY=""
GOOGLE_VIEW_ID=
RECAPTCHA_SECRET_KEY=''
RECAPTCHA_SITE_KEY=''

MAILER_FROM='support@meancorecms.com'
MAILER_SERVICE_PROVIDER=
MAILER_HOST='smtp.ethereal.email'
MAILER_PORT=587
MAILER_USER="username"
MAILER_SECRET="pass"
MAILER_TEST=true
```

2. Next install dependencies:
 ```bash
 npm install
 ```

3. Then launch development server, and open `localhost:4200` in your browser:
 ```bash
 npm run start:dev
 ```

4. Run the MongoDB Seed
To have the default menu feature(s), role(s), and/or user account(s) at runtime:
```bash
npm run seed
```
This will try to seed the features, roles, and users based on the defined NODE_ENV in your env config. You have to copy the user passwords from the console and store it somewhere safe.

5. Running with TLS (Optional)
The application will start by default with the secuire configuration (SSL mode) turned off and listen on port 3000.  To run your application in a secure manner, you'll need to use OpenSSL and generate a set of self-signed certificates.  Unix-based users can use the following command:
```bash
npm run generate-ssl-certs
```
Windows users can follow the instructions found [here](https://support.citrix.com/article/CTX128656).  After you've generated the key and certificate, ensure they are placed in the config/sslcerts folder.

To enable/disable SSL mode in a production environment, set the HOST_SECURE variable in your env config.

## Contributing
We welcome pull requests from the community! Just be sure to read the [contributing](https://github.com/mrdav30/MEANcore-CMS/blob/meancore-cms/CONTRIBUTING.MD) doc to get started.

# License

[License](https://github.com/mrdav30/MEANcore-CMS/blob/meancore-cms/LICENSE.MD)
