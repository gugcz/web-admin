const gulp = require('gulp');
const del = require('del');
const argv = require('yargs');

const targetDirectory = argv.argv.targetDirectory;

exports.deployClean = function () {
  return del([targetDirectory]);
};

exports.deploy = function () {
  return gulp.src('dist/**')
    .pipe(gulp.dest(targetDirectory));
};
