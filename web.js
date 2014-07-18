require('coffee-script');

var express = require('express');
var server = express();

var hbs = require('hbs');
server.set('view engine', 'html');
server.engine('html', hbs.__express);
server.use(express.static('public'));

var server2 = require('http').Server(server);
var io = require('socket.io').listen(server2, {log:false});

var sharejs = require('share');
// var redis = require('redis');
var options = {
  db: {type: 'none'},
  browserChannel: {cors: '*'},
  auth: function(client, action) {
    // This auth handler rejects any ops bound for docs starting with 'readonly'.
    if (action.name === 'submit op' && action.docName.match(/^readonly/)) {
      action.reject();
    } else {
      action.accept();
    }
  }
};

io.on('connection', function(socket){
  socket.on('room', function(room){
    socket.join(room);
  });
  socket.on('chat', function(data){
    socket.broadcast.to(data.room).emit('newMessage', data.message);
  });
  
});

server.get('/', function(request, response) {
  var randomstring = require('randomstring');
  response.render('index', {random: randomstring.generate(3)});
});
server.get('/:id', function(request, response){
  response.render('textarea', {id: request.params.id});
  sharejs.server.attach(server, options);
  // response.render('pad', {id: request.params.id});
});

server2.listen(5000);