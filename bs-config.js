/*
 | Browser-sync config file
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 | */
module.exports = {
  ui: false,
  files: ['public/*'],
  watchEvents: ['change'],
  ignore: ['node_modules/*'],
  single: false,
  watchOptions: {
    ignoreInitial: true,
  },
  server: './public',
  port: 3000,
  notify: false,
}
