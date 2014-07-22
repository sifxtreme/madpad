require('coffee-script');

var express = require('express');
var app = express(); 

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('public'));

var server = require('http').Server(app);
var io = require('socket.io').listen(server, {log:false});

var config = require('./oauth.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GithubStrategy = require('passport-github').Strategy;

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// config
passport.use(new FacebookStrategy(
  {
   clientID: config.facebook.clientID,
   clientSecret: config.facebook.clientSecret,
   callbackURL: config.facebook.callbackURL,
   profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {
   process.nextTick(function () {
     return done(null, profile);
   });
  }
));

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

var sharejs = require('share');
var redis = require('redis');
var options = {
  db: {type: 'redis'},
  browserChannel: {cors: '*'},
  auth: function(client, action) {
    action.accept();
  }
};

/* ***************************************************************************** */

// CHAT ROOM

io.on('connection', function(socket){
  socket.on('room', function(room){
    socket.join(room);
  });
  socket.on('chat', function(data){
    var messageObject = {'name': data.name, 'picture': data.picture, 'message': data.message, 'profileId': data.profileId};
    socket.broadcast.to(data.room).emit('newMessage', messageObject);
  });
});

/* ***************************************************************************** */

// ROUTES

app.get('/auth/facebook',
passport.authenticate('facebook', { scope: ['email']}),
  function(req, res){
});

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
 res.redirect('/x');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', function(request, response) {
  response.render('pad', {id: request.params.id});
  sharejs.server.attach(app, options);
});
app.get('/:id', function(request, response){
  console.log(request.user);
  response.render('pad', {id: request.params.id, user: request.user});
  sharejs.server.attach(app, options);
});





server.listen(5000);

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
else {
  console.log("FAILURE");
  res.redirect('/fail')
}
}