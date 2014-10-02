$(document).ready(function(){

	function mobileTabs(){
		$('.m-chat-content').hide();
		$('.m-share-content').hide();

		$('.m-pad').click(function(){
			console.log('clicked pad');
			console.log(this);
			$(this).addClass('active');
			$('.m-chat').removeClass('active');
			$('.m-share').removeClass('active');
			$('.m-pad-content').show();
			$('.m-chat-content').hide();
			$('.m-share-content').hide();
		});

		$('.m-chat').click(function(){
			$(this).addClass('active');
			$('.m-pad').removeClass('active');
			$('.m-share').removeClass('active');
			$('.m-chat-content').show();
			$('.m-pad-content').hide();
			$('.m-share-content').hide();
		});


		$('.m-share').click(function(){
			$(this).addClass('active');
			$('.m-pad').removeClass('active');
			$('.m-chat').removeClass('active');
			$('.m-share-content').show();
			$('.m-pad-content').hide();
			$('.m-chat-content').hide();
		});
	}
	mobileTabs();

	 window_size = function() {
	 	var height = $(window).height();
	 	var submitHeight = 70;
		var header = 92;
		var chatMessageHeight = $(window).height() - 162;
		$('#messages').css('height' , chatMessageHeight);
		$('.pad-list-modal').css('height' , height);
	 }
	 window_size();

	 function padList(){
	 	$('.hamburger').click(function(){
	 		$('.pad-list-modal').removeClass('overlay-close');
	 		$('.pad-list-modal').addClass('overlay-open');
	 	});
	 }
	 padList();

	 function accountLogo(){
	 	var height = $(window).height();
	 	var loginArea = 180;
	 	var logoOffset = (height - loginArea)/2 - 60;
	 	$('.logo').css('top' , logoOffset);
	 }
	 accountLogo();

	 function mobileLogin(){
	 	$('.m-account').click(function(){
	 		$('#m-login').removeClass('overlay-close');
	 		$('#m-login').addClass('overlay-open');
	 	});

	 	$('.open-login').click(function(){
	 		$('#m-signup').removeClass('overlay-open');
	 		$('#m-signup').addClass('overlay-close');
	 		$('#m-login').removeClass('overlay-close');
	 		$('#m-login').addClass('overlay-open');
	 	})
	 }
	 mobileLogin();


	 function mobileSignUp(){
	 	$('.open-signup').click(function(){
	 		$('#m-login').removeClass('overlay-open');
	 		$('#m-login').addClass('overlay-close');
	 		$('#m-signup').removeClass('overlay-close');
	 		$('#m-signup').addClass('overlay-open');
	 	});
	 }
	 mobileSignUp();


	 function hideMobileModal(){
	 	$('.x-modal').click(function(){
	 		$('.pad-list-modal').removeClass('overlay-open');
	 		$('.pad-list-modal').addClass('overlay-close');
	 		$('#m-login').removeClass('overlay-open');
	 		$('#m-login').addClass('overlay-close');
	 		$('#m-signup').removeClass('overlay-open');
	 		$('#m-signup').addClass('overlay-close');
	 	});
	 }
	 hideMobileModal();
});