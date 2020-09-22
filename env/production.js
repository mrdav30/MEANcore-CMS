export const log = {
  // logging with Morgan - https://github.com/expressjs/morgan
  // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
  format: process.env.LOG_FORMAT || 'combined',
  fileLogger: {
    directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
    fileName: process.env.LOG_FILE || 'app.cms.log',
    maxsize: 10485760,
    maxFiles: 2
  }
};
export const seedDB = {
  options: {
    logResults: process.env.MONGO_SEED_LOG_RESULTS || 'false'
  },
  // Order of collections in configuration will determine order of seeding.
  // i.e. given these settings, the Features seeds will be complete before
  // Roles seed is performed.
  collections: [{
    model: 'Features',
    docs: [{
      data: {
        name: 'Blog',
        route: '/blog',
        order_priority: 3
      }
    }, {
      data: {
        name: 'Admin',
        route: '/admin',
        permissions: [{
          name: 'default'
        }],
        order_priority: 2
      }
    }]
  }, {
    model: 'Roles',
    docs: [{
      overwrite: true,
      data: {
        name: 'admin',
        featurePermissions: ['uac:default', 'admin:default']
      }
    }]
  }]
};
