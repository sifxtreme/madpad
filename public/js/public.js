$(document).ready(function(){
	mpFrontend = {
		chat: {
			close: function(){
				$('.chaton-icon').removeClass('chaton-icon').addClass('chatoff-icon');
				$('.middle').addClass('no-chat-fix');
				$('.right').hide();
			},
			open: function(){
				$('.chatoff-icon').removeClass('chatoff-icon').addClass('chaton-icon');
				$('.middle').removeClass('no-chat-fix');
				$('.right').show();				
			},
			run: function(){
				$("body").delegate(".chatoff-icon", "click", this.open)
				$("body").delegate(".chaton-icon", "click", this.close);
			}
		},
		newPadForm: {
			getInputValue: function(elem){
				if(!elem.length) return '';
				return elem.val().toLowerCase() || '';
			},
			getPadName: function(formID){
				var elem = $(formID + ' input[name="pad[name]"]');
				return this.getInputValue(elem);
			},
			getPadType: function(formID){
				var elem = $(formID + ' input[name="pad[type]"]');
				return this.getInputValue(elem);
			},
			getPadUsername: function(formID){
				var elem = $(formID + ' input[name="pad[username]"]');
				return this.getInputValue(elem);
			},
			textPadClick: function(){
				var _this = this;
				$('.text-pad').on('click', function(){
					var formID = $(this).closest('form').attr('id');
					$('#' + formID + ' input[name="pad[type]"]').val('text');
					_this.updateOpenPadURL(formID);
				}); /* if you click text pad */

				// $('#text-pad').click(function(){
				// 	$(this).parent().addClass('active-type');
				// 	$('#code-pad').parent().removeClass('active-type');
				// 	$('#code-info').hide();
				// 	$('#text-info').show();
				// 	$('input[name="pad[type]"]').val('text');
				// 	_this.updateOpenPadURL();
				// }); 
			},
			codePadClick: function(){
				var _this = this;
				$('.code-pad').on('click', function(){
					var formID = $(this).closest('form').attr('id');
					$('#' + formID + ' input[name="pad[type]"]').val('code');
					_this.updateOpenPadURL(formID);
				}); /* if you click code pad */

				// $('#code-pad').click(function(){
				// 	$(this).parent().addClass('active-type');
				// 	$('#text-pad').parent().removeClass('active-type');
				// 	$('#text-info').hide();
				// 	$('#code-info').show();
				// 	$('input[name="pad[type]"]').val('code');
				// 	_this.updateOpenPadURL();
				// });
			},
			updateOpenPadURL: function(formID){
				var formID = '#' + formID;
				var newPadURL = window.location.host;
				var padName = this.getPadName(formID);
				var padType = this.getPadType(formID);
				var padUsername = this.getPadUsername(formID);
				var createPadURL, openPadURL;

				// return if empty pad name
				if(padName == ''){
					$('.inputWhatPadWillOpen').text('');
					return false;
				}

				// pad name must be alphanumeric
				if( /[^a-zA-Z0-9_-]/.test(padName)){
					$('.inputWhatPadWillOpen').text('Not valid pad name');
					return false;
				}

				// check if we are the user and on our username pad template
				if(padUsername){
					createPadURL = '/' + padUsername;
					createPadURL += '/' + padName;
				}
				else if(padType == 'text'){
					openPadURL = '/' + padName;
				}
				else{
					openPadURL = '/code/' + padName;
				}

				$('#createPadForm .inputWhatPadWillOpen').text(newPadURL + createPadURL);
				$('#openPadForm .inputWhatPadWillOpen').text(newPadURL + openPadURL);

				return {'create': createPadURL, 'open': openPadURL};

			},
			onInputChange: function(){
				var _this = this;
				$('input[name="pad[name]"]').on('keyup', function(){
					var formID = $(this).closest('form').attr('id');
					_this.updateOpenPadURL(formID);
				})
			},
			onFormSubmit: function(){
				var _this = this;
				$('.openCreatePadForm').submit(function(){
					var formID = $(this).attr('id');
					var padName = _this.getPadName('#' + formID);
					var padType = _this.getPadType('#' + formID);
					var padUsername = _this.getPadUsername('#' + formID);

					// error messaging for blank entry
					if(padName == ''){
						$('#' + formID + ' .inputPadErrors').text("Enter in some text");
						return false;
					}

					// check if pad url is valid
					var padURL = _this.updateOpenPadURL(formID);
					if(!padURL) return false;

					if(formID == 'openPadForm' && padURL.open != undefined){
						window.location.href = padURL.open;
						return false;
					}


					// we are a logged in user!
					$.ajax({
						type: "POST",
						url: padURL.create,
						data: $(this).serialize(),
						dataType: "json",
						timeout: 5000,
						complete: function(){
							console.log("complete");
						},
						success: function(data){
							console.log("success");
							console.log(data);
							if(data.success){
								window.location.href = padURL.create;
							}
							else if(data.error){
								// add error checking here
								$('#' + formID + ' .inputPadErrors').text(data.errorType);
							}

						},
						error: function(data){
							console.log("error");
							console.log(data);
							// add error checking here
							$('#' + formID + ' .inputPadErrors').text("SOMETHING WENT WRONG");
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
				modals.hideOverlay('.create-pad');
				$(".new-pad-area").hide();
				$('.darken').hide();
			},

			// delete modal
			deletePad: {
				run: function(modals){
					$('.trash-icon').click(function(){
						modals.showOverlay('.delete-confirmation');
					});

					$('#confirm-delete').click(function(){
						modals.hideOverlay('.delete-confirmation');
					});

					$('#cancel-delete').click(function(){
						modals.hideOverlay('.delete-confirmation');
					});
				}
			},

			createPad: {
				run: function(modals){
					$('.new-icon').click(function(){
						modals.showOverlay('.create-pad');
					});
				}
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
				this.deletePad.run(this);
				this.login.run(this);
				this.signup.run(this);
				this.createPad.run(this);
			},

		},
		run: function(){
			this.chat.run();
			this.newPadForm.run();
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
