const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const gutil = require('gulp-util');

const codeFrame = require('babel-code-frame');
const fs = require('fs');
const path = require('path');

// http://gotofritz.net/blog/geekery/how-to-prevent-less-errors-stopping-gulp-watch/
exports.createForTask = function (taskName, verbose) {
  return function (err) {
    verbose
      ? gutil.log(gutil.colors.red("Error in ", taskName), err, arguments)
      : gutil.log(gutil.colors.red("Error in ", taskName, err.message));

    this.emit("end", new gutil.PluginError(taskName, err, {showStack: true}));
  };
};

exports.eslintFailOnFatalError = function (result, done) {
  const fatalMessage = result.messages.filter(function (message) {
    return Boolean(message.fatal)
  });

  if (!fatalMessage.length) {
    done(null, result);
    return;
  }
  const filePath = result.filePath;
  const data = fs.readFileSync(filePath, 'utf8');

  const frame = codeFrame(data, fatalMessage[0].line, fatalMessage[0].column);
  const content = '__processError(' + JSON.stringify({
      name: "Fatal error",
      message: fatalMessage[0].message + ' file: ' + filePath + ' (' + fatalMessage[0].line + ':' + fatalMessage[0].column + ')',
      codeFrame: frame
    }) + ');';

  writeErrorAsScripts(fatalMessage[0], content).on('end', function () {
    done(null, result);
  });

};

exports.eslintAfterErrorOrWarningFactory = function ({force = false} = {}) {
  if (force) {
    return (results, done) => done();
  }

  return function (results, done) {
    const problemsCount = results.errorCount + results.warningCount;
    if (problemsCount > 0) {
      done(new gutil.PluginError('ESlint', `eslint found some issues`, {showStack: false}));
    } else {
      done();
    }
  }
};

exports.babelProcessError = function (error) {

  const content = '__processError(' + JSON.stringify({
      name: "Fatal error",
      message: error.message,
      codeFrame: error.codeFrame
    }) + ');';

  writeErrorAsScripts(error, content);

  this.emit("end", new gutil.PluginError('babel', error.message, {showStack: true}));
};

function writeErrorAsScripts(error, content) {
  const fileName = path.join(process.cwd(), 'dependencies/error.js');
  fs.writeFileSync(fileName, content);
  error.message += '\n' + content.codeFrame;

  return gulp.src(['utils/browser-process-error.js', 'utils/vt100tocss.js', 'dependencies/error.js'])
    .pipe(plugins.concat('scripts.js'))
    .pipe(gulp.dest('dependencies/'));
}

