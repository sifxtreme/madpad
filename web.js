var express = require('express');
var app = express();

var server = require('http').createServer(app).listen(5000);

var randomstring = require('randomstring');

var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());

app.use(express.static('public'));

var io = require('socket.io').listen(server, {log: false});
 

io.sockets.on('connection', function (socket) {
    socket.on('message', function (msg) {
        // io.sockets.emit('message', msg);
        socket.emit('message', msg);
        socket.broadcast.emit('message', msg);
    });
});

// io.sockets.on('connection', function (socket) {
//  socket.on('connection', function(room){
//      // console.log('JOINING ROOM', room);
//      socket.join(room); 
//  });

//   socket.on('message', function(data) {
//     // console.log('SENDING MESSAGE TO CLIENT ' + data.message);
//     socket.broadcast.to(data.room).emit('message', data.message);
//     socket.emit.to(data.room).emit('message', data.message);
//   });

// });

app.get('/', function(request, response) {
    response.render('index', {random: randomstring.generate(3)});
});
app.get('/:id', function(request, response){
    response.render('pad', {id: request.params.id});
});

