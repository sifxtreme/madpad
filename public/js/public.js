$(document).ready(function(){

	$('.username-wrapper').css('opacity' , '1').addClass('move');

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

	// add classes on icon hover
	function iconHover(){

		$('.title-options').children('.icon').mouseenter(function(){
			$(this).css('background-color', '#f4f6f9');
		});

		$('.title-options').children('.icon').mouseleave(function(){
			$(this).css('background-color', 'transparent');
		});

		$('.title-options').children('.icon').click(function(){
			$(this).css('background-color', 'transparent')
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
			},
			run: function(){
				this.escKeyHideOverlay(this);
				this.xButtonHideOverlay(this);
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
    var editorHeight = $('.froala-editor').height();
    var paddingMain = 82;																			//top and bottom padding of the text area.
    var padHeight = height - navHeight - titleHeight - editorHeight - paddingMain;
    var sideHeight =  height - navHeight; 										//this is the height of the two side bars.
    var chatTitleHeight = $('.chat-title').height();
    var submitHeight = $('.submit-wrapper').height();					//the is the submit area height in the main area.
    var chatHeight = sideHeight - chatTitleHeight - submitHeight - 1;
    var signupStepHeight = $(window).height() - navHeight;

    $(".left").css('height' , sideHeight);
    $(".all-pads").css('height', sideHeight);
    $(".right").css('height', sideHeight);
    $(".froala-element").css('height', padHeight);
    $('#editor-code').css('height' , padHeight);
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
