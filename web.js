require('coffee-script');

var express = require('express');
var server = express();
var redis = require('redis');
var sharejs = require('share');

var randomstring = require('randomstring');

var hbs = require('hbs');


server.use(express.static('public'));
server.use(express.static('views'));


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

console.log("ShareJS example server v" + sharejs.version);
console.log("Options: ", options); 

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.server.attach(server, options);

server.listen(5000);




