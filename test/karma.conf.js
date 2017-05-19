const loader = require('./utils/bower-dependencies-loader');

const polyfill = [];

const appFilesAndTests = [
  'dependencies/bower_components/angular-mocks/angular-mocks.js',
  'src/**/*.js'
];

const karmaFiles = polyfill
  .concat(loader.getBowerFiles())
  .concat(appFilesAndTests);

module.exports = function (config) {

  config.set({
    basePath: '../',
    files: karmaFiles,
    frameworks: ['jasmine', 'angular-filesort'],
    browsers: ['PhantomJS'],  // PhantomJS nebo Chrome
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-babel-preprocessor',
      'karma-angular-filesort'
    ],
    autoWatch: true,
    singleRun: false,
    reporters: ['progress', 'coverage'],
    preprocessors: {'src/**/*.js': ['babel', 'coverage']},
    coverageReporter: {
      type: 'html',
      dir: 'report/',
      file: 'report.html'
    },

    angularFilesort: {
      whitelist: [
        'src/**/*.js'
      ]
    }

  });
};
