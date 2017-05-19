const merge = require('merge2');
const gulp = require('gulp');
const path = require('path');
const plugins = require('gulp-load-plugins')();
const mainBowerFiles = require('main-bower-files');
const errorHandlers = require('./_errorHandlers');
const pugTemplates = require('./pug-templates');
const tranlations = require('./tranlations');
const constants = require('./constants');

exports.appScriptsProcessing = function () {

  return merge(
    gulp.src('src/**/*.js')
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.result(errorHandlers.eslintFailOnFatalError)
        .on('error', errorHandlers.createForTask('eslint failOnFatalError')))
      .pipe(plugins.eslint.format())
      .pipe(plugins.ignore.exclude('*.spec.js'))
      .pipe(plugins.babel())
    ,
    pugTemplates.getStream(),
    tranlations.getStream(),
    constants.getStream()
  )
    .pipe(plugins.angularFilesort().on('error', errorHandlers.createForTask('angularFilesort')))
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.concat('scripts.js'))
//    .pipe(plugins.uglify()) TODO dořešit DI
    .pipe(gulp.dest('dist/'));
};

exports.bowerFilesToVendor = function () {
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.uglify())

    .pipe(gulp.dest('dist/'));
};
