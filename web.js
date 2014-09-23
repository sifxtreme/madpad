// dependencies
var coffee = require('coffee-script');
var express = require('express');
var hbs = require('hbs');

var mongoose = require('mongoose');
var User = require('./models/user.js');
var Pad = require('./models/pad.js');

var passport = require('passport');
var auth = require('./authentication.js');

var sessions = require('./cookie.js');
var padCookie = require('./padCookie.js');

var app = express(); 
app.configure(function(){
  app.set('view engine', 'html');
  hbs.registerPartials(__dirname + '/views/partials');
  app.engine('html', hbs.__express);
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(sessions);
  app.use(padCookie);

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

var server = require('http').Server(app);
var io = require('socket.io').listen(server, {log:false});

// connect to the database
mongoose.connect('mongodb://localhost/madpad');

// passport serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  done(null, id);
});

var redis = require('redis');
var sharejs = require('share');
var options = require('./privacy.js');

/* ***************************************************************************** */

io.on('connection', function(socket){
  require('./socket-functions')(socket);
});

/* ***************************************************************************** */

// ROUTES

// login-signup routes
require('./routes/account')(app, passport);

// color pad for jimmy
app.get('/colors', function(req, res){
  res.render('colors');
});

// home page
app.get('/', function(req, res) {
  sharejs.server.attach(app, options);
  res.render('index');
});

// all pad routes
require('./routes/pads')(app);

// port number
server.listen(5000);

module.exports = app