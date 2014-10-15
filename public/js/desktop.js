$(document).ready(function(){

	isHome = (document.location.pathname == '/') ? true : false;

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

		$('#editor').mouseenter(function() {
			$('.froala-box').addClass('editor-active');
		});

		$('#editor').mouseleave(function() {
			$('.froala-box').removeClass('editor-active');
		});
	}
	if(!isHome){
		editorActive();
	}

	//home page example
	if(isHome){
		$('.offset').css('height' , '70px');

		function stickyHeader(){
			$(window).scroll(function(){
				var scroll = $(window).scrollTop();

				if(scroll >= 650){
					$('.header').addClass('header-sticky');
				}
				else{
					$('.header').removeClass('header-sticky');
				}
			});
		}

		function homeHero(){
			$('#editor, #editor-code').mouseenter(function() {
				$('.hero').addClass('visible');
				$('.hero').removeClass('hidden');
			});

			$('#editor, #editor-code').mouseleave(function() {
				$('.hero').addClass('hidden');
				$('.hero').removeClass('visible');
			});
		}

		function togglePadHome(){
			$('#textpad-home').hide();
			$('#text-btn').click(function(){
				$('#code-btn').removeClass('active');
				$('#text-btn').addClass('active');
				$('#codepad-home').hide();
				$('#textpad-home').show();
			});
			$('#code-btn').click(function(){
				$('#text-btn').removeClass('active');
				$('#code-btn').addClass('active');
				$('#textpad-home').hide();
				$('#codepad-home').show();
			});
		}

		homeHero();
		togglePadHome();
		stickyHeader();
	}

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

	// size everything properly
	window_size = function() {

		var height = $(window).height();
		var navHeight = $('.header').height();
		var titleHeight = $('.title').height();
		var editorHeight = $('.froala-editor').height();
		var paddingMain = 82;
		var padHeight = height - navHeight - titleHeight - editorHeight - paddingMain;
		var sideHeight =  height - navHeight;
		var chatTitleHeight = $('.chat-title').height();
		var submitHeight = $('.submit-wrapper').height();
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
	if(!isHome){
		$(window).bind('resize', window_size);		
	}
	

})

$(window).load(function() {

	if(!isHome){
		window_size();	
	}
	
	$('img').bind('dragstart', function(){
		return false; 
	});

});