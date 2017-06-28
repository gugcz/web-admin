const del = require('del');
const runSequence = require('run-sequence');

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const KarmaServer = require('karma').Server;

const browserSync = require('./gulp-tasks/browser-sync');
const assets = require('./gulp-tasks/assets');
const constants = require('./gulp-tasks/constants');
const styles = require('./gulp-tasks/styles');
const scriptsBuild = require('./gulp-tasks/scripts-build');
const scriptsDevel = require('./gulp-tasks/scripts-es6');
const revisions = require('./gulp-tasks/revisions');
const deploy = require('./gulp-tasks/deploy');
const pugTemplates = require('./gulp-tasks/pug-templates');
const tranlations = require('./gulp-tasks/tranlations');

gulp.task('sass', styles.sass);
gulp.task('pug-templates', pugTemplates.compile);
gulp.task('translations', tranlations.compile);

gulp.task('clean-constants', constants.cleanConstants);
gulp.task('create-constants', ['clean-constants'], constants.createConstants);

gulp.task('deploy-clean', deploy.deployClean);
gulp.task('deploy', ['deploy-clean', 'build'], deploy.deploy);

gulp.task('devel-app-es6', scriptsDevel.appScriptsES6);
gulp.task('devel-app-js', ['devel-app-es6', 'pug-templates', 'translations'], scriptsDevel.es5ToScripts);
gulp.task('lint', scriptsDevel.appScriptsES6Lint);
gulp.task('devel-vendor-js', scriptsDevel.bowerFilesToVendor);
gulp.task('clean-transpiled-files', scriptsDevel.cleanTranspiledFiles);

gulp.task('devel', function (callback) {
  runSequence(
    'clean-transpiled-files',
    ['sass', 'devel-vendor-js', 'devel-app-js', 'create-constants'],
    develServerFactory(callback)
  );
});

gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done).start();
});


gulp.task('build-clean', function () {
  return del(['dist/']);
});

gulp.task('build-assets', assets.copy);
gulp.task('build-css', styles.cssmin);
gulp.task('build-app-js', scriptsBuild.appScriptsProcessing);
gulp.task('build-vendor-js', scriptsBuild.bowerFilesToVendor);
gulp.task('build-revisions', revisions.revisions);
gulp.task('build-index', revisions.indexHtml);

gulp.task('build', function (callback) {
  runSequence('build-clean',
    ['build-app-js', 'build-vendor-js', 'build-css', 'build-assets'],
    'build-revisions',
    'build-index',
    callback);
});

function develServerFactory(callback) {
  return function () {
    browserSync.init();

    gulp.watch(['src/**/*.scss'], ['sass']);
    gulp.watch(['src/**/*.js'], ['devel-app-js']);
    gulp.watch(['src/**/*.pug'], ['pug-templates']);
    gulp.watch(['config/*.json'], ['create-constants']);
    gulp.watch(['src/locale/locale-*.json'], ['translations']);
    gulp.watch(['bower.json'], ['devel-vendor-js']);

    gulp.watch(['src/**/*.html'], browserSync.instance.reload);

    process.on('uncaughtException', function (err) {
      console.error('uncaughtException: ', err);
      console.error(err.stack);

      browserSync.instance.exit();
      console.log('server stopped');
      process.exit(-1);
    });

    callback();

  };

}
