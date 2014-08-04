// dependencies
var coffee = require('coffee-script');
var express = require('express');
var hbs = require('hbs');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var passport = require('passport');
var auth = require('./authentication.js');

var app = express(); 
app.configure(function(){
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'my_sprecious' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

var server = require('http').Server(app);
var io = require('socket.io').listen(server, {log:false});

// connect to the database
mongoose.connect('mongodb://localhost/madpad');

// seralize and deseralize
passport.serializeUser(function(user, done) {
  // console.log('serializeUser: ' + user._id)
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  done(null, id);
  // User.findById(id, function(err, user){
  //   console.log("trying to find user");
  //   // console.log(user);
  //   if(!err) done(null, user);
  //   else done(err, null);
  // })
});

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
  passport.authenticate('facebook'),
  function(req, res){
  });
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    req.session.test = "QWE";
    res.redirect('/');
  });

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
  });
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', function(req, res) {
  sharejs.server.attach(app, options);
  console.log(req.session.test);
  res.render('pad', {id: "home", user: req.session.passport.user});
});
app.get('/:id', function(req, res){
  sharejs.server.attach(app, options);
  res.render('pad', {id: req.params.id, user: req.session.passport.user});
});


// port
server.listen(5000);

module.exports = app
