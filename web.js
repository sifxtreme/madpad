require('coffee-script');

var express = require('express');
var server = express();

var hbs = require('hbs');
server.set('view engine', 'html');
server.engine('html', hbs.__express);
server.use(express.static('public'));

server.use(express.static('public'));

var sharejs = require('share');
var redis = require('redis');
var options = {
  db: {type: 'redis'},
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

var randomstring = require('randomstring');

server.get('/', function(request, response) {
  response.render('index', {random: randomstring.generate(3)});
});
server.get('/:id', function(request, response){
  response.render('textarea', {id: request.params.id});
  // response.render('pad', {id: request.params.id});
});

console.log("ShareJS example server v" + sharejs.version);
console.log("Options: ", options); 

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.server.attach(server, options);

server.listen(5000);




