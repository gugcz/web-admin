const browserSync = require('browser-sync').create();

exports.instance = browserSync;

exports.init = function (port = 8000) {
  browserSync.init({
    port: port,
    open: true,
    ui: false,
    server: {
      baseDir: ['src', 'dependencies'],
      files: ['src/index.html', 'dependencies/*']
    }
  });
};

