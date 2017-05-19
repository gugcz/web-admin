(function(global) {

  global.__processError = function(error) {
    var client = new VTClient();
    var outputs = client.parse(error.codeFrame);

    var content = '<div><div style="padding:10px 5px 0;">' +
      '<h1 style="color:red">' + error.name + '</h1>' +
      '<h4>' + error.message + '</h4></div>' +
      '<pre style="background: #fbf7ba;padding:10px;border:1px solid red;">' + convertToHTML(outputs) + '</pre>' +
      '</div>';

    printToConsole(error, outputs);

    document.addEventListener("DOMContentLoaded", function() {
      var body = document.querySelector('body');
      body.innerHTML = content;
      body.removeAttribute('ng-cloak');
    });

  };

  function convertToHTML(outputs) {
    var rows = outputs.map(rowToSpan);
    return rows.join("");
  }

  function rowToSpan(row) {
    return '<span style=' + JSON.stringify(row.css) + '>' + row.text + '</span>';
  };

  function printToConsole(error, outputs) {
    var argv = [""];
    for (var i = 0; i < outputs.length; i++) {
      var output = outputs[i];
      argv[0] += '%c' + output.text;
      argv.push(output.css);
    }
    console.group(error.name);
    console.error(error.message);
    console.log.apply(console, argv);
    console.groupEnd();
  }
}(window));
