const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const del = require('del');
const argv = require('yargs');

const environment = argv.argv.env || 'devel';

exports.cleanConstants = function () {
  return del('dependencies/es5/config');
};

exports.createConstants = function () {
  return gulp.src('config/' + environment + '.json')
    .pipe(plugins.ngConfig('appConfig'))
    .pipe(gulp.dest('dependencies/es5/config'));
};
