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
	// window[window_size]();
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

		$(document).mouseup(function (e)
		{
		    var container = $(".new-pad-area");

		    if (!container.is(e.target) // if the target of the click isn't the container...
		        && container.has(e.target).length === 0) // ... nor a descendant of the container
		    {
		        container.hide(); /* hide the new pad area */
		        $('.new-pad-area').animate({left:'220px'},0); /* move the div back */
		        $('.darken').hide(); /* hiden darken state */
		        $('.status').stop().slideUp();
		       
		    }
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



	function sendMessages(){
		$('.message-input').keypress(function(e){
			if(e.which ==13 && !e.shiftKey){
				$(this).submit();
				return false;
			}
		}); /* allows enter to send messages and shift enter to make new line */
	}
	sendMessages();

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

	// function openLogin(){
	// 	$('.login-button').click(function(){
	// 		$('.signup').hide();
	// 		$('.login').show();
	// 	});
	// 	closeModal();
	// }
	// openLogin();

	// function openSignUp(){
	// 	$('.signup-button').click(function(){
	// 		$('.login').hide();
	// 		$('.signup').show();
	// 	});
	// 	closeModal();
	// }
	// openSignUp();

	// function closeModal(){
	// 	$('.account').hide();
	// 	$('.modal-close').click(function(){
	// 		$(this).parent().hide();
	// 	});
	// }
	function loginToggle(){

		$('.login-button').click(function(){
			showOverlay('.login');
		});

		$('#signup-link').click(function(){
			hideOverlay('.login');
			showOverlay('.signup');
		});

	}
	loginToggle();

	function signUpToggle(){

		$('.signup-button').click(function(){
			hideOverlay('.login');
			showOverlay('.signup');
		});

		$('#login-link').click(function(){
			hideOverlay('.signup');
			showOverlay('.login');
		});
	}
	signUpToggle()

	function closeAccount(){

		$('.modal-close').click(function(){
			hideOverlay('.account');
		});
	}
	closeAccount();


	$(document).keyup(function(e){
		if(e.keyCode == 27){
			hideOverlay('.delete-confirmation');
			hideOverlay('.sharing-settings');
			hideOverlay('.account');
			$(".new-pad-area").hide();
			$('.darken').hide();

		}
	});

	mpFrontend = {
		chat: {
			open: function(){
				$('.chaton-icon').removeClass('chaton-icon').addClass('chatoff-icon');
				$('.middle').addClass('no-chat-fix');
				$('.right').hide();
			},
			close: function(){
				$('.chatoff-icon').removeClass('chatoff-icon').addClass('chaton-icon');
				$('.middle').removeClass('no-chat-fix');
				$('.right').show();				
			},
			run: function(){
				$("body").delegate(".chaton-icon", "click", this.open)
				$("body").delegate(".chatoff-icon", "click", this.close)		
			}
		},
		newPadForm: {
			usernameTemplate: $('input[name="pad[usernameTemplate]"]').val(),
			username: $('input[name="pad[currentUsername]"]').val(),
			getPadName: function(){
				return $('input[name="pad[name]"]').val()
			},
			getPadType: function(){
				return $('input[name="pad[type]"]').val()
			},
			textPadClick: function(){
				var _this = this;
				$('#text-pad').click(function(){
					$(this).parent().addClass('active-type');
					$('#code-pad').parent().removeClass('active-type');
					$('#code-info').hide();
					$('#text-info').show();
					$('input[name="pad[type]"]').val('text');
					_this.updateOpenPadURL();
				}); /* if you click text pad */				
			},
			codePadClick: function(){
				var _this = this;
				$('#code-pad').click(function(){
					$(this).parent().addClass('active-type');
					$('#text-pad').parent().removeClass('active-type');
					$('#text-info').hide();
					$('#code-info').show();
					$('input[name="pad[type]"]').val('code');
					_this.updateOpenPadURL();
				}); /* if you click code pad */
			},
			updateOpenPadURL: function(){
				var newPadURL = window.location.host;
				var padName = this.getPadName();
				var padType = this.getPadType();
				var padURL;

				// return if empty pad name
				if(padName == ''){
					$('.inputWhatPadWillOpen').text('');
					return false;
				}

				// pad name must be alphanumeric
				if( /[^a-zA-Z0-9_]/.test(padName)){
					$('.inputWhatPadWillOpen').text('Not valid pad name');
					return false;
				}

				// check if we are the user and on our username pad template
				if(this.username == this.usernameTemplate && this.usernameTemplate != ""){
					padURL = '/' + this.username;
					padURL += '/' + padName;
				}
				else if(padType == 'text'){
					padURL = '/' + padName;
				}
				else{
					padURL = '/code/' + padName;
				}
				newPadURL += padURL;
				newPadURL = newPadURL.toLowerCase();

				$('.inputWhatPadWillOpen').text(newPadURL);

				return padURL;

			},
			onInputChange: function(){
				var _this = this;
				$('input[name="pad[name]"]').on('keyup', function(){
					_this.updateOpenPadURL();
				})
			},
			onFormSubmit: function(){
				var _this = this;
				$('.newPadForm').submit(function(){
					var padName = _this.getPadName();
					var padType = _this.getPadType();

					var padURL = _this.updateOpenPadURL();

					// error messaging for blank entry
					if(padName == ''){
						$('.inputErrors').text("Enter in some text");
						return false;
					}

					if(_this.username != _this.usernameTemplate || _this.usernameTemplate == "" || _this.username == ""){
						window.location.href = padURL;
						return false;
					}

					if(!padURL) return false;

					$.ajax({
						type: "POST",
						url: padURL,
						data: $(this).serialize(),
						dataType: "json",
						timeout: 5000,
						complete: function(){
							console.log("complete");
						},
						success: function(data){
							console.log("success");
							console.log(data);
						},
						error: function(data){
							console.log("error");
							console.log(data);
						}
					})

					return false;
				});
			},
			run: function(){
				this.textPadClick();
				this.codePadClick();
				this.onInputChange();
				this.onFormSubmit();
			}
		},
		run: function(){
			this.chat.run();
			this.newPadForm.run();
		}
	}

	mpFrontend.run();

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

	function selectSetting(){

		function radioOn(element){
			$(element).children('.radio').removeClass('radio-off').addClass('radio-on');
		}

		function radioOff(element){
			$(element).children('.radio').removeClass('radio-on').addClass('radio-off');
		}


		$('#private-setting').click(function(){
			radioOn(this);
			radioOff('#shared-setting');
			radioOff('#public-setting');
		});

		$('#shared-setting').click(function(){
			radioOn(this);
			radioOff('#private-setting');
			radioOff('#public-setting');
		});

		$('#public-setting').click(function(){
			radioOn(this);
			radioOff('#private-setting');
			radioOff('#shared-setting');
		});
	}

	function settingsToggle(){

		selectSetting();

		$('.pad-settings').click(function(){
			showOverlay('.sharing-settings');
		});

		$('#save-settings').click(function(){
			hideOverlay('.sharing-settings');
		});

		$('#cancel-settings').click(function(){
			hideOverlay('.sharing-settings');
		});

	}
	settingsToggle();


	function deleteToggle(){
		$('.trash-icon').click(function(){
			showOverlay('.delete-confirmation');
		});

		$('#confirm-delete').click(function(){
			hideOverlay('.delete-confirmation');
		});

		$('#cancel-delete').click(function(){
			hideOverlay('.delete-confirmation');
		});
	};
	deleteToggle();


	function hideOverlay(element){
		$(element).removeClass('overlay-open');
		$(element).addClass('overlay-close');
	}

	function showOverlay(element){
		$(element).removeClass('overlay-close');
		$(element).addClass('overlay-open');
	}
	//Open and Close Overlays

});



