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
    var cookie = socket.request.headers.cookie;
    console.log(sessions.getUserData(cookie))
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
    req.madpad_user.user = req.user;
    if(req.user.username) res.redirect('/' + req.user.username);
    else res.redirect('/account');
  });

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
  });
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    req.madpad_user.user = req.user;
    if(req.user.username) res.redirect('/' + req.user.username);
    else res.redirect('/account');
  });
app.get('/logout', function(req, res){
  req.madpad_user.reset();
  req.logout();
  res.redirect('/');
});

app.post('/sys/chat', function(req, res){
  console.log(req.madpad_user);
  console.log(req.body);
  res.format({
    text: function(){
      res.send('hey');
    },

    html: function(){
      res.send('<p>hey</p>');
    },

    json: function(){
      res.send({ message: 'hey' });
    }
  });
});

app.get('/account', function(req, res){
  if(req.madpad_user.user.username){
    console.log("there is already a username");
    res.redirect("/u/"+req.madpad_user.user.username + "/home");
  }
  else{
    var userData = getSocialAccount(req.madpad_user.user);
    res.render('account', {user: userData});
  }
  
  
});
app.post('/account', function(req, res){
  if(req.madpad_user.user.username){
    res.redirect("/u/" + req.madpad_user.user.username + "/home");
  }
  else {
    var userData = getSocialAccount(req.madpad_user.user);

    var username = req.body.username;
    var userError = validateUsername(username);

    if(userError && userError.error){
      res.render('account', {user: userData, error: userError.error, previousValue: username});
    }
    else{
    
      User.findOne({ username: username }, function(err, user){
        if(err){
          res.render('account', {user: userData, error: "Database error", previousValue: username});
        }
        else{

          if(user){
            console.log("ERROR 2");
            res.render('account', {user: userData, error: "User already exists", previousValue: username});
          }

          else{
            User.findByIdAndUpdate(userData.realID, { username: username }, options, function(err){
              if(err){
                console.log("SAVE USER ERROR AFTER SCREENNAME ENTER");
                console.log(err);
                res.render('account', {user: userData, error: "Error saving to DB", previousValue: username});
              }
              else{
                res.redirect("/u/" + username + "/home");
              }
            });
          }

        }

      });
    }

  }
  
});

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
  console.log(req.madpad_user);
  req.madpad_user.a = 'b'
  sharejs.server.attach(app, options);
  res.render('pad', {id: req.params.id, user: req.madpad_user.user });
});

app.get('/', function(req, res) {
  sharejs.server.attach(app, options);
  res.render('index');
});


app.get('/u/:username/:id', function(req, res){
  sharejs.server.attach(app, options);
  res.render('code', { id: req.params.id, user: req.madpad_user.user, username: req.params.username });
});


app.get('/colors', function(req, res){
  res.render('colors');
});

function validateUsername(name){
  if(name == ""){
    return {error: "Must select username!"}
  }
  else if(/[^a-zA-Z0-9]/.test(name)){
    return {error: "Must only contain alphanumeric characters in username"}
  }
  else{
    return;
  }
}

function getSocialAccount(user){
  var userID, userName, userPicture,
    facebookAuth = false,
    githubAuth = false;

  if(user.facebookID && user.githubID){
    var facebookDate = new Date(user.facebookDate);
    var githubDate = new Date(user.githubDate);
    if(facebookDate > githubDate){
      facebookAuth = true;
    }
    else{
      githubAuth = true;
    }
  }
  else if(user.facebookID){
    facebookAuth = true;
  }
  else if(user.githubID){
    githubAuth = true;
  }

  if(facebookAuth){
    userID = user.facebookID;
    userName = user.facebookName;
    userPicture = user.facebookPicture;
  }
  if(githubAuth){
    userID = user.githubID;
    userName = user.githubName;
    userPicture = user.githubPicture;
  }

  return {realID: user._id, id: userID, name: userName, picture: userPicture};
}

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
