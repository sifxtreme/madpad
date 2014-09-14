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

var app = express(); 
app.configure(function(){
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(sessions);

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
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  done(null, id);
});

var sharejs = require('share');
var redis = require('redis');
var options = {
  db: {type: 'redis'},
  browserChannel: {cors: '*'},
  auth: function(client, action) {
    var docName = action.docName;
    var padInfo = Pad.findOne(
      {'name': docName},
      function(err, obj){
        if(!obj){
          action.accept();          
          console.log("PAD NOT FOUND IN DB");
        }
        else{
          var writeAccess = obj.writeAccess;
          var readAccess = obj.readAccess;

          if(action.name == 'connect'){
            action.accept();
          }
          else{
            if(writeAccess){
              action.accept();
            }
            else{
              if(readAccess){
                if(action.name == "get snapshot" || action.name == "open" || action.name == "get ops"){
                  action.accept();
                }
                else{
                  action.reject();
                }
              }
              else{
                action.reject();
              }
            }
          }
        }
      });
    }
};



/* ***************************************************************************** */

io.on('connection', function(socket){
  socket.on('room', function(room){
    socket.join(room);
  });
  // CHAT ROOM
  socket.on('chat', function(data){
    var messageObject = {'name': data.name, 'picture': data.picture, 'message': data.message, 'profileId': data.profileId};
    socket.broadcast.to(data.room).emit('newMessage', messageObject);
  });
  // CHANGE CODE LANGUAGE
  socket.on('modeChanged', function(data){
    // add user checking
    Pad.update({name: data.room}, {$set: {codeType: data.codeMode}}, function(err, pad){
      // add error checking
      console.log(pad);
    })
    socket.broadcast.to(data.room).emit('changeMode', data.codeMode);
  });

  // DISABLE CHAT IF OWNER
  socket.on('disableChat', function(data){
    if(!data.room) return;
    if(typeof data.disable === 'undefined') return;

    var cookie = socket.request.headers.cookie;
    var user = sessions.getUserData(cookie);

    if(user && user.content && user.content.user && user.content.user._id){
      var userID = user.content.user._id; 
      console.log(userID);
      console.log(data.room);
      Pad.findOne({name: data.room}, {owner: userID}, function(err, pad){
        if(err){
          console.log(err);
        }
        else {
          socket.broadcast.to(data.room).emit('toggleChat', !data.disable);
        }
      })
    }
  });
});

/* ***************************************************************************** */

// ROUTES

require('./routes/account')(app, passport);

app.get('/c/:id', function(req, res){
  sharejs.server.attach(app, options);
  var id = req.params.id;
  Pad.findOne({'name': 'code_' + id}, function(err, pad){
    if(err){
      // TODO - add error logging here
      console.log("Error: " + err);      
    }
    else {
      padObject = {
        type: pad.codeType
      }
      res.render('code', {id: req.params.id, user: req.madpad_user.user, pad: padObject });
    }
  });
  
});

app.get('/t/:id', function(req, res){
  sharejs.server.attach(app, options);
  res.render('pad', {id: req.params.id, user: req.madpad_user.user });
});

app.get('/', function(req, res) {
  sharejs.server.attach(app, options);
  res.render('index');
});

app.get('/:username', function(req, res, next){
  res.redirect('/' + req.params.username + '/home');
});
app.get('/:username/:id', function(req, res, next){
  // edge case for channel url for sharejs
  if(req.url.indexOf('/channel/') === 0) return next();
  
  sharejs.server.attach(app, options);
  res.render('pad', { id: req.params.id, user: req.madpad_user.user, username: req.params.username });
});


app.get('/colors', function(req, res){
  res.render('colors');
});

// var newPad = new Pad({
//   name: "sifxtreme_code_hello",
//   owner: "53e05b93f6328bfd0b07f506",
//   writeAccess: true,
//   readAccess: true,
//   codeType: 'html'
// });

// newPad.save(function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log(newPad)
//   }
// })


// port
server.listen(5000);

module.exports = app
