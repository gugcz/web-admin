const gulp = require('gulp');

exports.copy = function () {
  return gulp.src([
      'src/fonts/**/*.*',
      'src/img/**/*.*',
      'src/images/**/*.*'
    ],
    {base: 'src/'})
    .pipe(gulp.dest('dist/'));
};
