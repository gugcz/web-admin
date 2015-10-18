var util = require('gulp-util');

module.exports = {
  application: {
    name: 'gugCZ.webAdmin'
  },
  gulp: {
    httpServer: {
      host: util.env.HOST || 'localhost',
      port: util.env.PORT || 8080,
      lrPort: util.env.LRPORT || 35729,
      run: true,
      open: true,
      proxy: false

      //proxy: {
      //  routePath: '/src/api',
      //  destinationUrl: 'http://gugCZ.webAdmin.cloudapp.net'
      //}
    },
    dirs: {
      build: 'public/',
      src: 'src/',
      parts: {
        app: 'app/',
        css: 'css/',
        sass: 'scss/',
        assets: []
      },
      srcApp: 'src/app/',
      srcCss: 'src/css/',
      srcSass: 'src/scss/',
      buildCss: 'build/css/'
    },
    filename: {
      index: 'index.html',
      sass: 'app.scss',
      css: 'app.css',
      js: {
        application: 'scripts.js',
        vendor: 'vendor.js',
        config: 'config.js',
        templates: 'templates.js',
        translations: 'translations.js',
        templatesVendor: 'templates-vendor.js'
      }
    }
  }
};
