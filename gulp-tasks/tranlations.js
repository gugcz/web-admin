const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const browserSyncInstance = require('./browser-sync').instance;

function getStream() {
  return gulp.src('src/locale/locale-*.json')
    .pipe(plugins.angularTranslate('translations.js', {
      module: 'appTranslations'
    }));
}

function compile() {
  return getStream()
    .pipe(gulp.dest('dependencies/es5'))
    .pipe(browserSyncInstance.stream());
}

exports.getStream = getStream;
exports.compile = compile;
