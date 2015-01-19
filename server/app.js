var connect = require('connect');
var connectLivereload = require('connect-livereload');
var serveStatic = require('serve-static');
var http = require('http');

var watch = require('node-watch');

var tinylr = require('tiny-lr');


var rootDirectory = 'build';


var webserver = function(options) {
  var app = connect();

  var options = options || {};

  if(options.debug) {
    var server = tinylr();
    server.listen(35729);

    app.use(connectLivereload({port: 35729}));
    app.use(serveStatic(rootDirectory));

    watch(rootDirectory, function(filename) {
      server.changed({
        body: {
          files: filename
        }
      });
    });
  }

  return http.createServer(app).listen(8080);
}


module.exports = exports = webserver;
