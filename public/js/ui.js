$(document).ready(function(){

	// cookie set / get functions
	madpadCookieFunctions = {
		setCookie: function(cname, cvalue) {
	    var d = new Date();
	    d.setTime(d.getTime() + (60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
		},
		getCookie: function(cname){
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
			}
			return "";
		},
		deleteCookie: function(cname){
			document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		},
	}

	// header messaging for javascript
	var isAnimating = false;
	headerStatusMessaging = {
		setAnimateFalse: function(){
			isAnimating = false;
		},
		animate: function(){
			if(!isAnimating){
				isAnimating = true;
				$('.status')
					.stop(true, true)
					.slideDown()
					.delay(2000)
					.slideUp()
					.queue(this.setAnimateFalse);
			}
		},
		run: function(msg){
			if(!msg) return;
			$('.status').find('p').html(msg);
			this.animate();
		}
	}

	var displayInitialMessaging = function(msg){
		setTimeout(function(){
			headerStatusMessaging.run(msg);
		}, 1200)		
	}


	if(madpadCookieFunctions.getCookie('statusMessaging')){
		var message = madpadCookieFunctions.getCookie('statusMessaging')
		madpadCookieFunctions.deleteCookie('statusMessaging');
		displayInitialMessaging(message);
	}

	if(typeof justLoggedIn !== 'undefined' && justLoggedIn){
		displayInitialMessaging("Welcome back " + username + "!");
	}

});
$(document).ready(function(){

	var loginSignupModal = {
		currentState: 'login',
		signUpHeader: "Sign Up",
		signUpText: 'Sign up instantly with Facebook or Github.  Already have an account? <a href="#">Login</a>.',
		loginHeader: "Log in",
		loginText: "Use Facebook or Github to sign in.  Don't have an account? <a href='#''>Sign up</a>.",
		switchToLogin: function(){
			$('.login-signup h6').html(this.loginHeader);
			$('.login-signup .text p').html(this.loginText);
			this.currentState = 'login';
		},
		switchToSignup: function(){
			$('.login-signup h6').html(this.signUpHeader);
			$('.login-signup .text p').html(this.signUpText);
			this.currentState = 'signup';
		},
		// toggle between login and signup text
		toggle: function(){
			var _this = this;
			$('.login-signup .text').on('click', 'a', function(){
				if(_this.currentState == 'login'){
					_this.switchToSignup();
				}
				else{
					_this.switchToLogin();
				}
				return false;
			});
		},
		show: function(modals){
			var _this = this;
			$('.login-button').on('click', function(){
				_this.switchToLogin();
				if($(this).hasClass('home-signup')){
					_this.switchToSignup();
				}
				modals.showOverlay('.login-signup');
			});
		},
		// facebook / github show text on icon hover
		socialHover: function(){
			// facebook login
			$('.facebook-icon').mouseenter(function(){
				$('.social-message').html('with Facebook');
			});
			$('.facebook-icon').mouseleave(function(){
				$('.social-message').html('');
			});

			// github login
			$('.github-icon').mouseenter(function(){
				$('.social-message').html('with Github');
			});
			$('.github-icon').mouseleave(function(){
				$('.social-message').html('');
			});
		},
		run: function(modals){
			this.toggle();
			this.show(modals);
			this.socialHover();
		}
	};

	loginSignupModal.run(mpFrontend.modals);

	// add dropdown for user / logging out
	var avatarDropdown = {
		container: $('.menu-container'),
		toHide: $('.avatar-drop'),
		dropdown: function(){
			$('.avatar-header').on('click' , function(e){
				$('.avatar-drop').show();
			});
		},
		hideOnOtherClick: function(){
			var _this = this;
			$(document).mouseup(function (e){
				if (!_this.container.is(e.target) // if the target of the click isn't the container...
				&& _this.container.has(e.target).length === 0) // ... nor a descendant of the container
				{
				_this.toHide.hide(); /* hide the new pad area */
				}
			})
		},
		run: function(){
			this.dropdown();
			this.hideOnOtherClick();
		}
	};
	avatarDropdown.run();

	var helpClick = function(){
		$(".help-click").click(function(){
			$(".uv-icon").trigger("click");
			avatarDropdown.toHide.hide();
			return false;
		});
	}

	helpClick();

});

$(document).ready(function(){

	// hide extra pad items initially if not already hidden
	$(".pad-item-hidden").each(function(){
		$(this).hide();
	})

	// toggle extra pads - add animation here
	$(".toggle-recent-pads").click(function(){
		aElement = $(this).children("a");

		if(aElement.text() == "More Pads"){
			aElement.text("Fewer Pads")
		} 
		else {
			aElement.text("More Pads");
		}
		
		$(this).parent().children(".pad-item-hidden").toggle();
		return false;
	})

});
$(document).ready(function(){
	if(typeof padTemplate == 'undefined') return;
	if(!padTemplate) return;

	var hearts = {
		favoriteName: location.pathname.slice(1),
		isFavorited: false,
		makeFavorite: function(){
			headerStatusMessaging.run('pad has been favorited');
			$('#heartFavoriteIcon').addClass('favorite-icon').removeClass('heart-icon');
			if(isMobile){
				$("#heartFavoriteIcon span").text("Unfavorite Pad");
				var imgElem = $("#heartFavoriteIcon img")
				var src = imgElem.attr("src");
				src = src.replace("heart", "favorite");
        imgElem.attr("src", src);
			}
		},
		makeUnfavorite: function(){
			headerStatusMessaging.run('pad is no longer a favorite');
			$('#heartFavoriteIcon').addClass('heart-icon').removeClass('favorite-icon');
			if(isMobile){
				$("#heartFavoriteIcon span").text("Favorite Pad");
				var imgElem = $("#heartFavoriteIcon img")
				var src = imgElem.attr("src");
				src = src.replace("favorite", "heart");
        imgElem.attr("src", src);
			}
		},
		favoriteToServer: function(){
			madpadSocket.emit('favorite', {padName: this.favoriteName, favorite: true});
		},
		unfavoriteToServer: function(){
			madpadSocket.emit('favorite', {padName: this.favoriteName, favorite: false});
		},
		onIconClick: function(){
			// we want to unfavorite
			var _this = this;
			$('#heartFavoriteIcon').on('click', function(){
				// we want to defavorite
				if($(this).hasClass('favorite-icon')){
					_this.makeUnfavorite();
					_this.unfavoriteToServer();
				}
				// we want to favorite
				else{
					_this.makeFavorite();
					_this.favoriteToServer();
				}
			});
		},
		run: function(){
			this.onIconClick();
		}
	}

	hearts.run();

});
$(document).ready(function(){

	var newPadForm = {
		defaultURL: "Your Pad's URL",
		isPersonalPad: true,
		initPersonPad: function(){
			var padUsername = this.getPadUsername();
			if(padUsername){
				this.isPersonalPad = true;
			}
			else{
				this.isPersonalPad = false;
			}
		},
		getInputValue: function(elem){
			if(!elem.length) return '';
			return elem.val().toLowerCase() || '';
		},
		getPadName: function(){
			var elem = $('input[name="pad[name]"]').filter(":last");
			return this.getInputValue(elem);
		},
		getPadType: function(){
			var elem = $('input[name="pad[type]"]').filter(":last");
			return this.getInputValue(elem);
		},
		getPadUsername: function(){
			var elem = $('input[name="pad[username]"]').filter(":last");
			return this.getInputValue(elem);
		},
		textPadClick: function(){
			var _this = this;
			$('.text-pad').on('click', function(){
				$('input[name="pad[type]"]').val('text');
				$('.text-pad').addClass('active');
				$('.code-pad').removeClass('active');
				_this.updateOpenPadURL();
			}); /* if you click text pad */
		},
		codePadClick: function(){
			var _this = this;
			$('.code-pad').on('click', function(){
				$('input[name="pad[type]"]').val('code');
				$('.code-pad').addClass('active');
				$('.text-pad').removeClass('active');
				_this.updateOpenPadURL();
			}); /* if you click code pad */
		},
		personalPadClick: function(){
			var _this = this;
			$('#personal-type').on('click', function(){
				$(this).addClass('active');
				$('#public-type').removeClass('active');
				$('.openCreatePadForm').attr('createPadForm');
				$('#new-button').html('CREATE PAD');
				$('.pad-name').attr('placeholder' , 'Enter your pad name here...');
				_this.isPersonalPad = true;
				_this.updateOpenPadURL();
			});
		},
		publicPadClick: function(){
			var _this = this;
			$('#public-type').on('click', function(){
				$(this).addClass('active');
				$('#personal-type').removeClass('active');
				$('.openCreatePadForm').attr('openPadForm');
				$('#new-button').html('OPEN PAD');
				$('.pad-name').attr('placeholder' , 'Enter public pad name...');
				_this.isPersonalPad = false;
				_this.updateOpenPadURL();
			});
		},
		updateOpenPadURL: function(){
			var newPadURL = window.location.host;
			var padName = this.getPadName();
			var padType = this.getPadType();
			var padUsername = this.getPadUsername();
			var createPadURL, openPadURL;

			$('.inputPadErrors').html('');

			// return if empty pad name
			if(padName == ''){
				$('.inputWhatPadWillOpen').text(this.defaultURL);
				return false;
			}

			// pad name must be alphanumeric
			if( /[^a-zA-Z0-9_-]/.test(padName)){
				$('.inputWhatPadWillOpen').text(this.defaultURL);
				$('.inputPadErrors').html('<p>Not valid pad name</p>');
				return false;
			}

			// check if we are the user and on our username pad template
			if(padUsername && this.isPersonalPad){
				createPadURL = '/' + padUsername;
				createPadURL += '/' + padName;
			}
			else if(padType == 'text'){
				openPadURL = '/' + padName;
			}
			else{
				openPadURL = '/code/' + padName;
			}

			if(this.isPersonalPad){
				$('.inputWhatPadWillOpen').text(newPadURL + createPadURL);	
			}
			else{
				$('.inputWhatPadWillOpen').text(newPadURL + openPadURL);	
			}
			
			return {'create': createPadURL, 'open': openPadURL};

		},
		onInputChange: function(){
			var _this = this;
			$('input[name="pad[name]"]').filter(":last").on('keyup', function(e){
				var keycode = (event.keyCode ? event.keyCode : event.which);
				if(keycode == '13') return;
				_this.updateOpenPadURL();
			})
		},
		onFormSubmit: function(){
			var _this = this;
			$('.openCreatePadForm').submit(function(){
				var padName = _this.getPadName();
				var padType = _this.getPadType();
				var padUsername = _this.getPadUsername();

				// error messaging for blank entry
				if(padName == ''){
					$('.inputPadErrors').html("<p>Enter in a pad name</p>");
					return false;
				}

				// check if pad url is valid
				var padURL = _this.updateOpenPadURL();
				if(!padURL) return false;

				// we are opening a pad
				if(!_this.isPersonalPad && padURL.open != undefined){
					window.location.href = padURL.open;
					return false;
				}

				// we are a logged in user and creating a new pad
				$.ajax({
					type: "POST",
					url: padURL.create,
					data: $(this).serialize(),
					dataType: "json",
					timeout: 5000,
					success: function(data){
						if(data.success){
							// set header messaging
							madpadCookieFunctions.setCookie("statusMessaging", "new pad has been created");

							// redirect to new pad url
							window.location.href = padURL.create;
						}
						else if(data.error){
							// add error checking here
							var errorMessage = data.errorType;
							if(data.errorType == 'existence'){
								errorMessage = "Pad already exists. Click <a href='" + padURL.create + "'>here</a> to go to it";
							}
							$('.inputPadErrors').html('<p>' + errorMessage + '</p>');
						}

					},
					error: function(data){
						// add error checking here
						$('.inputPadErrors').html('<p>Pad creation failed, please try again later</p>');
					}
				})

				return false;
			});
		},
		// create pad modal
		createPad: {
			run: function(modals){
				$('.new-icon').click(function(){
					modals.showOverlay('.create-pad');
				});
			}
		},
		run: function(){
			this.initPersonPad();
			this.textPadClick();
			this.codePadClick();
			this.onInputChange();
			this.onFormSubmit();
			this.personalPadClick();
			this.publicPadClick();
			this.updateOpenPadURL();
		}
	};

	newPadForm.run();
	newPadForm.createPad.run(mpFrontend.modals)

});

$(document).ready(function(){
	if(typeof padTemplate == 'undefined') return;
	if(!padTemplate) return;

	// delete pad modal
	var deletePad = {
		deleteConfirm: function(){
			// don't allow them to delete home template
			if(isOwner && id == 'home') return;
			madpadSocket.emit('deletePad', {room: padName, padName: padName, padURL: location.pathname.slice(1)});	
		},
		deleteMobile: function(){
			// don't allow them to delete home template
			if(isOwner && id == 'home') return;
			if(confirm('Are you absolutely sure? This cannot be reversed!')){
				madpadSocket.emit('deletePad', {room: padName, padName: padName, padURL: location.pathname.slice(1)});	
			}
		},
		onSocket: function(){
			madpadSocket.on('padDeleted', function(data){
				// blank out text
				if($('#editor-code').length) editor.getSession().setValue('');
				if($('#pusherContentEditable').length) $("#editor").editable("setHTML", '');

				// go to users home template
				if(username){
					document.location.href = '/' + username + '/home';
				}
				// if logged out just go to home
				else{
					document.location.href = '/';
				}
				madpadCookieFunctions.setCookie("statusMessaging", "previous pad has been deleted");
			})
		},
		run: function(modals){
			var _this = this;

			_this.onSocket();

			// if user's home template AND if other users templates hide trash icon (if not already hidden)
			if((isOwner && id == 'home') || !isOwner){
				$('.trash-icon').remove();
				if(isMobile){
					$('.mobile-delete').remove();	
				}
			}

			if(isMobile){
				$('.mobile-delete').click(function(){
					_this.deleteMobile();
				});
			}

			$('.trash-icon').click(function(){
				modals.showOverlay('.delete-confirmation');
			});

			$('#confirm-delete').click(function(){
				_this.deleteConfirm();
				modals.hideOverlay('.delete-confirmation');
			});

			$('#cancel-delete').click(function(){
				modals.hideOverlay('.delete-confirmation');
			});
		}
	}

	deletePad.run(mpFrontend.modals);

	// check if home template
	var isOurHomeTemplate = function(url){
		if(url.charAt(0) == '/'){
			url = url.slice(1);
		}
		var deleteURLArray = url.split('/');
		if(deleteURLArray[0] != undefined && deleteURLArray[1] != undefined){
			if(deleteURLArray[0] == username && deleteURLArray[1] == 'home'){
				return true;
			}
		}
		return false;
	}

	// delete pads from left side (recent pads)
	var deleteRecent = {
		remove: function(){
			$('.deleteRecent').on('click', function(e){
				var closestPad = $(this).parent().siblings('a');
				var removeElement = function(){
					closestPad.parent().remove();
				}
				var deleteURL = closestPad.attr('href').slice(1);

				// don't allow the user to delete their home template
				if(isOurHomeTemplate(deleteURL)) return;

				// remove from our cookie
				madpadSocket.emit('deleteRecent', deleteURL);

				// remove from dom with animation
				closestPad.parent().css('background-color' , '#4b555d')
				.animate({
					'marginLeft' : "-=50px",
					'opacity' : "0"
				}, 500)
				.delay(500)
				.animate({
					'height': "0",
				}, 100)
				.queue(removeElement);
			});
		},
		removeXFromHome: function(){
			// we don't want to show an X on our home template
			$('#sidebar-personal-pads li').each(function(){
				var padURL = $(this).children('a').attr('href');
				if(isOurHomeTemplate(padURL)){
					$(this).children('.pad-heart-x').remove();
				}
			});
		},
		run: function(){
			this.removeXFromHome();
			this.remove();
		}
	}

	deleteRecent.run();

})
$(document).ready(function(){
	if(typeof padTemplate == 'undefined') return;
	if(!padTemplate) return;
	if(isHome) return;

	var madpadChat = {

		options: {
			colorArray: ["#be3333", "#be336e", "#be339f", "#ac33be", "#7e33be", "#4d33be", "#334dbe", "#3385be", "#33acbe", "#33beaf", "#33be85", "#33be47", "#78be33", "#9cbe33", "#bcbe33", "#be9f33", "#be7b33", "#be5733"],
			animalArray: ["panda", "tiger", "cheetah", "gorilla", "monkey", "robin", "toucan", "elephant", "chimp", "sheep", "rooster", "dog", "cow", "chicken", "rabbit", "pig", "horse", "duck", "parrot", "mouse", "puppy", "cat", "lynx", "hamster", "ferret", "warthog", "wolf", "eagle", "owl", "bear", "hedgehog", "fox", "moose", "squirrel"],
			descriptions: ["ancient", "friendly", "cuddly", "malicious", "cute", "mean", "smelly", "adorable", "burly", "clumsy", "bitter", "diligent", "electric", "hopeful", "honored", "innocent", "jumbo", "mysterious", "neglected", "plump", "striking", "vivacious", "playful", "feisty", "messy", "loud", "nosy", "sassy", "curious", "tenacious", "fierce", "stubborn", "lazy", "bossy", "candid", "grumpy", "picky", "energetic", "loving", "smart", "noisy", "vicious", "helpful", "jealous"],
			randomize: function(){
				return {
					color: this.colorArray[Math.floor(Math.random() * this.colorArray.length)],
					animal: this.animalArray[Math.floor(Math.random() * this.animalArray.length)],
					name: this.descriptions[Math.floor(Math.random() * this.descriptions.length)]
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
			var whichClass = 'user';
			if((userID && madpadUserData.userID == messageObject.user.profileId) || (typeof messageObject.user.id !== 'undefined' && madpadUserData.unknown.id == messageObject.user.id)){
				chatUserName = 'me';
			}
			else{
				whichClass = 'other-user';
				if(!chatUserName){
					if(messageObject.unknown && messageObject.unknown.name){
						chatUserName = messageObject.unknown.name;
					}
				}
			}

			// create message html
			var msgDiv = document.createElement('div');
			msgDiv.className = whichClass;
			var msgAreaDiv = document.createElement('div');
			msgAreaDiv.className = 'message-area';

			var msgAvatarDiv = document.createElement('div');
			msgAvatarDiv.id = 'ccc';
			msgAvatarDiv.className = 'avatar chat-avatar';
			msgAreaDiv.appendChild(msgAvatarDiv);			

			var msgContentDiv = document.createElement('div');
			msgContentDiv.className = 'content';
			msgContentDiv.innerHTML = message;
			var nameDiv = document.createElement('div');
			nameDiv.className = 'name';
			nameDiv.innerHTML = chatUserName;
			msgContentDiv.appendChild(nameDiv);
			msgAreaDiv.appendChild(msgContentDiv);

			if(!messageObject.user.profileId){
				msgAvatarDiv.style.backgroundImage = "url('/images/chat/animals/"+messageObject.user.animal+".png')";
				msgAvatarDiv.style.backgroundColor = messageObject.user.color;
			}
			else{
				msgAvatarDiv.style.backgroundImage = "url('"+messageObject.user.picture+"')";
			}

			msgDiv.appendChild(msgAreaDiv);
			$('#messages').append(msgDiv);
			
			this.scrollDown();
	 		
		},

		toggleChat: function(){

			// open chat window
			var openChat = function(){
				$('.chatoff-icon').removeClass('chatoff-icon').addClass('chaton-icon');
				$('.middle').removeClass('no-chat-fix');
				$('.middle').parent().hide().show(0);
				$('.right').show();				
			};

			// close chat window
			var closeChat = function(){
				$('.chaton-icon').removeClass('chaton-icon').addClass('chatoff-icon');
				$('.middle').addClass('no-chat-fix');
				$('.middle').parent().hide().show(0);
				$('.right').hide();
			};

			// set up event listeners
			$("body").delegate(".chaton-icon", "click", function(){
				closeChat();
			});
			$("body").delegate(".chatoff-icon", "click", function(){
				openChat();
			});

		},

		sendMessages: function(){
			$('.message-input').keypress(function(e){
				/* allows enter to send messages and shift enter to make new line */
				if(e.which == 13 && !e.shiftKey){
					$(this).submit();
					return false;
				}
			});
		},

		run: function(){
			this.toggleChat();
			this.sendMessages();
		},

	};
	madpadChat.run();

	// random user object in case anything goes wrong
	var randomUserObject = madpadChat.options.randomize();

	// submitting to chat
	$('.madpadChatForm').submit(function(){
		var msg = $('#m').val();
		if(msg == '') return false;

		var msgObject = {
			room: padName,
			message: msg,
			user: {
				name: madpadUserData.username,
				username: madpadUserData.username,
				picture: madpadUserData.picture,
				profileId: userID					
			}
		};

		// we are not a logged in user
		if(!userID){
			// we have an animal cookie set
			if(madpadUserData && madpadUserData.unknown && madpadUserData.unknown.animal){
				msgObject.user = {
					id: madpadUserData.unknown.id,
					color: madpadUserData.unknown.color,
					animal: madpadUserData.unknown.animal,
					name: madpadUserData.unknown.name,
				};
			}
			else{
				msgObject.user = randomUserObject;					
			}
		}

		madpadSocket.emit('chat', msgObject);
		$('#m').val('');
		msgObject.user.name = "me";
		madpadChat.appendChat(msgObject);
		msgObject.user.name = "";
		return false;
	});

	// functions to change icons in chat header
	var recentChatters = {
		clearOut: function(){
			// clear out chat header
			$('.avatar-list ul').empty();
		},
		createPersonNode: function(user){
			// create a person node in the chat header
			var li = document.createElement('li');
			li.className = 'tooltip';
			li.setAttribute('name', user.username);
			var img = document.createElement('img');
			user.picture = user.picture.replace('&amp;', '&');
			img.src = user.picture;
			img.className = 'avatar-user';
			if(user.username == usersRoom) img.className += ' avatar-owner';
			if(user.color) img.style.backgroundColor = user.color;
			li.appendChild(img);
			$('.avatar-list ul').append(li);
		},
		createPlusNode: function(names){
			// if we have more than a certain amount of people create a +X chat header node
			var li = document.createElement('li');
			li.className = 'tooltip tooltips';
			li.setAttribute('name', names.join("\n"));
			var p = document.createElement('p');
			p.innerHTML = "+"+names.length;
			li.appendChild(p);
			$('.avatar-list ul').append(li);
		},
		createAllPeople: function(){
			// create all people nodes for chat header

			if(typeof this.formattedData !== 'object') return;

			this.clearOut();
			this.formatData();

			var peopleNumber = this.formattedData.length;
			var extraPeople = [];
			var extraPerson = [];

			for(var i=0; i < peopleNumber; i++){
				var singlePerson = this.formattedData[i];
				
				// we are a real person
				if(singlePerson.user.username){
					this.createPersonNode(singlePerson.user);
				}
				// we are a guest
				else{

					var animal, color, name;
					if(singlePerson.user.unknown && typeof singlePerson.user.unknown.name !== 'undefined'){
						animal = singlePerson.user.unknown.animal;
						color = singlePerson.user.unknown.color;
						name = singlePerson.user.unknown.name;
					}
					else{
						animal = madpadChat.options.randomize().animal;	
						color = madpadChat.options.randomize().color;
						name = madpadChat.options.randomize().name + '-' + animal;
					}
					var userData = {
						username: name,
						picture: '/images/chat/animals/' + animal + '.png',
						color: color
					}
					extraPerson = userData;

					// we only want to allow 3 people in the chat header
					if(i < 3){
						this.createPersonNode(userData);
					}
					else{
						if(singlePerson.user.unknown && typeof singlePerson.user.unknown.name !== 'undefined'){
							extraPeople.push(singlePerson.user.unknown.name);
						}
					}
					
				}

			}

			// if we only have one extra person add them
			if(extraPeople.length == 1){
				this.createPersonNode(extraPerson);
			}
			// if we have more do a +2 type node
			else if(extraPeople.length > 1){
				this.createPlusNode(extraPeople);
			}

		},
		people: [],
		formattedData: [],
		formatData: function(){
			// format data so that owner and self are first
			var tmpArray = [];
			var owner = [];
			var self = [];
			
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
	};

	// we initially joined chat and are seeing all the people in the chat room
	madpadSocket.on('chatPeople', function(data){
		recentChatters.people = data;
		recentChatters.createAllPeople();
	});

	// user joined chat
	madpadSocket.on('chatJoined', function(data){
		recentChatters.addPerson(data);
		recentChatters.createAllPeople();
	});

	// user left chat
	madpadSocket.on('chatLeft', function(data){
		recentChatters.removePerson(data);
		recentChatters.createAllPeople();
	});
	
	// receiving chat object from socket
	madpadSocket.on('chatSent', function(data){
		madpadChat.appendChat(data);
	});

});

$(document).ready(function(){
	if(typeof padTemplate == 'undefined') return;
	if(!padTemplate) return;

	// need to make global so that is available to codepad.js and textpad.js
	changePadEditablity = {
		close: function(){
			if(typeof editor !== 'undefined'){
				if(typeof editor.setReadOnly === 'function'){
					editor.setReadOnly(true);
				}
				else{
					$("#editor").editable("makeUneditable");
				}
			}
		},

		open: function(){
			if(typeof editor !== 'undefined'){
				if(typeof editor.setReadOnly === 'function'){
					editor.setReadOnly(false);
				}
				else{
					$("#editor").editable("makeEditable");		
				}
			}
		}
	};

	// change privacy settings of pad
	var padPrivacy = {
		makePublic: function(){
			padPrivacyStatus = 'public'
			madpadSocket.emit('togglePrivacy', {room: padName, type: 'public', write: true, read: true});
			this.changeToPublicIcon();
		},
		makeShared: function(){
			padPrivacyStatus = 'shared';
			madpadSocket.emit('togglePrivacy', {room: padName, type: 'shared', write: false, read: true});
			this.changeToSharedIcon();
		},
		makePrivate: function(){
			padPrivacyStatus = 'private';
			madpadSocket.emit('togglePrivacy', {room: padName, type: 'private', write: false, read: false});
			this.changeToPrivateIcon();
		},
		changeToPublicIcon: function(){
			$('.pad-settings').removeClass('private-icon').removeClass('shared-icon').removeClass('public-icon').addClass('public-icon');
			$('#settings-text').html('Editable by Anyone');
		},
		changeToSharedIcon: function(){
			$('.pad-settings').removeClass('private-icon').removeClass('shared-icon').removeClass('public-icon').addClass('shared-icon');
			$('#settings-text').html('Viewable by Anyone');
		},
		changeToPrivateIcon: function(){
			$('.pad-settings').removeClass('private-icon').removeClass('shared-icon').removeClass('public-icon').addClass('private-icon');
			$('#settings-text').html('Completely Private');
		}
	}

	// toggle privacy when someone else changes privacy settings
	madpadSocket.on('togglePrivacy', function(whichWay){
		// add user name checking
		if(usersRoom == username) return;
		
		switch(whichWay){
			// open up writing on pads
			case 'public':
				headerStatusMessaging.run('pad is now editable by anyone');
				padPrivacy.changeToPublicIcon();
				changePadEditablity.open();
				break;
			// turn off editing ability
			case 'shared':
				headerStatusMessaging.run('pad is now viewable by anyone');
				padPrivacy.changeToSharedIcon();
				changePadEditablity.close();
				break;
			// kick out users
			case 'private':
				madpadCookieFunctions.setCookie("statusMessaging", "pad was made private");
				padPrivacy.changeToPrivateIcon();
				location.reload(true);
				break;
			default:
				break;
		}
	});

	// change privacy settings modal
	var newPadPrivacy = '';
	var changePadPrivacy = {
		selectSetting: function(){
			var radioOn = function(element){
				$(element).children('.radio').removeClass('radio-off').addClass('radio-on');
			}
			var radioOff = function(element){
				$(element).children('.radio').removeClass('radio-on').addClass('radio-off');	
			}

			$('#private-setting').click(function(){
				newPadPrivacy = 'private';
				radioOn(this);
				radioOff('#shared-setting');
				radioOff('#public-setting');
			});

			$('#shared-setting').click(function(){
				newPadPrivacy = 'shared';
				radioOn(this);
				radioOff('#private-setting');
				radioOff('#public-setting');
			});

			$('#public-setting').click(function(){
				newPadPrivacy = 'public';
				radioOn(this);
				radioOff('#private-setting');
				radioOff('#shared-setting');
			});
		},
		run: function(modals){
			this.selectSetting();

			// set correct radio button initially on page load
			if(padPrivacyStatus == 'private'){
				$('#private-setting').trigger('click');
			}
			else if(padPrivacyStatus == 'shared'){
				$('#shared-setting').trigger('click');
			}
			else{
				$('#public-setting').trigger('click');	
			}

			// bring up settings modal
			$('.share-settings-icon').click(function(){
				if(!isOwner) return false;
				modals.showOverlay('.sharing-settings-desktop');
			});

			// save settings modal
			$('#save-settings').click(function(){
				if(newPadPrivacy == 'private'){
					padPrivacy.makePrivate();
				}
				else if(newPadPrivacy == 'shared'){
					padPrivacy.makeShared();
				}
				else{
					padPrivacy.makePublic();
				}
				headerStatusMessaging.run('privacy settings have been updated');

				modals.hideOverlay('.sharing-settings-desktop');
			});

			// cancel modal without saving
			$('#cancel-settings, .modal-close').click(function(){
				newPadPrivacy = padPrivacyStatus;
				modals.hideOverlay('.sharing-settings-desktop');
			});
		}
	}

	changePadPrivacy.run(mpFrontend.modals);


});

$(document).ready(function(){

	if(!document.referrer || document.referrer.split('/')[2] != window.location.host){
		$('.goback_403').html('<a href="#">go back home.</a>');
		$('.goback_404').html('<a href="#">Go back home.</a>');
	}

	$('.goback_403 a, .goback_404').on('click', function(){
		if(document.referrer && document.referrer.split('/')[2] == window.location.host){
			history.go(-1);
		}
		else{
			if(username){
				window.location.href = '/' + username + '/home';
			}
			else{
				window.location.href = '/';
			}
		}

		return false;
	})
});