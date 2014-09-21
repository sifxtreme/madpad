module.exports = function(socket){

	var sessions = require('./cookie.js');
	var Pad = require('./models/pad.js');
  
  // join room initially
  socket.on('room', function(room){
    socket.join(room);
  });
  
  // chat room
  socket.on('chat', function(data){
  	if(!data.room) return;
  	
    var messageObject = {'name': data.name, 'picture': data.picture, 'message': data.message, 'profileId': data.profileId};
    socket.broadcast.to(data.room).emit('newMessage', messageObject);
  });

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

};