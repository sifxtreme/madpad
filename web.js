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
  hbs.registerPartials(__dirname + '/views/partials');
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
  socket.on('toggleChat', function(data){
    if(!data.room) return;
    if(typeof data.disable === 'undefined') return;

    console.log('toggle chat for room: ' + data.room);
    console.log('Direction: ' + data.disable);

    var cookie = socket.request.headers.cookie;
    var user = sessions.getUserData(cookie);

    if(user && user.content && user.content.user && user.content.user._id){
      var userID = user.content.user._id; 
      console.log(userID);
      console.log(data.room);
      Pad.findOne({name: data.room}, {owner: userID}, function(err, pad){
        if(err){
          // TO DO - ERROR CHECKING
          console.log(err);
        }
        else {
          socket.broadcast.to(data.room).emit('toggleChat', !data.disable);
          // TO DO - save toggle chat option to pad
        }
      })
    }
  });

  socket.on('toggleWrite', function(data){
    console.log('socket toggleWrite');
  });

  socket.on('toggleRead', function(data){
    console.log('socket toggleRead');
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

var getPadObject = function(write, read, type, chat){
  return {
    isTextPad: true,
    writeAccess: write,
    readAccess: read,
    type: type,
    chat: chat
  }
}

// code pad
app.get('/code/:id', function(req, res){
  sharejs.server.attach(app, options);
  var id = req.params.id;
  var padObject = getPadObject(true, true, 'text', true);
  padObject.isTextPad = false;
  Pad.findOne({'name': 'code_' + id}, function(err, pad){
    if(err){
      // TODO - add error logging here
      console.log('Error: ' + err);
      // render error page
    }
    else {
      if(!pad){ // pad not in DB
        var newPad = new Pad({
          name: 'code_' + id,
          owner: 'OWNER',
          writeAccess: true,
          readAccess: true,
          codeType: 'text',
          chatOn: true
        })
        newPad.save(function(err){
          if(err){
            // TODO - add error logging here
            console.log('Error: ' + err);
            // render error page
          }
          else{
            res.render('pad', {id: req.params.id, user: req.madpad_user.user, pad: padObject });
          }
        })
      }
      else{ // pad already in DB
        padObject.type = pad.codeType;
        res.render('pad', {id: req.params.id, user: req.madpad_user.user, pad: padObject });        
      }
    }
  });
  
});

// text pad
app.get('/:id', function(req, res){
  sharejs.server.attach(app, options);
  var padObject = getPadObject(true, true, 'textpad', true);
  res.render('pad', {id: req.params.id, user: req.madpad_user.user, });
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

  // default set to textpad
  var id = req.params.id;
  var padType = 'textpad'
  if(req.body.pad.type == 'code'){
    padType = 'text'
  }

  // change to lowercase
  username = username.toLowerCase();
  id = id.toLowerCase();

  // always return json
  res.contentType('json');

  if(req.body.pad && typeof req.body.pad.ajax !== 'undefined' && req.body.pad.ajax !== 'true'){
    res.send({});
  }

  if(username != userRoom){
    res.send({ error: 'true', errorType: 'incorrect user'}); 
  }

  Pad.findOne({'name': username + '_' + id}, function(err, pad){
    if(err){
      // TODO - add error logging here
      console.log('Error: ' + err);
      // render error page
    }
    else {
      if(!pad){ // pad not in DB
        var newPad = new Pad({
          name: username + '_' + id,
          owner: userID,
          writeAccess: false,
          readAccess: false,
          codeType: padType,
          chatOn: false
        })
        newPad.save(function(err){
          if(err){
            // TODO - add error logging here
            console.log('Error: ' + err);
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

  var padObject = getPadObject('pad', true, true, 'textpad', true);

  var userRoom = req.params.username;
  var roomID = req.params.id;
  var padName = userRoom + '_' + roomID;

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
        if(username == userRoom){
          res.render('createpad');
        }
        // we are a not the correct user
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
          
          padObject.writeAccess = pad.readAccess;
          if(typeof pad.codeType !== 'undefined' && pad.codeType != 'textpad'){
            padObject.isTextPad = false;
            padObject.type = pad.codeType;
          }

          sharejs.server.attach(app, options);
          console.log(req.madpad_user.user);
          res.render('pad', { id: roomID, user: req.madpad_user.user, usersRoom: userRoom, pad: padObject });
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