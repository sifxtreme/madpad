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
    socket.broadcast.to(data.room).emit('newMessage', data.message);
  });
});

/* ***************************************************************************** */

// ROUTES

app.get('/', function(request, response) {
  var randomstring = require('randomstring');
  response.render('index', {random: randomstring.generate(3)});
});
app.get('/:id', function(request, response){
  response.render('pad', {id: request.params.id});
  sharejs.server.attach(app, options);
});

server.listen(5000);