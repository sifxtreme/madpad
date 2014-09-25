$(document).ready(function(){

	madpadChat = {

		options: {
			letterArray: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
			colorArray: ["#be3333", "#be336e", "#be339f", "#ac33be", "#7e33be", "#4d33be", "#334dbe", "#3385be", "#33acbe", "#33beaf", "#33be85", "#33be47", "#78be33", "#9cbe33", "#bcbe33", "#be9f33", "#be7b33", "#be5733"],
			animalArray: ["panda", "tiger", "cheetah", "gorilla", "monkey", "robin", "toucan", "elephant", "chimp", "sheep", "rooster", "dog", "cow", "chicken", "rabbit", "pig", "horse", "duck", "parrot", "mouse", "puppy", "cat", "lynx", "hamster", "ferret", "warthog", "wolf", "eagle", "owl", "bear", "hedgehog", "fox", "moose", "squirrel"],
			randomize: function(){
				return {
					letter: this.letterArray[Math.floor(Math.random() * this.letterArray.length)],
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

						
			var whichClass = (messageObject.user.name == "me") ? 'user' : 'other-user';
			// TO-DO ugly - change this later
			var messageToAppend = "<div class='" + whichClass + "'><div class='message-area'>";
			if(messageObject.user.profileId == ""){
				messageToAppend += '<div style="background:'+ messageObject.user.picture.color +' url(\'/images/chat/animals/'+ messageObject.user.picture.animal +'.png\') no-repeat center center; background-size: 44px 44px;" class="avatar"></div>';	
			}
			else{
				messageToAppend += '<div style="background:url('+ messageObject.user.picture +') no-repeat center center; background-size: 44px 44px" class="avatar"></div>';
			}
			
			messageToAppend += '<div class="content">' + message +'<div class="name">' + messageObject.user.name + '</div></div></div></div>';
			
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

			if(userID == ""){
				msgObject.user.picture = {
					letter: notSignedInUserObject.letter,
					color: notSignedInUserObject.color,
					animal: notSignedInUserObject.animal
				};
			}

			madpadSocket.emit('chat', msgObject);
			$('#m').val('');
			msgObject.user.name = "me";
			madpadChat.appendChat(msgObject);
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
			domElement: $('.avatar-list ul'),
			createPersonNode: function(user){
				var li = document.createElement('li');
				li.className = 'tooltip'
				li.setAttribute('name', user.username);
				var img = document.createElement('img');
				img.src = user.picture;
				img.className = 'avatar-user';
				if(isOwner) img.className += ' avatar-owner';
				li.appendChild(img);

				this.domElement.append(li);
			},
			createSelf: function(){

			},
			createAllPeople: function(){
				this.createPersonNode(madpadUserData);

				count = 0;

			},
			people: [],
			initPeople: function(data){

			},
			addPerson: function(data){

			},
			removePerson: function(data){

			},
			moveUpPerson: function(data){

			},
		}

		madpadSocket.on('chatPeople', function(data){
			a = data;
			recentChatters.createAllPeople();
		})

		madpadSocket.on('chatJoined', function(data){
			console.log('chatJoined');
			console.log(data);
		})

		madpadSocket.on('chatLeft', function(data){
			console.log('chatLeft');
			console.log(data);
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
