module.exports = function(io){

  var allConnections = {
    data: [],
    addToRoom: function(data){
      if(!data.room) return;
      if(!data.user) return;
      if(!data.socketID) return;

      var roomData = []
      if(this.data[data.room] != undefined){
        roomData = this.data[data.room]
      }

      for(var i = roomData.length - 1; i >= 0; i--){
        if(data.user.username && roomData[i].user.username == data.user.username){
          roomData.splice(i, 1);
        }
        // add something here about same socket id
      }

      roomData.push({socketID: data.socketID, user: data.user});

      this.data[data.room] = roomData;
    },
    removeFromRoom: function(data){
      if(!data.room) return;
      if(!data.socketID) return;

      var roomData = [];
      if(this.data[data.room] != undefined){
        roomData = this.data[data.room]
      }

      for(var i = 0; i < roomData.length; i++){
        if(roomData[i].socketID == data.socketID){
          roomData.splice(i, 1);
        }
      }

      this.data[data.room] = roomData;

      if(roomData.length == 0) delete(this.data[data.room]);
    },
    getRoom: function(room){
      return this.data[room];
    },
    clearAll: function(){
      this.data = [];
    },
    printData: function(){
      return JSON.stringify(this.data);
    }
  }

  io.on('connection', function(socket){
    
  	var sessions = require('./cookie.js');
  	var Pad = require('./models/pad.js');
    var User = require('./models/user.js');

    // code to do debugging on client
    socket.on('d', function(){
      console.log(allConnections.data)
    });

    
    // join room initially
    socket.on('room', function(data){
      if(!data.room) return;

      socket.join(data.room);

      data.socketID = socket.id;

      // add person to room
      allConnections.addToRoom(data);

      // sent all room data to a user who just joined the room
      socket.emit('chatPeople', allConnections.getRoom(data.room));

      // broadcast the user who just joined the room
      socket.broadcast.to(data.room).emit('chatJoined', data);

    });

    // someone left the chat room
    socket.on('disconnect', function(){
      for(var i=0; i<socket.rooms.length; i++){
        var roomID = socket.rooms[i];
        
        // run remove from room
        allConnections.removeFromRoom({room: roomID, socketID: socket.id})

        // broadcast to all rooms that a member has left
        socket.broadcast.to(roomID).emit('chatLeft', socket.id);
      }
      
    });

    // chat room
    socket.on('chat', function(data){
    	if(!data.room) return;

      data.socketID = socket.id;
      socket.broadcast.to(data.room).emit('chatSent', data);
    });

    /* ***************************************************************************** */

    // get user id from socket
    var getUserIdFromSocket = function(cookie){
      var user = sessions.getUserData(cookie);
      var userID = '';

      if(user && user.content && user.content.user && user.content.user._id){
        userID = user.content.user._id;
      }

      return userID;
    }

    // change code language
    socket.on('modeChanged', function(data){
    	if(!data.room) return;
      if(typeof data.codeMode === 'undefined') return;

      console.log('socket modeChanged');

      var userID = getUserIdFromSocket(socket.request.headers.cookie);

      Pad.findOne({name: data.room}, function(err, pad){
        if(err){
          // TO DO - ERROR CHECKING
          console.log(err);
        }
        else {
        	// if it's a public pad or we are the owner
        	if(pad.writeAccess || pad.owner == userID){
        		Pad.findByIdAndUpdate(pad._id, {$set: {codeType: data.codeMode}}, function(err, pad){
  						if(err){
  							// TO DO - ERROR CHECKING
  							console.log(err);
  						}
  			    });
        		socket.broadcast.to(data.room).emit('changeMode', data.codeMode);
        	}
        }
      });
      
    });

    // close chat window if owner
    socket.on('toggleChat', function(data){
      if(!data.room) return;
      if(typeof data.disable === 'undefined') return;

      console.log('socket toggleChat');

      var userID = getUserIdFromSocket(socket.request.headers.cookie);

      if(userID){
        Pad.findOne({name: data.room}, {owner: userID}, function(err, pad){
          if(err){
            // TO DO - ERROR CHECKING
            console.log(err);
          }
          else {

            Pad.findByIdAndUpdate(pad._id, {$set: {chatOn: !data.disable}}, function(err, pad){
              if(err){
                // TO DO - ERROR CHECKING
                console.log(err);
              }
            });
            socket.broadcast.to(data.room).emit('toggleChat', !data.disable);
          }
        })
      }
    });

    // change privacy on pads
    socket.on('togglePrivacy', function(data){
      if(!data.room) return;

      console.log('socket togglePrivacy');

      var userID = getUserIdFromSocket(socket.request.headers.cookie);

      if(userID){
        Pad.findOne({name: data.room}, {owner: userID}, function(err, pad){
          if(err){
            // TO DO - ERROR CHECKING
            console.log(err);
          }
          else {
            
            Pad.findByIdAndUpdate(pad._id, {$set: {writeAccess: data.write, readAccess: data.read}}, function(err, pad){
              if(err){
                // TO DO - ERROR CHECKING
                console.log(err);
              }
              else{
                socket.broadcast.to(data.room).emit('togglePrivacy', data.type);
              }
            })
            
          }
        });
      }
    });

    var filterURL = function(url){
      var endsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      }

      if(endsWith(url, '/')){
        url = url.slice(0, -1);
      }

      return url;
    }

    // change favorites on pads
    socket.on('favorite', function(data){
      if(!data.padName) return;

      console.log('socket favorite');

      var userID = getUserIdFromSocket(socket.request.headers.cookie);

      if(userID){
        User.findById(userID, function(err, user){
          if(err){
            // TO DO - ERROR CHECKING
            console.log(err);
          }
          else{
            if(user){
              for(var i=0; i<user.pads.length; i++){
                var checkName = filterURL(data.padName);
                if(checkName == user.pads[i].url){
                  user.pads[i].favorite = data.favorite;
                }
              }
              User.findByIdAndUpdate(userID, {$set: {pads: user.pads}}, function(err){
                if(err){
                  // TO DO - ERROR CHECKING
                  console.log(err);
                }
              })
            }
          }
        });
      }
    });


    // delete pad from user preferences
    var deletePadFromUserPads = function(userID, padToDelete, callback){
      if(!userID) return;

      User.findById(userID, function(err, user){
        if(err){
          // TO DO - ERROR CHECKING
          console.log(err);
        }
        else{
          if(user){
            var newPads = user.pads;

            // we don't want to delete the home pad
            if(padToDelete == filterURL(user.username + '/home')) return;

            // find the pad you need to delete 
            for(var i=0; i<newPads.length; i++){
              if(newPads[i].url == padToDelete){
                newPads.splice(i, 1);
              }
            }

            User.findByIdAndUpdate(userID, {$set: {pads: newPads}}, function(err){
              if(err){
                // TO DO - ERROR CHECKING
                console.log(err);
              }
              else{
                if(typeof callback == 'function'){
                  callback();
                }
              }
            })
          }
        }
      });
    }

    // delete recent pads from left side
    socket.on('deleteRecent', function(data){
      console.log('socket deleteRecent');
      var userID = getUserIdFromSocket(socket.request.headers.cookie);
      deletePadFromUserPads(userID, data);
    });

    // delete pad
    socket.on('deletePad', function(data){
      if(!data.room) return;
      if(!data.padName) return;
      if(!data.padURL) return;
      
      console.log('socket deletePad');

      var userID = getUserIdFromSocket(socket.request.headers.cookie);

      var emit = function(){
        socket.emit('padDeleted', true);
        socket.broadcast.to(data.room).emit('padDeleted', true);
      }

      // don't want to delete home template
      var padURLArray = data.padURL.split('/');
      if(padURLArray[1] && padURLArray[1] == 'home'){
        return;
      }

      // delete pad from mongo
      Pad.remove({name: data.padName, owner: userID}, function(err){
        if(err){
          // TO DO - ERROR CHECKING
          console.log(err);
        }
        else{
          // not delete pad from users pad field
          deletePadFromUserPads(userID, data.padURL, emit);    
        }
      })

    })


  });

};