export const app = {
  title: 'MEANcore-CMS - MeanStack CMS!',
  name: 'meancore-cms',
  description: 'Applications running on mean stack',
  keywords: 'mongodb, express, angular2+, typescript, node.js, mongoose, passport',
  logo: process.env.APP_LOGO || '',
  appBaseUrl: process.env.APP_BASE_URL || '/',
  apiBaseUrl: process.env.API_BASE_URL || 'api',
  defaultPage: 'index.html'
};
export const sessionSecret = process.env.SESSION_SECRET || 'MEANcore-CMS';
export const sessionKey = process.env.SESSION_KEY || 'sessionId-CMS';
export const sessionCollection = process.env.SESSION_COLLECTION || 'sessions-cms';
export const illegalUsernames = ['meancorecms', 'meancore-cms'];
export const cps = {
  // Specify directives as normal.
  directives: {
    connectSrc: [
      'https://links.services.disqus.com/api/'
    ],
    scriptSrc: [
      'https://cdn.embedly.com/',
      'https://meancore-cms.disqus.com/',
      'https://disqus.com/next/',
      'https://c.disquscdn.com/next/embed/'
    ],
    styleSrc: ['https://c.disquscdn.com/next/embed/styles/', ],
    frameSrc: ['https://disqus.com'],
    imgSrc: [
      'https://referrer.disqus.com/juggler/',
      'https://c.disquscdn.com/next/embed/assets/img/',
      'https://links.services.disqus.com/api/',
      'https://cdn.viglink.com/images/',
      'https://www.gravatar.com/avatar/'
    ]
  }
};
export const uploads = {
  images: {
    options: {
      posts: {
        finalDest: 'posts',
        maxAge: (24 * 60 * 60 * 30) * 1000, // 30 days in milliseconds
        index: false
      },
      pages: {
        finalDest: 'pages',
        maxAge: (24 * 60 * 60 * 30) * 1000, // 30 days in milliseconds
        index: false
      }
    }
  }
};
export const agenda = {
  JOB_TYPES: 'remove-nonsubscribers',
  DEFAULT_JOBS: [{
    jobName: 'remove-nonsubscribers',
    schedule: '5 minutes',
    repeat: true,
    repeatInterval: '1 hour'
  }]
};
