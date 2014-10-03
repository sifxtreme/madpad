$(document).ready(function(){

	$('.username-wrapper').css('opacity' , '1').addClass('move');

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
	} 
	avatarDropdown.run();

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

	// froala editor
	function editorActive(){

		$('.froala-element').focus(function() {
			$('.froala-box').addClass('editor-active');
		});

		$('.froala-element').blur(function() {
			$('.froala-box').removeClass('editor-active');
		});
	}
	editorActive();

	// facebook / github show text on icon hover
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

	// add classes on icon hover
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

	// global frontend functions
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
				modals.hideOverlay('.pad-list-modal');
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

$(document).ready(function(){

	// size everything properly
  window_size = function() {

    var height = $(window).height();													//this is the window height.
    var navHeight = $('.header').height();										//this is the height of the nav bar.
    var titleHeight = $('.title').height();										//the is the title height in the main area.
    var submitHeight = $('.submit-wrapper').height();					//the is the submit area height in the main area.
    var chatTitleHeight = $('.chat-title').height();
    var newPadBtnHeight = $('.new-pad').height();
    var editorHeight = $('.froala-editor').height();
    var signupStepHeight = $(window).height() - navHeight;
    var paddingMain = 82;																			//top and bottom padding of the text area.
    var padHeight = height - navHeight - titleHeight - paddingMain - editorHeight; 		
    var sideHeight =  height - navHeight; 										//this is the height of the two side bars.
    var chatHeight = sideHeight - chatTitleHeight - submitHeight - 1;
    var padListHeight = sideHeight - newPadBtnHeight;

    $(".left").css('height' , sideHeight);
    $(".all-pads").css('height', padListHeight);
    $(".right").css('height', sideHeight);
    $(".froala-element").css('height', padHeight);
    $('#editor-code').css('height' , padHeight);
    $(".new-pad-area").css('height', sideHeight);
    $('#messages').css('height' , chatHeight);
    $('.signup-step-wrapper').css('height' , signupStepHeight);



	}/* Set heights for divs */

	$(window).bind('resize', window_size);
})


$(window).load(function() {

	window_size();
    
	$('img').bind('dragstart', function(){
		return false; 
	});

});
