'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  app: {
    title: defaultEnvConfig.app.title + ' - Development'
  },
  splunkUrl: 'http://10.16.7.195:8088/services/collector',
  splunkToken: 'replace-with-spunk',
  mongoDB: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/meancore-cms-dev',
    options: {},
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  oracleDB: {
    // rms: {
    //     'connectString': process.env.DB_RMS_NAME || '',
    //     'poolMin': 4,
    //     'poolMax': 200,
    //     'poolIncrement': 4,
    //     'poolTimeout': 60,
    //     'user': process.env.DB_RMS_USER || 'API_USER',
    //     'password': process.env.DB_RMS_PASS || 'API_USER',
    //     'queueRequests': true,
    //     'queueTimeout': 0
    // },
  },
  mssqlDB: {
    // gppyrl: {
    //     'user': '',
    //     'password': '',
    //     'server': '',
    //     'database': '',
    //     'requestTimeout': 300000,
    //     'pool': {
    //         'max': 10,
    //         'min': 4,
    //         'idleTimeoutMillis': 30000
    //     },
    //     'options': {
    //         'useColumnNames': false
    //     }
    // }
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2
    }
  },
  ldap: {
    server: {
      url: process.env.LDAP_URL || 'ldap://localhost:389',
      bindDn: process.env.LDAP_DN || 'CN=LDAP1,OU=Service Accounts,OU=MEANcore Users,DC=MEANcore,DC=local',
      bindCredentials: process.env.LDAP_SECRET || 'LDAP_SECRET',
      searchBase: process.env.LDAP_SEARCH_BASE || 'DC=MEANcore,DC=local',
      searchFilter: process.env.LDAP_SEARCH_FILTER || '(&(objectCategory=person)(objectClass=user)(|(sAMAccountName={{username}})(mail={{username}})))' // login with username or email
    }
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/auth/google/callback',
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/auth/github/callback'
  },
  mailer: {
    test: process.env.MAILER_TEST || true,
    from: process.env.MAILER_FROM || 'test@meancore.com',
    options: {
      // using ethereal email for development
      host: process.env.MAILER_HOST || "smtp.ethereal.email",
      service: process.env.MAILER_SERVICE_PROVIDER || '',
      port: process.env.MAILER_PORT || 587,
      //  secure: true, // true = use TLS, false = upgrade later with STARTTLS
      auth: {
        user: process.env.MAILER_USER || "username",
        pass: process.env.MAILER_PASS || "pass"
      },
      //SNMP
      //   tls: {
      //     // do not fail on invalid certs
      //     rejectUnauthorized: false,
      //     ciphers: 'SSLv3'
      //   }
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED || 'false',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS || 'false'
    },
    // Order of collections in configuration will determine order of seeding.
    // i.e. given these settings, the User seeds will be complete before
    // Article seed is performed.
    collections: [{
      model: 'Features',
      docs: [{
        data: {
          name: 'UAC',
          route: '/uac',
          permissions: [{
            name: 'default'
          }]
        }
      },{
        data: {
          name: 'Blog',
          route: '/blog'
        }
      },{
        data: {
          name: 'Admin',
          route: '/admin',
          permissions: [{
            name: 'default'
          }]
        }
      }]
    }, {
      model: 'Roles',
      docs: [{
        data: {
          name: 'admin',
          featurePermissions: ['uac:default', 'admin:default']
        }
      }, {
        data: {
          name: 'user'
        }
      }]
    }, {
      model: 'User',
      docs: [{
        data: {
          username: 'local-admin',
          email: 'admin@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          roles: ['admin', 'user']
        }
      }, {
        // Set to true to overwrite this document
        // when it already exists in the collection.
        // If set to false, or missing, the seed operation
        // will skip this document to avoid overwriting it.
        overwrite: true,
        data: {
          username: 'local-user',
          email: 'user@localhost.com',
          firstName: 'User',
          lastName: 'Local',
          roles: ['user']
        }
      }]
    }]
  }
};
