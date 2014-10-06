module.exports = function(app){
	
	// get dependencies
	var mongoose = require('mongoose');
	var User = require('../models/user.js');
	var Pad = require('../models/pad.js');
	var padCookie = require('../padCookie.js');

	// get sharejs dependencies
	var redis = require('redis');
	var sharejs = require('share');
	var options = require('../privacy.js');

	var getPadObject = function(write, read, type){
	  return {
	    isTextPad: true,
	    writeAccess: write,
	    readAccess: read,
	    type: type
	  }
	}

	// get user data for chat
	var getUserDataForChat = function(user){
		var name = '', picture = '';

    var facebookAuth = false;
    var githubAuth = false;
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
			name = user.facebookName;
			picture = user.facebookPicture;
		}
		if(githubAuth){
			name = user.githubName;
			picture = user.githubPicture;			
		}

		return {name: name, picture: picture};
	}

	// get username and userid from cookie
	var getUserInfoFromCookie = function(req){
	  var userID = '', username = '', name = '', picture = '', unknown = {};

	  if(req.madpad_user && req.madpad_user.user && req.madpad_user.user._id){
	    userID = req.madpad_user.user._id;
	    username = req.madpad_user.user.username;

	    // get data for chat
	    var userData = getUserDataForChat(req.madpad_user.user);
	    name = userData.name;
	    picture = userData.picture;
	  }
	  else if(req.madpad_user && req.madpad_user.unknown){
	  	unknown = req.madpad_user.unknown;
	  }

	  return {_id: userID, username: username, name: name, picture: picture, unknown: unknown};
	}

	// set cookie object for logged out user
	var unknownUserOptions = {
		colorArray: ["#be3333", "#be336e", "#be339f", "#ac33be", "#7e33be", "#4d33be", "#334dbe", "#3385be", "#33acbe", "#33beaf", "#33be85", "#33be47", "#78be33", "#9cbe33", "#bcbe33", "#be9f33", "#be7b33", "#be5733"],
		animalArray: ["panda", "tiger", "cheetah", "gorilla", "monkey", "robin", "toucan", "elephant", "chimp", "sheep", "rooster", "dog", "cow", "chicken", "rabbit", "pig", "horse", "duck", "parrot", "mouse", "puppy", "cat", "lynx", "hamster", "ferret", "warthog", "wolf", "eagle", "owl", "bear", "hedgehog", "fox", "moose", "squirrel"],
		descriptions: ["ancient", "friendly", "cuddly", "malicious", "cute", "mean", "smelly", "adorable", "burly", "clumsy", "bitter", "diligent", "electric", "hopeful", "honored", "innocent", "jumbo", "mysterious", "neglected", "plump", "striking", "vivacious", "playful", "feisty", "messy", "loud", "nosy", "sassy", "curious", "tenacious", "fierce", "stubborn", "lazy", "bossy", "candid", "grumpy", "picky", "energetic", "loving", "smart", "noisy", "vicious", "helpful", "jealous"],
		randomize: function(){
			return {
				id: Math.random(),
				color: this.colorArray[Math.floor(Math.random() * this.colorArray.length)],
				animal: this.animalArray[Math.floor(Math.random() * this.animalArray.length)],
				name: this.descriptions[Math.floor(Math.random() * this.descriptions.length)]
			}
		}
	}

	// get user pads from db and render view
	var getUserPads = function(userID, padName, padType, callback){

	  User.findById(userID, function(err, user){
	    if(err){
	      // TODO - add error logging here
	      console.log('Error: ' + err);
	    }
	    else{
	      if(!user){
	        callback();
	      }
	      else{
	        var pads = user.pads || [];
	        pads = padCookie.sortAndAdd(pads, padName, padType);
	        var isFavorite = isPadFavorited(pads, padName);
	        setUserPads(userID, pads)
	        pads = padCookie.format(pads);
	        callback(pads, isFavorite);
	      }
	    }
	  });

	};

	// store user pads in db
	var setUserPads = function(userID, pads){
	  User.findByIdAndUpdate(userID, {$set: {pads: pads}}, function(err, user){
	    if(err){
	      // TO DO - ERROR CHECKING
	      console.log(err);
	    }
	  })
	};

	// is pad favorited?
	var isPadFavorited = function(pads, padName){
		if(typeof pads !== 'object') return false;
		if(!pads.length) return false;

		for(var i=0; i<pads.length; i++){
			if(pads[i].url == padName && pads[i].favorite){
				return true;
			}
		}
		return false;
	}

	// code pad
	app.get('/code/:id', function(req, res){
	  // attach sharejs server
	  sharejs.server.attach(app, options);

	  // get user info
	  var userInfo = getUserInfoFromCookie(req);
	  var userID = userInfo._id;
	  var username = userInfo.username.toLowerCase();
	  if(!username && Object.keys(userInfo.unknown).length == 0){
	  	var unknown = unknownUserOptions.randomize();
	  	req.madpad_user.unknown = unknown;
	  	userInfo.unknown = unknown;
	  }

	  // set up pad info
	  var padID = req.params.id.toLowerCase();
	  var padObject = getPadObject(true, true, 'text');
	  padObject.isTextPad = false;

	  var renderView = function(cookiePads, isFavorite){
	    Pad.findOne({'name': 'code_' + padID}, function(err, pad){
	      if(err){
	        // TODO - add error logging here
	        console.log('Error: ' + err);
	        res.render('500')
	      }
	      else {
	        if(!pad){ // pad not in DB
	          var newPad = new Pad({
	            name: 'code_' + padID,
	            owner: 'OWNER',
	            writeAccess: true,
	            readAccess: true,
	            codeType: 'text',
	          })
	          newPad.save(function(err){
	            if(err){
	              // TODO - add error logging here
	              console.log('Error: ' + err);
	              res.render('500');
	            }
	            else{
	              res.render('pad', { id: padID, user: userInfo, userRoom: '', pad: padObject, myPads: cookiePads, isFavorite: isFavorite });
	            }
	          })
	        }
	        else{ // pad already in DB
	          padObject.type = pad.codeType;
	          res.render('pad', { id: padID, user: userInfo, userRoom: '', pad: padObject, myPads: cookiePads, isFavorite: isFavorite });        
	        }
	      }
	    });
	  };

	  // my pads information
	  var myPads = {};
	  var newPadName = 'code/' + padID;
	  if(userID){ // we are logged in
	    getUserPads(userID, newPadName, 'public', renderView);
	  }
	  else{ // we are not logged in
	    req.my_pads.pads = padCookie.sortAndAdd(req.my_pads.pads, newPadName, 'public');
	    myPads = padCookie.format(req.my_pads.pads);
	    renderView(myPads);
	  }
	  
	});

	// text pad
	app.get('/:id', function(req, res){
	  // attach sharejs server
	  sharejs.server.attach(app, options);

	  // get user info
	  var userInfo = getUserInfoFromCookie(req);
	  var userID = userInfo._id;
	  var username = userInfo.username.toLowerCase();
	  if(!username && Object.keys(userInfo.unknown).length == 0){
	  	var unknown = unknownUserOptions.randomize();
	  	req.madpad_user.unknown = unknown;
	  	userInfo.unknown = unknown;
	  }

	  // set up pad info
	  var padID = req.params.id.toLowerCase();
	  var padObject = getPadObject(true, true, 'textpad');

	  var renderView = function(cookiePads, isFavorite){
	    res.render('pad', { id: padID, user: userInfo, userRoom: '', pad: padObject, myPads: cookiePads, isFavorite: isFavorite });    
	  }

	  // my pads information
	  var myPads = {};
	  var newPadName = padID;
	  if(userID){ // we are logged in
	    getUserPads(userID, newPadName, 'public', renderView);
	  }
	  else{ // we are not logged in
	    req.my_pads.pads = padCookie.sortAndAdd(req.my_pads.pads, newPadName, 'public');
	    myPads = padCookie.format(req.my_pads.pads);
	    renderView(myPads);
	  }

	});


	// post to create a new pad
	app.post('/:username/:id', function(req, res, next){
	  if(req.params.username == 'channel') return next();
	  
	  // get user info
	  var userInfo = getUserInfoFromCookie(req);
	  var userID = userInfo._id;
	  var username = userInfo.username.toLowerCase();

	  // get usersRoom
	  var userRoom = req.params.username.toLowerCase();

	  // default set to textpad
	  var padID = req.params.id.toLowerCase();
	  var padType = 'textpad'
	  if(req.body.pad.type == 'code'){
	    padType = 'text'
	  }

	  // always return json
	  res.contentType('json');

	  if(req.body.pad && typeof req.body.pad.ajax !== 'undefined' && req.body.pad.ajax !== 'true'){
	    res.send({});
	  }

	  if(username != userRoom){
	    res.send({ error: 'true', errorType: 'incorrect user'}); 
	  }

	  Pad.findOne({'name': username + '_' + padID}, function(err, pad){
	    if(err){
	      // TODO - add error logging here
	      console.log('Error: ' + err);
	      // render error page
	    }
	    else {
	      if(!pad){ // pad not in DB
	        var newPad = new Pad({
	          name: username + '_' + padID,
	          owner: userID,
	          writeAccess: false,
	          readAccess: false,
	          codeType: padType,
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

	  // get user info
	  var userInfo = getUserInfoFromCookie(req);
	  var userID = userInfo._id;
	  var username = userInfo.username.toLowerCase();
	  if(!username && Object.keys(userInfo.unknown).length == 0){
	  	var unknown = unknownUserOptions.randomize();
	  	req.madpad_user.unknown = unknown;
	  	userInfo.unknown = unknown;
	  }
	  if(req.madpad_user && req.madpad_user.just_loggedin){
  		req.madpad_user.just_loggedin = false;
  		userInfo.justLoggedIn = true;
	  }

	  // get usersRoom
	  var userRoom = req.params.username.toLowerCase();

	  // set up pad info
	  var padID = req.params.id.toLowerCase();
	  var padObject = getPadObject(true, true, 'textpad');
	  var padName = userRoom + '_' + padID;


	  Pad.findOne({'name': padName}, function(err, pad){
	    if(err){
	      console.log(err);
	    } 
	    else{
	      if(!pad){
	        // we are logged in as the user in the url
	        if(username == userRoom){
	          res.render('createpad', { id: padID, user: userInfo, usersRoom: userRoom});
	        }
	        // we are a not the correct user
	        else{
	        	res.status(404);
	          res.render('error', {user: userInfo, errorType: '404'});
	        }
	      }
	      else{
	        // we arent the correct user and we are not allowed readAccess
	        if(!pad.readAccess && pad.owner != userID){
	        	res.status(403);
	          res.render('error', {user: userInfo, errorType: '403'});
	        }
	        else{ // we have readAccess
	          
	          // more set up on pad info          
	          padObject.writeAccess = pad.writeAccess;
	          padObject.readAccess = pad.readAccess;
	          if(typeof pad.codeType !== 'undefined' && pad.codeType != 'textpad'){
	            padObject.isTextPad = false;
	            padObject.type = pad.codeType;
	          }

	          var renderView = function(cookiePads, isFavorite){
	            // attach sharejs server
	            sharejs.server.attach(app, options);
	            res.render('pad', { id: padID, user: userInfo, usersRoom: userRoom, pad: padObject, myPads: cookiePads, isFavorite: isFavorite });
	          }

	          // my pads information
	          var myPads = {};
	          var padType = 'shared'
	          var newPadName = userRoom + '/' + padID;
	          if(userID){ // we are logged in
	            if(username == userRoom) padType = 'private'
	            getUserPads(userID, newPadName, padType, renderView);
	          }
	          else{ // we are not logged in
	            req.my_pads.pads = padCookie.sortAndAdd(req.my_pads.pads, newPadName, padType);
	            myPads = padCookie.format(req.my_pads.pads);
	            renderView(myPads);
	          }

	        }        
	      }
	    }
	  })

	});

}

