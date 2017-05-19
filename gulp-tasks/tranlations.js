const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const browserSyncInstance = require('./browser-sync').instance;

exports.compile = function () {
  return gulp.src('src/locale/locale-*.json')
    .pipe(plugins.angularTranslate('translations.js', {
      module: 'appTranslations'
    }))
    .pipe(gulp.dest('dependencies/es5'))
    .pipe(browserSyncInstance.stream());
};
