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

var device = require('express-device');

var app = express(); 
app.configure(function(){
  app.set('view engine', 'html');
  hbs.registerPartials(__dirname + '/views/partials');
  var hbs_helpers = require('./handlebars_helpers.js');
  hbs.registerHelper('strip_name', hbs_helpers.strip_name);
  hbs.registerHelper('compare', hbs_helpers.compare);
  app.engine('html', hbs.__express);
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(sessions);
  app.use(padCookie);

  app.use(device.capture());
  device.enableDeviceHelpers(app);

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

var server = require('http').Server(app);

// connect to the database
mongoose.connect('mongodb://localhost/madpad');

// socket.io
var io = require('socket.io').listen(server, {log:false});
require('./socket-functions')(io);


// passport serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  done(null, id);
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
  res.render('index');
});

// all pad routes
require('./routes/pads')(app);

// port number
server.listen(5000);

module.exports = app