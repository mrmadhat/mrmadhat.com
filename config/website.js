module.exports = {
  siteTitle: 'MrMadHat', // Navigation and Site Title
  siteTitleAlt: 'The website of Daniel Gregory', // Alternative Site title for SEO
  siteTitleShort: 'mrmadhat', // short_name for manifest
  siteUrl: process.env.ROOT_URL || 'https://mrmadhat.com', // Domain of your site. No trailing slash!
  lang: 'en', // Language Tag on <html> element
  pathPrefix: '/',
  siteLogo: 'images/logo.png', // Used for SEO and manifest, path to your image you placed in the 'static' folder
  siteDescription:
    'Building products that help people and helping people to build products',
  minibio: `
    <strong>Daniel Gregory</strong> TODO
  `,
  author: 'Daniel Gregory', // Author for schemaORGJSONLD
  organization: 'MrMadHat',

  // siteFBAppID: '123456789', // Facebook App ID - Optional
  userTwitter: '@itsdannylalala', // Twitter Username
  ogSiteName: 'MrMadHat', // Facebook Site Name
  ogLanguage: 'en_GB',

  // Manifest and Progress color
  themeColor: '#4147DC',
  backgroundColor: '#231C42',

  // Social component
  twitter: 'https://twitter.com/itsdannylalala/',
  twitterHandle: '@itsdannylalala',
  github: 'https://github.com/itsdannylalala/',
  linkedin: 'https://www.linkedin.com/in/itsdannylalala/',
  rss: 'https://mrmadhat.com/articles/rss.xml',
}
