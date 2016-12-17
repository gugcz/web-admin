/// <binding BeforeBuild='build' />
/* eslint-env node, global console */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var fs = require('fs');
var mkdirp = require('mkdirp');

var del = require('del');
var esteWatch = require('este-watch');
var pugCompiler = require('pug');
var mainBowerFiles = require('main-bower-files');
var minimatch = require('minimatch');
var open = require('open');
var runSequence = require('run-sequence');
var url = require('url');

var config = require('./gulp-config.js');

var mkdirSync = function(path) {
  try {
    mkdirp.sync(path);
  } catch (e) {
    if (e.code != 'EEXIST') throw e;
  }
};

config.gulp.isProduction = false;
config.gulp.filepath = {
  index: config.gulp.dirs.build + config.gulp.filename.index,
  css: config.gulp.dirs.srcCss + config.gulp.filename.css,
  sass: config.gulp.dirs.srcSass + config.gulp.filename.sass,
  js: {
    application: config.gulp.dirs.src + config.gulp.filename.js.application,
    vendor: config.gulp.dirs.src + config.gulp.filename.js.vendor,
    templates: config.gulp.dirs.src + config.gulp.filename.js.templates,
    templatesVendor: config.gulp.dirs.src + config.gulp.filename.js.templatesVendor
  }
};

config.gulp.filepath.assets = config.gulp.dirs.parts.assets.map(function(relativePath) {
  return fs.realpathSync(config.gulp.dirs.src + relativePath);
});

config.gulp.destinationDir = config.gulp.dirs.build;
mkdirSync(config.gulp.destinationDir);

config.gulp.generatedFiles = [
  config.gulp.destinationDir + config.gulp.filename.js.application,
  config.gulp.destinationDir + config.gulp.filename.js.vendor,
  config.gulp.src + config.gulp.filename.js.templates,
  config.gulp.src + config.gulp.filename.js.templatesVendor
];

config.gulp.paths = {
  images: config.gulp.dirs.src + 'images/**/*',
  scripts: [
    config.gulp.dirs.src + '**/*.js',
    '!' + config.gulp.dirs.src + '**/*spec.js'
  ],
  templates: [
    config.gulp.dirs.src + '**/*.pug',
    '!' + config.gulp.dirs.src + 'index.pug'
  ],
  sass: [
    config.gulp.dirs.srcSass + '**/*.scss'
  ],
  livereload: config.gulp.generatedFiles
};

config.gulp.paths.livereload.push(config.gulp.destinationDir + config.gulp.dirs.parts.css + '*.css');
config.gulp.paths.livereload.push(config.gulp.destinationDir + 'index.html');

config.gulp.paths.scripts = config.gulp.paths.scripts.concat();

config.gulp.paths.revManifest = config.gulp.dirs.build + "/rev-manifest.json";

config.gulp.paths.angularScripts = (function getAngularScripts() {
  var angularScripts = config.gulp.paths.scripts.slice(0);  // clone

  var templateJSIndex = angularScripts.indexOf('!' + config.gulp.destinationDir + config.gulp.filepath.js.templates);
  if (templateJSIndex > 0) {
    angularScripts.splice(templateJSIndex, 1);
  }

  var templateVendorJSIndex = angularScripts.indexOf('!' + config.gulp.destinationDir + config.gulp.filepath.js.templatesVendor);
  if (templateVendorJSIndex > 0) {
    angularScripts.splice(templateVendorJSIndex, 1);
  }

  return angularScripts;
})();

/**
 * @param {object} options {option.host, option.port}
 */
function httpServer(options) {
  if (!options.run) {
    return;
  }

  var connect = require('connect');
  var proxy = require('proxy-middleware');
  var serveStatic = require('serve-static');

  var app = connect();

  if (options.proxy) {
    var route = options.proxy.routePath || '/api';
    if (!options.proxy.destinationUrl) {
      throw new Error('No proxy settings. You must set gulp.httpServer.proxy.destinationUrl');
    }
    console.log('Create proxy ' + route + ' for ' + options.proxy.destinationUrl);
    app.use(route, proxy(url.parse(options.proxy.destinationUrl)));
  }

  app.use('/build/static/images', serveStatic('./src/images'));
  app.use(serveStatic("."));

  app.listen(options.port);
  console.log('HTTP server running on ', options.host + ':' + options.port);

  if (options.open) {
    var appUrl = 'http://' + options.host + ':' + options.port + '/' + config.gulp.dirs.build;
    console.log('Opening ' + appUrl);
    open(appUrl);
  }
}

