const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gUtil = require('gulp-util');
const plugins = require('gulp-load-plugins')();
const bowerJson = require('../bower.json');

const browserSyncInstance = require('./browser-sync').instance;

const sassOptions = {
  importer: function (url, prev) {
    let filePath;
    const urlExt = path.extname(url);
    let addExt = '';
    if (!urlExt) {
      addExt = path.extname(prev);
    }

    if (url.startsWith('/')) {
      filePath = path.resolve('./', url.substr(1))
    } else {
      filePath = path.resolve(path.dirname(prev), url)
    }

    filePath += addExt;

    try {
      return {file: filePath, contents: fs.readFileSync(filePath).toString()};
    } catch (error) {
      return error;
    }
  }
};

exports.sass = function () {
  return gulp.src(['src/**/*.scss'])
    .pipe(plugins.sass(sassOptions).on('error', plugins.sass.logError))
    .pipe(plugins.concat('styles.css'))
    .pipe(gulp.dest('dependencies/'))
    .pipe(browserSyncInstance.stream());
};

exports.cssmin = function () {
  return gulp.src('src/**/*.scss')
    .pipe(plugins.sass(sassOptions).on('error', plugins.sass.logError))
    .pipe(plugins.concat('dist/' + bowerJson.name + '.css'))
    .pipe(plugins.cssmin())
    .pipe(plugins.concat('styles.css'))
    .pipe(gulp.dest('dist/'));
};
