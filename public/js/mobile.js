$(document).ready(function(){

	isHome = (document.location.pathname == '/') ? true : false;

	var window_size = function() {
		var height = $(window).height();
		var header = 50;
		var chatMessageHeight = height - 162;
		$('#messages').css('height', chatMessageHeight);
		$('.pad-list-modal').css('height', height);
		$('#editor-code').css('height', height - header - 30);
	}();


	var socialIcons = function(){
		var fbShare = $("#share-facebook");
		if(fbShare.length){
			var fbURL = fbShare.attr("href").replace(/www\.madpad\.me/g, encodeURIComponent(window.location.host + "/" + window.location.pathname));
			fbShare.attr("href", fbURL);			
		}
		var twitterShare = $("#share-twitter");
		if(twitterShare.length){
			var twitterURL = twitterShare.attr("href").replace(/www\.madpad\.me/g, encodeURIComponent(window.location.host + "/" + window.location.pathname));
			twitterShare.attr("href", twitterURL);
		}
		var emailShare = $("share-email");
		if(emailShare.length){
			var emailURL = emailShare.attr("href").replace(/www\.madpad\.me/g, encodeURIComponent(window.location.host + "/" + window.location.pathname));
			emailShare.attr("href", emailURL);
		}
		$("#share-share").click(function(){
			window.prompt("Copy to Clipboard", document.URL);
		});
	}();

	var mobileTabs = function(){
		$('.m-chat-content').hide();
		$('.m-share-content').hide();

		$('.m-pad').click(function(){
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
	};
	mobileTabs();

	function padList(){
		$('.hamburger').click(function(){
			$('.pad-list-modal').removeClass('overlay-close');
			$('.pad-list-modal').addClass('overlay-open');
		});
	}
	padList();

	function newPad(){
		$('.m-plus').click(function(){
			$('.create-pad-modal').removeClass('overlay-close');
			$('.create-pad-modal').addClass('overlay-open');
		});
	}	
	newPad();


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
			return false;
		});

		$(".home-signup").click(function(){
			$('#login-msg').hide();
			$('#sign-msg').show();
			$('#account-text').html('sign up for madpad');
			$('#m-login').removeClass('overlay-close');
			$('#m-login').addClass('overlay-open');
		});

		$('#signup-text, .home-signup').click(function(){
			$('#login-msg').hide();
			$('#sign-msg').show();
			$('#account-text').html('sign up for madpad');
			return false;
		});

		$('#login-text').click(function(){
			$('#sign-msg').hide();
			$('#login-msg').show();
			$('#account-text').html('login to madpad');
			return false;
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
			$('.create-pad-modal').removeClass('overlay-open');
			$('.create-pad-modal').addClass('overlay-close');
		});
	}
	hideMobileModal();

	var mobileUserDropDown = {
		container: $('.m-account'),
		toHide: $('#user-dropdown'),
		dropDown: function(){
			var _this = this;
			$('#open-user').on('click' , function(){
				_this.toHide.toggle();
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
			});
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
			var _this = this;
			this.container.on('click' , function(e){
				_this.toHide.toggle();
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
