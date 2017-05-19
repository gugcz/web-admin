var mainBowerFiles = require('main-bower-files');

exports.getBowerFiles = function() {
  var currentPath = process.cwd();

  var bowerPath = currentPath;
  var mainBowerSettings = {};

  // normalization cwd in cli and webstorm
  if (currentPath.indexOf('test', currentPath.length - 5) !== -1) {
    bowerPath = currentPath.substring(0, currentPath.length - 5);
    mainBowerSettings = {
      paths: bowerPath
    };
  }

  return mainBowerFiles('**/*.js', mainBowerSettings)
    .map(function(path) {
      return path.substring(bowerPath.length + 1);
    });
}

