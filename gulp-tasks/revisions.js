const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

exports.revisions = function () {
  return gulp.src(['dist/*.css', 'dist/*.js'])
    .pipe(plugins.rev())
    .pipe(plugins.revDeleteOriginal())
    .pipe(gulp.dest('dist/'))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('dist/'));
};

exports.indexHtml = function () {
  const manifest = gulp.src('dist/rev-manifest.json');

  return gulp.src('src/index.html')
    .pipe(plugins.revReplace({manifest: manifest}))
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
}
