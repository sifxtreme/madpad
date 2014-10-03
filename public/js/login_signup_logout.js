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

});
