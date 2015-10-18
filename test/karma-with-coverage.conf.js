var mainBowerFiles = require('main-bower-files');

var currentPath = process.cwd();

var bowerPath = currentPath;
var mainBowerSettings = {};
// normalization cwd in cli and webstorem
if (currentPath.indexOf('test', currentPath.length - 5) !== -1) {
  bowerPath = currentPath.substring(0, currentPath.length - 5);
  mainBowerSettings = {
    paths: bowerPath
  };
}

var bowerJSFiles = mainBowerFiles('**/*.js', mainBowerSettings)
  .map(function(path) {
    return path.substring(bowerPath.length + 1);
  });

var polyfill = [
  'test/utils/Function.bind.polyfill.js',
];

var libFiles = [
  'bower_components/angular-mocks/angular-mocks.js'
];

var appFilesAndTests = [
  'src/app/**/*.js'
];

var karmaFiles = polyfill
  .concat(bowerJSFiles)
  .concat(libFiles)
  .concat(appFilesAndTests);

module.exports = function(config) {

  config.set({
    basePath: '../',
    files: karmaFiles,
    frameworks: ['jasmine', 'angular-filesort'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-angular-filesort',
      'karma-jasmine',
      'karma-coverage'
    ],
    angularFilesort: {
      whitelist: appFilesAndTests
    },
    autoWatch: true,
    singleRun: false,
    reporters: ['progress', 'coverage'],
    preprocessors: {'src/**/*.js': ['coverage']},
    coverageReporter: {
      type: 'html',
      dir: 'report/',
      file: 'report.html'
    }

  });
};
