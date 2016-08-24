#!/usr/bin/env node
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var swaggerTools = require('swagger-tools');
var fs = require('fs');
var jsyaml = require('js-yaml');
var http = require('http');
var debug = require('debug')('pic-mark:server');

var base = process.cwd();
var appConf = require(base + '/config/config.json');

var app = express();
var apiV1File = fs.readFileSync(base + '/swagger/v1/api/swagger.yaml', 'utf8');
var swaggerApiV1Doc = jsyaml.safeLoad(apiV1File);
var swaggerRouterConfig = {controllers: base + '/swagger/v1/controllers'};
var port = normalizePort(process.env.PORT || appConf.server.port);


app.set('port', port);
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(base, 'public')));

// 构造swagger中间件:
swaggerTools.initializeMiddleware(swaggerApiV1Doc, function (swaggerMiddleware) {

  // swagger中间件调用链的首个中间件,用来给请求加上metadata等数据
  app.use(swaggerMiddleware.swaggerMetadata());

  // 加载对请求进行有效性检查的中间件
  app.use(swaggerMiddleware.swaggerValidator());

  // 加载路由中间件
  app.use(swaggerMiddleware.swaggerRouter(swaggerRouterConfig));

  // 加载API文档中间件
  app.use(swaggerMiddleware.swaggerUi());
  
  app.use(catch404);
  if (app.get('env') === 'development') {
    app.use(devCatchError);
  }
  app.use(productionCatchError);
  
  var server = http.createServer(app);
  console.log('start server on port: ' + port);
  console.log('now you can check API: http://localhost:' + port + '/docs');

  server.on('error', onError);
  server.on('listening', onListening);
  server.listen(port);

  function catch404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
  function devCatchError(err, req, res, next) {
    console.log('-----------');
    // development error handler will print error stacktrace
    console.log(err.status || 500);

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  }
  function productionCatchError(err, req, res, next) {
    // production error handler will not print error stacktrace for user
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  }
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;