gulp.task('translations', function() {
  return gulp.src('src/locale/locale-*.json')
    .pipe(plugins.angularTranslate(config.gulp.filename.js.translations, {
      module: config.application.name + '.translations'
    }))
    .pipe(gulp.dest(config.gulp.dirs.src));
});

gulp.task('templates', ['pug-index'], function() {
  return gulp.src(config.gulp.paths.templates)
    .pipe(plugins.plumber())
    .pipe(plugins.pug({
      pretty: true,
      pug: pugCompiler
    }, {}))
    .pipe(plugins.angularTemplatecache(config.gulp.filename.js.templates, {
      module: config.application.name + '.templates',
      standalone: true
    }))
    .pipe(gulp.dest(config.gulp.dirs.src));
});

gulp.task('templates-vendor', function() {
  var bowerTemplateFiles = mainBowerFiles('**/*.html');
  return gulp.src(bowerTemplateFiles)
    .pipe(plugins.angularTemplatecache(config.gulp.filename.js.templatesVendor, {
        module: config.application.name + '.templates',
        base: process.cwd(),
        standalone: true
      }
    ))
    .pipe(gulp.dest(config.gulp.dirs.src));
});

gulp.task('lint', function() {
  return gulp.src(config.gulp.paths.scripts)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failOnError());
});

gulp.task('js-vendor', function() {
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(plugins.plumber())
    .pipe(plugins.if(config.gulp.isProduction,
      plugins.concat(config.gulp.filename.js.vendor),
      plugins.pseudoconcatJs(config.gulp.filename.js.vendor, {webRoot: fs.realpathSync(__dirname + '/' + config.gulp.dirs.build)}, ['//' + config.gulp.httpServer.host + ':' + config.gulp.httpServer.lrPort + '/livereload.js'])
    ))
    .pipe(gulp.dest(config.gulp.destinationDir));
});

gulp.task('js-main', ['lint', 'templates', 'templates-vendor', 'translations'], function() {
  return gulp.src(config.gulp.paths.angularScripts)
    .pipe(plugins.plumber())
    .pipe(plugins.angularFilesort())
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.if(config.gulp.isProduction,
      plugins.concat(config.gulp.filename.js.application),
      plugins.pseudoconcatJs(config.gulp.filename.js.application, {webRoot: fs.realpathSync('./' + config.gulp.dirs.build)})
    ))
    .pipe(gulp.dest(config.gulp.destinationDir));
});

gulp.task('js-main-dev', ['lint'], function() {

  return gulp.src(config.gulp.paths.angularScripts)
    .pipe(plugins.plumber())
    .pipe(plugins.angularFilesort())
    .pipe(plugins.pseudoconcatJs(config.gulp.filename.js.application, {webRoot: fs.realpathSync('./' + config.gulp.dirs.build)}))
    .pipe(gulp.dest(config.gulp.destinationDir));
});

gulp.task('watch', function() {
  plugins.livereload.listen(config.gulp.httpServer.lrPort);
  httpServer(config.gulp.httpServer);
  esteWatch([config.gulp.dirs.src, 'config'], function(e) {

    if (config.gulp.generatedFiles.some(function(pattern) {
        return minimatch(e.filepath, pattern);
      })) {
      return;
    }
    console.log(e);
    switch (e.extension) {
      case 'html':
      case 'pug':
        gulp.start('templates');
        break;
      case 'json':
        if (e.filepath.startsWith('config')) {
          gulp.start('config');

        } else {
          gulp.start('translations');
        }
        break;
      case 'js':
        var testFilePattern = /.spec.js$/;
        if (!testFilePattern.test(e.filepath)) {
          gulp.start('js-main-dev');
        }
        break;
      case 'scss':
        gulp.start('sass');
        break;
    }
  }).start();

  gulp.watch(config.gulp.paths.livereload).on('change', function(filepath) {
    plugins.livereload.changed(filepath, config.gulp.httpServer.lrPort);
  });
});

gulp.task('devel', ['build-clean'], function() {
  runSequence(
    ['sass', 'config-devel', 'translations', 'pug-index'],
    ['js-vendor', 'js-main'],
    'watch'
  );
});

