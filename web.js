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

// serialize and deserialize
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

    console.log('disable chat for room: ' + data.room);

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

  // // NEED COOKIE INFO
  // socket.on('cookieInfo', function(s){
  //   var cookie = socket.request.headers.cookie;
  //   var user = sessions.getUserData(cookie);
  //   console.log(user);
  // });
});

/* ***************************************************************************** */

// ROUTES

require('./routes/account')(app, passport);

// code pad
app.get('/code/:id', function(req, res){
  sharejs.server.attach(app, options);
  var id = req.params.id;
  Pad.findOne({'name': 'code_' + id}, function(err, pad){
    if(err){
      // TODO - add error logging here
      console.log("Error: " + err);
      // render error page
    }
    else {
      if(!pad){ // pad not in DB
        var newPad = new Pad({
          name: "code_" + id,
          owner: "OWNER",
          writeAccess: true,
          readAccess: true,
          codeType: 'text',
          chatOn: true
        })
        newPad.save(function(err){
          if(err){
            // TODO - add error logging here
            console.log("Error: " + err);
            // render error page
          }
          else{
            var padObject = {
              type: newPad.codeType
            }
            res.render('code', {id: req.params.id, user: req.madpad_user.user, pad: padObject });
          }
        })
      }
      else{ // pad already in DB
        var padObject = {
          type: pad.codeType
        }
        res.render('code', {id: req.params.id, user: req.madpad_user.user, pad: padObject });        
      }
    }
  });
  
});

// text pad
app.get('/:id', function(req, res){
  sharejs.server.attach(app, options);
  res.render('pad', {id: req.params.id, user: req.madpad_user.user });
});

app.get('/', function(req, res) {
  sharejs.server.attach(app, options);
  res.render('index');
});


app.post('/:username/:id', function(req, res, next){
  if(req.params.username == 'channel') return next();

  var userRoom = req.params.username;
  var userID = '';
  var username = '';
  if(req.madpad_user && req.madpad_user && req.madpad_user.user && req.madpad_user.user._id){
    userID = req.madpad_user.user._id;
    username = req.madpad_user.user.username;
  }

  var id = req.params.id.toLowerCase();
  var padType = "textpad"
  if(req.body.pad.type == "code"){
    padType = "text"
  }

  res.contentType('json');

  if(username != userRoom){
    res.send({ error: 'true', errorType: 'incorrect user'}); 
  }

  Pad.findOne({'name': username + '_' + id}, function(err, pad){
    if(err){
      // TODO - add error logging here
      console.log("Error: " + err);
      // render error page
    }
    else {
      if(!pad){ // pad not in DB
        var newPad = new Pad({
          name: username + "_" + id,
          owner: userID,
          writeAccess: false,
          readAccess: false,
          codeType: padType,
          chatOn: false
        })
        newPad.save(function(err){
          if(err){
            // TODO - add error logging here
            console.log("Error: " + err);
            // render error page
          }
          else{
            res.send({success: 'true'});
          }
        })
      }
      else{ // pad already in DB
        res.send({ error: 'true', errorType: 'existence'}); 
      }
    }
  });  

});
app.get('/:username/:id', function(req, res, next){
  // edge case for channel url for sharejs
  if(req.params.username == 'channel') return next();

  var userroom = req.params.username;
  var roomID = req.params.id;
  var padName = userroom + '_' + roomID;
  // console.log(padName);

  var userID = '';
  var username = '';
  if(req.madpad_user && req.madpad_user && req.madpad_user.user && req.madpad_user.user._id){
    userID = req.madpad_user.user._id;
    username = req.madpad_user.user.username;
  }

  // TO-DO have 403 send correct status

  Pad.findOne({'name': padName}, function(err, pad){
    if(err){
      console.log(err);
    } 
    else{
      if(!pad){
        // we are logged in as the user in the url
        if(username == userroom){
          res.render('createpad');
        }
        // we are a stranger
        else{
          res.render('403');
        }
      }
      else{
        // we arent the correct user and we are not allowed readAccess
        if(!pad.readAccess && pad.owner != userID){
          res.render('403');
        }
        else{ // we have readAccess
          
          sharejs.server.attach(app, options);
          var renderTemplate = 'pad';
          if(typeof pad.codeType !== 'undefined' && pad.codeType != 'textpad'){
            renderTemplate = 'code';
          }
          res.render(renderTemplate, { id: roomID, user: req.madpad_user.user, userroom: userroom });
        }        
      }
    }
  })

});


app.get('/colors', function(req, res){
  res.render('colors');
});

// port number
server.listen(5000);

module.exports = app