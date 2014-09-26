$(document).ready(function(){

	madpadChat = {

		options: {
			colorArray: ["#be3333", "#be336e", "#be339f", "#ac33be", "#7e33be", "#4d33be", "#334dbe", "#3385be", "#33acbe", "#33beaf", "#33be85", "#33be47", "#78be33", "#9cbe33", "#bcbe33", "#be9f33", "#be7b33", "#be5733"],
			animalArray: ["panda", "tiger", "cheetah", "gorilla", "monkey", "robin", "toucan", "elephant", "chimp", "sheep", "rooster", "dog", "cow", "chicken", "rabbit", "pig", "horse", "duck", "parrot", "mouse", "puppy", "cat", "lynx", "hamster", "ferret", "warthog", "wolf", "eagle", "owl", "bear", "hedgehog", "fox", "moose", "squirrel"],
			randomize: function(){
				return {
					color: this.colorArray[Math.floor(Math.random() * this.colorArray.length)],
					animal: this.animalArray[Math.floor(Math.random() * this.animalArray.length)],
				}
			}
		},
		
		scrollDown: function(){
			$('#messages').stop().animate({
			  scrollTop: $("#messages")[0].scrollHeight
			}, 800);
		},

		replaceEmoticons: function(str){
			var emoticons = [
				{regex: /O:\)/g, image: 'angel'},
				{regex: /O:-\)/g, image: 'angel'},
				{regex: />:\(/g, image: 'angry'},
				{regex: />:-\(/g, image: 'angry'},
				{regex: /\(baseball\)/g, image: 'baseball'},
				{regex: /\(basketball\)/g, image: 'basketball'},
				{regex: /\(bear\)/g, image: 'bear'},
				{regex: /\(beer\)/g, image: 'beer'},
				{regex: /\^.\^/g, image: 'bigsmile'},
				{regex: /\(bomb\)/g, image: 'bomb'},
				{regex: /\(cat\)/g, image: 'cat'},
				{regex: /\(cheers\)/g, image: 'cheers'},
				{regex: /:-\//g, image: 'confused'},
				{regex: /;\(/g, image: 'crying'},
				{regex: /;-\(/g, image: 'crying'},
				{regex: /\(devil\)/g, image: 'devil'},
				{regex: /\(dog\)/g, image: 'dog'},
				{regex: /\(dragon\)/g, image: 'dragon'},
				{regex: /X-D/g, image: 'ecstatic'},
				{regex: /XD/g, image: 'ecstatic'},
				{regex: /:\|/g, image: 'eh'},
				{regex: /\(elsa\)/g, image: 'elsa'},
				{regex: /\(fire\)/g, image: 'fire'},
				{regex: /\(football\)/g, image: 'football'},
				{regex: /\(frog\)/g, image: 'frog'},
				{regex: /\(futbol\)/g, image: 'futbol'},
				{regex: /\(ghost\)/g, image: 'ghost'},
				{regex: /8-\)/g, image: 'glasses'},
				{regex: /8\)/g, image: 'glasses'},
				{regex: /:\)/g, image: 'happy'},
				{regex: /:-\)/g, image: 'happy'},
				{regex: /<3/g, image: 'heart'},
				{regex: /:-\*/g, image: 'kiss'},
				{regex: /:\*/g, image: 'kiss'},
				{regex: /\(koala\)/g, image: 'koala'},
				{regex: /\(lightning\)/g, image: 'lightning'},
				{regex: /\(monkey\)/g, image: 'monkey'},
				{regex: /\(octopus\)/g, image: 'octopus'},
				{regex: /:o/g, image: 'oh'},
				{regex: /:O/g, image: 'oh'},
				{regex: /:-o/g, image: 'oh'},
				{regex: /:-O/g, image: 'oh'},
				{regex: /-_-/g, image: 'okay'},
				{regex: /\(panda\)/g, image: 'panda'},
				{regex: /\(poop\)/g, image: 'poop'},
				{regex: /\(rabbit\)/g, image: 'rabbit'},
				{regex: /:D/g, image: 'reallyhappy'},
				{regex: /:-D/g, image: 'reallyhappy'},
				{regex: /\(riceball\)/g, image: 'riceball'},
				{regex: /\:\(/g, image: 'sad'},
				{regex: /\:-\(/g, image: 'sad'},
				{regex: /\(santa\)/g, image: 'santa'},
				{regex: /\(snow\)/g, image: 'snow'},
				{regex: /\(snowman\)/g, image: 'snowman'},
				{regex: /\(stuart\)/g, image: 'stuart'},
				{regex: /\(sun\)/g, image: 'sun'},
				{regex: /\(tennis\)/g, image: 'tennis'},
				{regex: /\(tiger\)/g, image: 'tiger'},
				{regex: /\(toothless\)/g, image: 'toothless'},
				{regex: /:p/g, image: 'tongue'},
				{regex: /:P/g, image: 'tongue'},
				{regex: /:-p/g, image: 'tongue'},
				{regex: /:-P/g, image: 'tongue'},
				{regex: /\;p/g, image: 'tongue-wink'},
				{regex: /\;P/g, image: 'tongue-wink'},
				{regex: /\;-p/g, image: 'tongue-wink'},
				{regex: /\;-P/g, image: 'tongue-wink'},
				{regex: /\(tup\)/g, image: 'thumbsup'},
				{regex: /\(tdown\)/g, image: 'thumbsdown'},
				{regex: /\(water\)/g, image: 'water'},
				{regex: /\(whale\)/g, image: 'whale'},
				{regex: /o\.o/g, image: 'what'},
				{regex: /O\.O/g, image: 'what'},
				{regex: /;\)/g, image: 'wink'},
				{regex: /;-\)/g, image: 'wink'},
				{regex: /\(seenoevil\)/g, image: 'seenoevil'},
				{regex: /\(hearnoevil\)/g, image: 'hearnoevil'},
				{regex: /\(speaknoevil\)/g, image: 'speakoevil'},
			]

			for(var i = 0; i<emoticons.length; i++){
				str = str.replace(emoticons[i].regex,
					'<img style="width: 18px;" src="/images/emoticons/' + emoticons[i].image + '.png"/>');
			}

			return str;
		},

	 	prepareChatMessage: {
	 		convertLinks: function(str){
				return Autolinker.link(str);
	 		},
	 		convertLineBreaks: function(str){
	 			return str.replace(/\r\n|\r|\n/g,"<br />");
	 		},
	 	},

	 	appendChat: function(messageObject){
	 		var message = this.prepareChatMessage.convertLineBreaks(messageObject.message);
			message = this.replaceEmoticons(message);
			message = this.prepareChatMessage.convertLinks(message);
			
			var chatUserName = messageObject.user.name;
			var whichClass = 'user'
			if((userID && madpadUserData.userID == messageObject.user.profileId) || (typeof messageObject.user.id !== 'undefined' && madpadUserData.unknown.id == messageObject.user.id)){
				chatUserName = 'me';
			}
			else{
				whichClass = 'other-user';
			}

			// TO-DO ugly - change this later
			var messageToAppend = "<div class='" + whichClass + "'><div class='message-area'>";
			if(!messageObject.user.profileId){
				messageToAppend += '<div style="background:'+ messageObject.user.color +' url(\'/images/chat/animals/'+ messageObject.user.animal +'.png\') no-repeat center center; background-size: 44px 44px;" class="avatar"></div>';	
			}
			else{
				messageToAppend += '<div style="background:url('+ messageObject.user.picture +') no-repeat center center; background-size: 44px 44px" class="avatar"></div>';
			}
			
			messageToAppend += '<div class="content">' + message +'<div class="name">' + chatUserName + '</div></div>';
			messageToAppend += '</div></div>';
			
			$('#messages').append(messageToAppend);
			
			this.scrollDown();
	 		
		}

	}

	$(document).ready(function(){
		if(!$('.madpadChatForm').length) return;

		var notSignedInUserObject = madpadChat.options.randomize();

		// submitting to chat
		$('.madpadChatForm').submit(function(){
			var msg = $('#m').val();
			if(msg == '') return false;

			var msgObject = {
				room: padName,
				message: msg,
				user: {
					name: madpadUserData.name,
					username: madpadUserData.username,
					picture: madpadUserData.picture,
					profileId: userID					
				}
			}

			// we are not a logged in user
			if(!userID){
				// we have an animal cookie set
				if(madpadUserData && madpadUserData.unknown && madpadUserData.unknown.animal){
					msgObject.user = madpadUserData.unknown;
				}
				else{
					msgObject.user = notSignedInUserObject;					
				}
			}

			madpadSocket.emit('chat', msgObject);
			$('#m').val('');
			msgObject.user.name = "me";
			madpadChat.appendChat(msgObject);
			msgObject.user.name = "";
			return false;
		});

		// submit chat form
		function sendMessages(){
			$('.message-input').keypress(function(e){
				/* allows enter to send messages and shift enter to make new line */
				if(e.which == 13 && !e.shiftKey){
					$(this).submit();
					return false;
				}
			});
		}
		sendMessages();

		recentChatters = {
			clearOut: function(){
				$('.avatar-list ul').empty();
			},
			createPersonNode: function(user){
				var li = document.createElement('li');
				li.className = 'tooltip'
				li.setAttribute('name', user.username);
				var img = document.createElement('img');
				user.picture = user.picture.replace('&amp;', '&');
				img.src = user.picture;
				img.className = 'avatar-user';
				if(user.username == usersRoom) img.className += ' avatar-owner';
				li.appendChild(img);
				$('.avatar-list ul').append(li);
			},
			createAllPeople: function(){
				if(typeof this.formattedData !== 'object') return;

				this.clearOut();
				this.formatData();

				var guestNumber = 0;

				for(var i=0; i < this.formattedData.length; i++){
					var singlePerson = this.formattedData[i];

					if(singlePerson.user.userID){
						this.createPersonNode(singlePerson.user);
					}
					else{
						guestNumber++;
						// get animal if exists, otherwise randomize
						var animal;
						if(singlePerson.user.unknown && typeof singlePerson.user.unknown.animal !== 'undefined'){
							animal = singlePerson.user.unknown.animal;
						}
						else{
							animal = madpadChat.options.randomize().animal;	
						}
						var userData = {
							username: 'guest_' + guestNumber,
							picture: '/images/chat/animals/' + animal + '.png'
						}
						this.createPersonNode(userData);
					}

				}

			},
			people: [],
			formattedData: [],
			formatData: function(){
				var tmpArray = [];
				var owner = [];
				var self = [];
				
				var checkDuplicatesArray = [];
				var getUniques = function(arr) {
			    var hash = {}, result = [];
			    for ( var i = 0, l = arr.length; i < l; ++i ) {
			    	var uniqueId = arr[i].user.userID || arr[i].user.unknown.id;
		        if ( !hash.hasOwnProperty(uniqueId) ) { //it works with objects! in FF, at least
	            hash[uniqueId] = true;
	            result.push(arr[i]);
		        }
			    }
			    return result;
				}

				var peopleCopy = this.people;

				for(var i=0; i<peopleCopy.length; i++){
					var p = peopleCopy[i];
					// push owner
					if(p.user.userID && p.user.username == usersRoom){
						owner.push(p);
					}
					// push logged in self
					else if(p.user.userID && p.user.userID == madpadUserData.userID){
						self.push(p);
					}
					// push guest self
					else if(p.user.unknown && p.user.unknown.id && p.user.unknown.id == madpadUserData.unknown.id){
						self.push(p);
					}
					else{
						tmpArray.push(p);
					}
				}

				// filter out duplicates
				tmpArray = getUniques(tmpArray);

				// we want self to be first if owner isn't there
				if(self[0]){
					tmpArray.unshift(self[0]);
				}
				// we want owner to be first
				if(owner[0]){
					tmpArray.unshift(owner[0]);	
				}
				
				this.formattedData = tmpArray;

			},
			addPerson: function(data){
				this.people.push({user: data.user, socketID: data.socketID});
			},
			removePerson: function(socketID){
				for(var i=0; i < this.people.length; i++){
					if(this.people[i].socketID == socketID){
						this.people.splice(i,1);
					}
				}
			},
		}

		// we initially joined chat and are seeing all the people in the chat room
		madpadSocket.on('chatPeople', function(data){
			recentChatters.people = data;
			recentChatters.createAllPeople();
		})

		// user joined chat
		madpadSocket.on('chatJoined', function(data){
			recentChatters.addPerson(data);
			recentChatters.createAllPeople();
		})

		// user left chat
		madpadSocket.on('chatLeft', function(data){
			recentChatters.removePerson(data)
			recentChatters.createAllPeople();
		})
		
		// receiving chat object from socket
		madpadSocket.on('chatSent', function(data){
			madpadChat.appendChat(data);
		});

		// toggle chat window functionality
		var toggleChat = function(){

			// open chat window
			var openChat = function(){
				$('.chatoff-icon').removeClass('chatoff-icon').addClass('chaton-icon');
				$('.middle').removeClass('no-chat-fix');
				$('.right').show();				
			};

			// close chat window
			var closeChat = function(){
				$('.chaton-icon').removeClass('chaton-icon').addClass('chatoff-icon');
				$('.middle').addClass('no-chat-fix');
				$('.right').hide();
			};

			// set up event listeners
			$("body").delegate(".chaton-icon", "click", function(){
				closeChat();
				madpadSocket.emit('toggleChat', {room: padName, disable: true});
			})
			$("body").delegate(".chatoff-icon", "click", function(){
				openChat();
				madpadSocket.emit('toggleChat', {room: padName, disable: false});
			})

			// toggle chat if we are told to do so by owner
			madpadSocket.on('toggleChat', function(whichWay){
				if(!whichWay){
					closeChat();
				}
				else{
					openChat();
				}
			});

		}();

	});

});
