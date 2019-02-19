import { VERSION } from './version';

// Define menu config as:
// MENU_CONFIG: [{ label: string; route: string; permission: string[]; visible: boolean; }];

export const environment = {
  production: true,
  version: VERSION.version,
  appLogo: 'assets/images/logo.png',
  appDefaultRoute: 'home',
  appName: 'MEANcore-CMS',
  appBase: '/',
  appEndPoint: 'api',
  MENU_CONFIG: [{
    label: 'Blog',
    route: '/blog',
    roles: ['user', 'admin'],
    permission: null,
    visible: true
  },
  {
    label: 'Admin',
    route: '/admin',
    roles: ['admin'],
    permission: null,
    visible: true
  }],
  googleAnalyticsID: 'UA-XXXX-Y',
  recaptchaSiteKey: '',
  owasp: {
    allowPassphrases: true,
    maxLength: 128,
    minLength: 10,
    minPhraseLength: 20,
    minOptionalTestsToPass: 4
  },
  showLoginNav: false,
  showSearchNav: true,
  imageUploadApi: 'api/admin/upload',
  siteSearchRoute: '/blog/posts/search/',
  twitterHandle: '',
  disqusShortname: 'meancore-cms'
};
