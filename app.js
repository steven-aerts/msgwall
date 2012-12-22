
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , login = require('./routes/login')
  , http = require('http')
  , path = require('path')
  , app = express()
  , server = http.createServer(app)
  , connect = require('express/node_modules/connect')
  , sessionStore = new connect.middleware.session.MemoryStore
  , cookieParser = express.cookieParser('fout secret here');

// Global variables  
sockets = require("./sockets").listen(server, cookieParser, sessionStore);


app.configure(function(){
  app.set('port', process.env.PORT || 3003);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(cookieParser);
  app.use(express.session({store: sessionStore}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(login.requireAuthentication);
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('/login', login.index);
app.get('/logout', login.logout);
app.get('/', routes.index);
app.get('/wall', require('./routes/wall').index);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
