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

var getPadObject = function(write, read, type, chat){
  return {
    isTextPad: true,
    writeAccess: write,
    readAccess: read,
    type: type,
    chat: chat
  }
}

var addToPublicPadCookie = function(reqObject, padURL, padType){
  var compare = function(a,b){
    if (a.date > b.date)
      return -1;
    if (a.date < b.date)
      return 1;
    return 0;
  }

  var containsObject = function(obj, list){
    for(var i = 0; i < list.length; i++) {
      var current = list[i];
      var obj1 = {}, obj2 = {};
      obj1[list[i].type] = list[i].url;
      obj2[obj.type] = obj.url;
      if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
      }
    }
    return false;
  }

  var uniqueObjects = function(a){
    var returnObj = [];
    for(var i = 0; i<a.length; i++){
      if(!containsObject(a[i], returnObj)){
        returnObj.push(a[i]);
      }
    }
    return returnObj;
  }

  var currentPads = reqObject.my_pads.pads || [];
  var dateNow = new Date().toISOString();
  currentPads.push({type: padType, url: padURL, date: dateNow});
  currentPads.sort(compare);
  currentPads = uniqueObjects(currentPads);

  return currentPads;
}

var formatPublicPadCookie = function(cookie){
  if(typeof cookie !== 'object') return false;
  var favoritePads = [], privatePads = [], sharedPads = [], publicPads = [];
  for(var i=0; i<cookie.length; i++){
    var p = cookie[i];
    if(typeof p.type !== 'undefined'){
      if(p.type == 'favorite'){
       favoritePads.push(p.url); 
      }
      else if(p.type == 'private'){
        privatePads.push(p.url);
      }
      else if(p.type == 'shared'){
        sharedPads.push(p.url);
      }
      else if(p.type == 'public'){
        publicPads.push(p.url);
      }
    }
  }

  return {favoritePads: favoritePads, privatePads: privatePads, sharedPads: sharedPads, publicPads: publicPads}
}

// code pad
app.get('/code/:id', function(req, res){
  var myPads = {};

  req.my_pads.pads = addToPublicPadCookie(req, 'code/' + req.params.id, 'public');
  myPads = formatPublicPadCookie(req.my_pads.pads);


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
            res.render('pad', { id: req.params.id, user: req.madpad_user.user, userRoom: '', pad: padObject, myPads: myPads });
          }
        })
      }
      else{ // pad already in DB
        padObject.type = pad.codeType;
        res.render('pad', { id: req.params.id, user: req.madpad_user.user, userRoom: '', pad: padObject, myPads: myPads });        
      }
    }
  });
  
});

// text pad
app.get('/:id', function(req, res){
  var myPads = {};
  req.my_pads.pads = addToPublicPadCookie(req, '' + req.params.id, 'public');
  myPads = formatPublicPadCookie(req.my_pads.pads);

  sharejs.server.attach(app, options);
  var padObject = getPadObject(true, true, 'textpad', true);
  res.render('pad', { id: req.params.id, user: req.madpad_user.user, userRoom: '', pad: padObject, myPads: myPads });
});

// home page
app.get('/', function(req, res) {
  sharejs.server.attach(app, options);
  res.render('index');
});

// post to create a new pad
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
        });
      }
      else{ // pad already in DB
        res.send({ error: 'true', errorType: 'existence'}); 
      }
    }
  });  

});

// user name pads
app.get('/:username/:id', function(req, res, next){
  // edge case for channel url for sharejs
  if(req.params.username == 'channel') return next();

  var myPads = {};

  var padObject = getPadObject(true, true, 'textpad', true);

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
          
          padObject.writeAccess = pad.writeAccess;
          padObject.readAccess = pad.readAccess;
          padObject.chat = pad.chatOn;
          if(typeof pad.codeType !== 'undefined' && pad.codeType != 'textpad'){
            padObject.isTextPad = false;
            padObject.type = pad.codeType;
          }

          req.my_pads.pads = addToPublicPadCookie(req, userRoom + '/' + req.params.id, 'shared');
          myPads = formatPublicPadCookie(req.my_pads.pads);

          sharejs.server.attach(app, options);
          res.render('pad', { id: roomID, user: req.madpad_user.user, usersRoom: userRoom, pad: padObject, myPads: myPads });

        }        
      }
    }
  })

});



// port number
server.listen(5000);

module.exports = app