[![MEANcore-CMS Logo](https://github.com/mrdav30/MEANcore-CMS/blob/meancore-cms/client/assets/images/logo.png)](https://github.com/mrdav30/MEANcore-CMS)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/MEANcore-CMS/community#)
[![Dependencies Status](https://david-dm.org/mrdav30/MEANcore-CMS.svg)](https://david-dm.org/mrdav30/MEANcore-CMS)
[![devDependencies Status](https://david-dm.org/mrdav30/MEANcore-CMS/dev-status.svg)](https://david-dm.org/mrdav30/MEANcore-CMS?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/mrdav30/MEANcore-CMS/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mrdav30/MEANcore-CMS?targetFile=package.json)

# Meancore-CMS

MEANcore-CMS is a blogging platform built using [MEANcore](https://github.com/mrdav30/MEANcore). MEANcore-CMS has been designed with developers in mind, to be easily extensible and customisable throughout the code base.

## Prerequisites
Review the steps for [MEANcore](https://github.com/mrdav30/MEANcore) before getting started.

# Getting started

1. Go to project folder and create a .env file to setup your environment 
```
NODE_ENV='development'
PRODUCTION=false
DOMAIN=

APP_NAME='MEANcore-CMS'
APP_BASE_URL='/'
API_BASE_URL='api'
APP_DEFAULT_ROUTE='home'
IMAGE_UPLOAD_URL='/admin/upload'
TWITTER_HANDLE=

GOOGLE_ANALYTICS_ID=''
GOOGLE_CLIENT_EMAIL=''
GOOGLE_PRIVATE_KEY=""
GOOGLE_VIEW_ID=
RECAPTCHA_SECRET_KEY=''
RECAPTCHA_SITE_KEY=''
```

2. Next install dependencies:
 ```bash
 npm install
 ```

3. Then launch development server, and open `localhost:4200` in your browser:
 ```bash
 npm start
 ```

## Contributing
We welcome pull requests from the community! Just be sure to read the [contributing](https://github.com/mrdav30/MEANcore-CMS/blob/meancore-cms/CONTRIBUTING.MD) doc to get started.

# Licence

[License](https://github.com/mrdav30/MEANcore-CMS/blob/meancore-cms/LICENSE.MD) 
