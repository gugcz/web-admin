const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const pugCompiler = require('pug');
const browserSyncInstance = require('./browser-sync').instance;

pugCompiler.filters.escape = function (block) {
  return block
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/#/g, '&#35;')
    .replace(/\\/g, '\\\\');
};

function getStream() {
  return gulp.src('src/**/*.pug')
    .pipe(plugins.pug({
      pretty: true,
      pug: pugCompiler
    }, {}))
    .pipe(plugins.angularTemplatecache('templates.js', {
      module: 'appTemplates',
      standalone: true
    }));
};

exports.compile = function () {
  return getStream()
    .pipe(gulp.dest('dependencies/es5'))
    .pipe(browserSyncInstance.stream());

};

exports.getStream = getStream;
