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
		$('#editor-code').css('height' , height - header -30);
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

	 function mobileAccount(){
	 	$('#open-account').click(function(){
	 		$('#account-text').html('login to madpad');
	 		$('#login-msg').show();
	 		$('#sign-msg').hide();
	 		$('#m-login').removeClass('overlay-close');
	 		$('#m-login').addClass('overlay-open');
	 	});

	 	$('#signup-text').click(function(){
	 		$('#login-msg').hide();
	 		$('#sign-msg').show();
	 		$('#account-text').html('sign up for madpad');
	 	});

	 	$('#login-text').click(function(){
	 		$('#sign-msg').hide();
	 		$('#login-msg').show();
	 		$('#account-text').html('login to madpad');
	 	});
	 }
	 mobileAccount();


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

	var mobileUserDropDown = {
		container: $('.m-account'),
		toHide: $('#user-dropdown'),
		dropDown: function(){
			$('#user-dropdown').hide();

			$('#open-user').on('click' , function(e){
				$('#user-dropdown').toggle();
			});


		},
		hideOnOtherClick: function(){
			var _this = this;
			$(document).mouseup(function (e){
				if (!_this.container.is(e.target) // if the target of the click isn't the container...
				&& _this.container.has(e.target).length === 0) // ... nor a descendant of the container
				{
				_this.toHide.hide(); 
				}
			})
		},
		run: function(){
			this.dropDown();
			this.hideOnOtherClick();
		}
	};
	mobileUserDropDown.run();

	var mobileOptionDropDown = {
		container: $('.m-options'),
		toHide: $('#option-dropdown'),
		dropDown: function(){
			$('#option-dropdown').hide();
			console.log('original hide');
			$('.m-options').on('click' , function(e){
				$('#option-dropdown').toggle();
				console.log('click and toggle');
			});


		},
		hideOnOtherClick: function(){
			var _this = this;
			$(document).mouseup(function (e){
				if (!_this.container.is(e.target) // if the target of the click isn't the container...
				&& _this.container.has(e.target).length === 0) // ... nor a descendant of the container
				{
				_this.toHide.hide(); 
				}
			})
		},
		run: function(){
			this.dropDown();
			this.hideOnOtherClick();
		}
	};
	mobileOptionDropDown.run();

});