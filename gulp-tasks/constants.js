const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const browserSyncInstance = require('./browser-sync').instance;

const del = require('del');
const argv = require('yargs');

const environment = argv.argv.env || 'devel';

exports.cleanConstants = function () {
  return del('dependencies/es5/config');
};

function getStream() {
  return gulp.src('config/' + environment + '.json')
    .pipe(plugins.ngConfig('appConfig'));
};

exports.createConstants = function () {
  return getStream()
    .pipe(gulp.dest('dependencies/es5/config'))
    .pipe(browserSyncInstance.stream());
};

exports.getStream = getStream;