gulp.task('build-clean', function() {
  return del([
    config.gulp.dirs.build
  ]);
});

gulp.task('build-post-clean', function(cb) {
  del([
    config.gulp.paths.revManifest
  ], cb);

});

gulp.task('build-index', ['pug-index'], function() {
  var manifest = gulp.src(config.gulp.paths.revManifest);

  return gulp.src(config.gulp.filepath.index)
    .pipe(plugins.revReplace({manifest: manifest}))
    .pipe(gulp.dest(config.gulp.dirs.build));
});

gulp.task('build-assets', function() {
  return gulp.src(config.gulp.filepath.assets)
    .pipe(gulp.dest(config.gulp.dirs.build));
});

gulp.task('build-images', function() {
  return gulp.src(config.gulp.paths.images, {base: config.gulp.dirs.src})
    .pipe(gulp.dest(config.gulp.dirs.build));
});

gulp.task('build-js', ['js-vendor', 'js-main'], function() {
  return gulp.src([config.gulp.filepath.js.application, config.gulp.filepath.js.vendor])
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.gulp.dirs.build));
});

gulp.task('sass', function() {
  return gulp.src(config.gulp.filepath.sass)
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(config.gulp.destinationDir + config.gulp.dirs.parts.css));
});

gulp.task('build-css', ['sass'], function() {
  return gulp.src([config.gulp.filepath.css])
    .pipe(plugins.cssmin())
    .pipe(gulp.dest(config.gulp.dirs.buildCss));
});

gulp.task('build-test', function() {
  var testFiles = [
    'test/utils/Function.bind.polyfill.js',
    'build/vendor.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'build/scripts.js',
    'src/**/*.spec.js'
  ];

  return gulp.src(testFiles)
    .pipe(plugins.karma({
      configFile: 'test/karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('build-rev', function() {
  return gulp.src([
    config.gulp.dirs.build + '**/*.css',
    config.gulp.dirs.build + '*.js'
  ])
    .pipe(plugins.rev())
    .pipe(plugins.revDeleteOriginal())
    .pipe(gulp.dest(config.gulp.dirs.build))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest(config.gulp.dirs.build));
});

gulp.task('build-copy-config', ['config-production'], function() {
  // temporary task - config will be special for every stage
  return gulp.src('src/config.js')
    .pipe(gulp.dest(config.gulp.dirs.build));
});

gulp.task('build', ['build-clean'], function() {
  config.gulp.isProduction = true;

  mkdirSync(config.gulp.destinationDir);

  runSequence(
    ['build-js', 'build-css', 'build-assets', 'build-images'],
    'build-rev',
    ['build-index', 'build-copy-config'],
    'build-post-clean'
  );

});

pugCompiler.filters.escape = function(block) {
  return block
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/#/g, '&#35;')
    .replace(/\\/g, '\\\\');
};

gulp.task('pug-index', function() {

  gulp.src('src/index.pug')
    .pipe(plugins.plumber())
    .pipe(plugins.pug({
      pretty: true,
      pug: pugCompiler
    }))
    .pipe(gulp.dest(config.gulp.dirs.build));
});

gulp.task('prepare-deploy', function() {
  return gulp.src('app.yaml')
    .pipe(gulp.dest('build/'));
});

gulp.task('deploy-to-gcloud', plugins.shell.task([
  'gcloud config set project gug-web-admin',
  'gcloud config set app/use_appengine_api false',
  'gcloud preview app deploy app.yaml --quiet --promote'
], {
  cwd: 'build/'
}));

gulp.task('deploy', function() {
  return runSequence(
    'build', 'prepare-deploy', 'deploy-to-gcloud'
  );
});

gulp.task('default', ['build']);


gulp.task('config-devel', function() {
  gulp.src('config/devel.json') // TODO set by stage
    .pipe(plugins.ngConfig(config.application.name + '.config'))
    .pipe(plugins.rename('config.js'))
    .pipe(gulp.dest('./src'));
});

gulp.task('config-production', function() {
  gulp.src('config/production.json')
    .pipe(plugins.ngConfig(config.application.name + '.config'))
    .pipe(plugins.rename('config.js'))
    .pipe(gulp.dest('./src'));
});
