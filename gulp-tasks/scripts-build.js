const merge = require('merge2');
const gulp = require('gulp');
const path = require('path');
const plugins = require('gulp-load-plugins')();
const mainBowerFiles = require('main-bower-files');
const errorHandlers = require('./_errorHandlers');

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
    gulp.src(['src/**/*.html', '!src/index.html'])
      .pipe(plugins.htmlmin({collapseWhitespace: true}))
      .pipe(plugins.angularTemplatecache('templates.js', {
          module: 'simpleDevstack', // http://stackoverflow.com/questions/24658966/using-templatecache-in-ui-routers-template
          base: path.join(process.cwd(), 'src'),
          standalone: false
        })
      )
    ,
    gulp.src('gulp-tasks/constants/relative.json')
      .pipe(plugins.ngConstant({
        name: 'cm.common.constants',
        wrap: true
      }))
  )
    .pipe(plugins.angularFilesort().on('error', errorHandlers.createForTask('angularFilesort')))
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.concat('scripts.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/'));
};

exports.bowerFilesToVendor = function () {
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.uglify())

    .pipe(gulp.dest('dist/'));
};
