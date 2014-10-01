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
	
	$('.username-wrapper').css('opacity' , '1').addClass('move');

	// add dropdown for user / logging out
	var avatarDropdown = {
		container: $('.menu-container'),
		toHide: $('.avatar-drop'),
		dropdown: function(){
			this.toHide.hide();
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
	} 
	avatarDropdown.run();

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
	if(madpadCookieFunctions.getCookie('statusMessaging')){
		var statusCookie = madpadCookieFunctions.getCookie('statusMessaging');
		madpadCookieFunctions.deleteCookie('statusMessaging');
		setTimeout(function(){
			headerStatusMessaging.run(statusCookie);
		}, 1500)
	}

	// add x on hover to recent pads
	var padItemOptions = function(){
		$('.pad-heart-x').hide();
		$('.pad-item').mouseenter(function(){
			$(this).find('.pad-heart-x').show();
		});
		$('.pad-item').mouseleave(function(){
			$(this).find('.pad-heart-x').hide();
		});
	}
	padItemOptions();

	mpFrontend = {
		modals: {
			//Open and Close Overlays
			showOverlay: function(element){
				$(element).removeClass('overlay-close');
				$(element).addClass('overlay-open');	
			},
			hideOverlay: function(element){
				$(element).removeClass('overlay-open');
				$(element).addClass('overlay-close');		
			},
			escKeyHideOverlay: function(modals){
				var _this = this;
				$(document).keyup(function(e){
					if(e.keyCode == 27){
						_this.hideAllOverlays(modals);
					}
				});
			},
			xButtonHideOverlay: function(modals){
				var _this = this;
				$('.modal-close').on('click', function(){
					_this.hideAllOverlays(modals);
				});
			},
			hideAllOverlays: function(modals){
				modals.hideOverlay('.delete-confirmation');
				modals.hideOverlay('.sharing-settings');
				modals.hideOverlay('.account');
				modals.hideOverlay('.create-pad-modal');
				$(".new-pad-area").hide();
				$('.darken').hide();
			},

			// login modal
			login: {
				run: function(modals){
					$('.login-button').click(function(){
						modals.showOverlay('.login');
					});

					$('#signup-link').click(function(){
						modals.hideOverlay('.login');
						modals.showOverlay('.signup');
					});				
				}
			},

			// signup modal
			signup: {
				run: function(modals){
					$('.signup-button').click(function(){
						modals.hideOverlay('.login');
						modals.showOverlay('.signup');
					});

					$('#login-link').click(function(){
						modals.hideOverlay('.signup');
						modals.showOverlay('.login');
					});
				}
			},

			run: function(){
				this.escKeyHideOverlay(this);
				this.xButtonHideOverlay(this);
				this.login.run(this);
				this.signup.run(this);
			},

		},
		run: function(){
			this.modals.run();
		}
	}

	mpFrontend.run();
});


$( window ).load(function() {

    window_size = function() {
	    var height = $(window).height();										//this is the window height.
	    var navHeight = $('.header').height();									//this is the height of the nav bar.
	    var titleHeight = $('.title').height();									//the is the title height in the main area.
	    var submitHeight = $('.submit-wrapper').height();						//the is the submit area height in the main area.
	    var chatTitleHeight = $('.chat-title').height();
	    var newPadBtnHeight = $('.new-pad').height();
	    var editorHeight = $('.froala-editor').height();
	    var signupStepHeight = $(window).height() - navHeight;
	    var paddingMain = 82;													//top and bottom padding of the text area.
	    var padHeight = height - navHeight - titleHeight - paddingMain - editorHeight; 		//this is the height of the pad.
	    var sideHeight =  height - navHeight; 									//this is the height of the two side bars.
	    var chatHeight = sideHeight - chatTitleHeight - submitHeight - 1;
	    var padListHeight = sideHeight - newPadBtnHeight;

	    // sideHeight = parseInt(sideHeight) + 'px';
	    // padHeight = parseInt(padHeight) + 'px';
	    $(".left").css('height' , sideHeight);
	    $(".all-pads").css('height', padListHeight);
	    $(".right").css('height', sideHeight);
	    $(".froala-element").css('height', padHeight);
	    $('#editor-code').css('height' , padHeight);
	    $(".new-pad-area").css('height', sideHeight);
	    $('#messages').css('height' , chatHeight);
	    $('.signup-step-wrapper').css('height' , signupStepHeight);
	
	}/* Set heights for divs */
	window_size();
    
	$(window).bind('resize', window_size);
	/* Set Side Bar to Window Size */

	$('img').bind('dragstart', function(){
		return false; 
	});

  function newPadShadow(){
		$('.all-pads').scroll(function() {
			if ($(this).scrollTop() > 0 ) {
				$(".new-pad").addClass("new-pad-active");
			}
			else {
				$(".new-pad").removeClass("new-pad-active");
			}
		}); /* Give the drop shadow to the "New Pad" area*/
	}
	newPadShadow();

	function newPad(){

		$('.new-pad-area').hide();
		$('.darken').hide();

		$('.new-pad').click(function(){
			$('.darken').show(); /* show the darken state */
			$('.new-pad-area').show(); /* show the new pad area */
			$('.new-pad-area').animate({left:'235px'}, 100); /* move the pad for slide effect */
			$('#create-input').focus(); /* focus on the new pad input */
			inputFocus();
		});


	}
	newPad();

	function inputFocus(){

		$("input").focus(function() {
	 		$('.underline').css('border', '2px solid #33bea8');
	 		$('.underline').css('border-top', 'none');
		});

		$("input").focusout(function() {
			$('.underline').css('border', 'none');
	 		$('.underline').css('border-bottom', '2px solid #ddd');
		});
	}

	function editorActive(){

		$('.froala-element').focus(function() {
			$('.froala-box').addClass('editor-active');
		});

		$('.froala-element').blur(function() {
			$('.froala-box').removeClass('editor-active');
		});
	}
	editorActive();

	function socialType(){

		$('.facebook-icon').mouseenter(function(){
			$('.social-message').html('with Facebook');
		});
		$('.facebook-icon').mouseleave(function(){
			$('.social-message').html('');
		});
		// facebook login

		$('.github-icon').mouseenter(function(){
			$('.social-message').html('with Github');
		});
		$('.github-icon').mouseleave(function(){
			$('.social-message').html('');
		});
		// github login
	}
	socialType();

	function iconHover(){

		$('.title-options').children('.icon').mouseenter(function(){
			$(this).css('background-color' , '#f4f6f9');
		});

		$('.title-options').children('.icon').mouseleave(function(){
			$(this).css('background-color' , 'transparent');
		});

		$('.title-options').children('.icon').click(function(){
			$(this).css('background-color' , 'transparent')
		});
	}
	iconHover();

});
