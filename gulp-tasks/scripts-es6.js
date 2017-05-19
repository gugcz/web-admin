const del = require('del');
const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const mainBowerFiles = require('main-bower-files');
const errorHandlers = require('./_errorHandlers');

const browserSyncInstance = require('./browser-sync').instance;

const hasFixFlag = (process.argv.slice(2).indexOf('--fix') >= 0);
hasFixFlag && console.info('Start in experimental autofix mode!');

const hasForceFlag = (process.argv.slice(2).indexOf('--force') >= 0);
hasForceFlag && console.info('Start with force flag - eslint issues will be ignored!');

function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

exports.appScriptsES6 = function () {
  return gulp.src('src/**/*.js', {base: './'})
    .pipe(plugins.cached('jsFiles'))
    .pipe(plugins.eslint({
      fix: hasFixFlag
    }))
    .pipe(plugins.eslint.format())
    .pipe(plugins.if(isFixed, gulp.dest('./')))
    .pipe(plugins.ignore.exclude('*.spec.js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel().on('error', errorHandlers.babelProcessError))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('dependencies/es5'));
};

exports.appScriptsES6Lint = function () {
  return gulp.src('src/**/*.js', {base: './'})
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.results(errorHandlers.eslintAfterErrorOrWarningFactory({force: hasForceFlag})));
};

function existsInSource(file) {
  const filePathRelative = path.relative(path.resolve('dependencies/es5'), file.path);

  if (filePathRelative.startsWith('src/')) {  // apply only for src/ directory
    return fs.existsSync(filePathRelative)
  }

  return true;
}

exports.es5ToScripts = function () {
  return gulp.src('dependencies/es5/**/*.js')
    .pipe(plugins.filter(existsInSource))
    .pipe(plugins.angularFilesort().on('error', errorHandlers.createForTask('angularFilesort')))
    .pipe(plugins.pseudoconcatJs('scripts.js', {webRoot: 'dependencies/'}))
    .pipe(gulp.dest('dependencies/'))
    .pipe(browserSyncInstance.stream());
};

exports.cleanTranspiledFiles = function () {
  return del(['dependencies/es5/**/*']);
};

exports.bowerFilesToVendor = function () {
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(plugins.pseudoconcatJs('vendor.js', {webRoot: 'dependencies/'}))
    .pipe(gulp.dest('dependencies/'))
    .pipe(browserSyncInstance.stream());
};

