$(document).ready(function(){
	
	$('.username-wrapper').css('opacity' , '1').addClass('move');
	$('.favorite-icon').on('click' , function(){
		$('.status').slideDown();
		setTimeout("$('.status').slideUp();", 3000);
	});

	function padItemOptions(){
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
		newPadForm: {
			defaultURL: "Your Pad's URL",
			getInputValue: function(elem){
				if(!elem.length) return '';
				return elem.val().toLowerCase() || '';
			},
			getPadName: function(){
				var elem = $('input[name="pad[name]"]');
				return this.getInputValue(elem);
			},
			getPadType: function(){
				var elem = $('input[name="pad[type]"]');
				return this.getInputValue(elem);
			},
			getPadUsername: function(){
				var elem = $('input[name="pad[username]"]');
				return this.getInputValue(elem);
			},
			textPadClick: function(){
				var _this = this;
				$('.text-pad').on('click', function(){
					$('input[name="pad[type]"]').val('text');
					$('.text-pad').addClass('active');
					$('.code-pad').removeClass('active');
					_this.updateOpenPadURL();
				}); /* if you click text pad */
			},
			codePadClick: function(){
				var _this = this;
				$('.code-pad').on('click', function(){
					$('input[name="pad[type]"]').val('code');
					$('.code-pad').addClass('active');
					$('.text-pad').removeClass('active');
					_this.updateOpenPadURL();
				}); /* if you click code pad */
			},
			personalPadClick: function(){
				var _this = this;
				$('#personal-type').on('click', function(){
					$(this).addClass('active');
					$('#public-type').removeClass('active');
					$('.openCreatePadForm').attr('createPadForm');
					$('#new-button').html('CREATE PAD');
					$('.pad-name').attr('placeholder' , 'Enter your pad name here...');
					_this.updateOpenPadURL();
				});
			},
			publicPadClick: function(){
				var _this = this;
				$('#public-type').on('click', function(){
					$(this).addClass('active');
					$('#personal-type').removeClass('active');
					$('.openCreatePadForm').attr('openPadForm');
					$('#new-button').html('OPEN PAD');
					$('.pad-name').attr('placeholder' , 'Enter public pad name...');
					_this.updateOpenPadURL();
				});
			},
			updateOpenPadURL: function(){
				var newPadURL = window.location.host;
				var padName = this.getPadName();
				var padType = this.getPadType();
				var padUsername = this.getPadUsername();
				var createPadURL, openPadURL;

				$('.inputPadErrors').html('');

				// return if empty pad name
				if(padName == ''){
					$('.inputWhatPadWillOpen').text(this.defaultURL);
					return false;
				}

				// pad name must be alphanumeric
				if( /[^a-zA-Z0-9_-]/.test(padName)){
					$('.inputWhatPadWillOpen').text(this.defaultURL);
					$('.inputPadErrors').html('<p>Not valid pad name</p>');
					return false;
				}

				// check if we are the user and on our username pad template
				if(padUsername && $('#personal-type').hasClass('active')){
					createPadURL = '/' + padUsername;
					createPadURL += '/' + padName;
				}
				else if(padType == 'text'){
					openPadURL = '/' + padName;
				}
				else{
					openPadURL = '/code/' + padName;
				}

				if($('#personal-type').hasClass('active')){
					$('.inputWhatPadWillOpen').text(newPadURL + createPadURL);	
				}
				else{
					$('.inputWhatPadWillOpen').text(newPadURL + openPadURL);	
				}
				
				return {'create': createPadURL, 'open': openPadURL};

			},
			onInputChange: function(){
				var _this = this;
				$('input[name="pad[name]"]').on('keyup', function(){
					_this.updateOpenPadURL();
				})
			},
			onFormSubmit: function(){
				var _this = this;
				$('.openCreatePadForm').submit(function(){
					var padName = _this.getPadName();
					var padType = _this.getPadType();
					var padUsername = _this.getPadUsername();

					// error messaging for blank entry
					if(padName == ''){
						$('.inputPadErrors').html("<p>Enter in a pad name</p>");
						return false;
					}

					// check if pad url is valid
					var padURL = _this.updateOpenPadURL();
					if(!padURL) return false;

					// we are opening a pad
					if($('#public-type').hasClass('active') && padURL.open != undefined){
						window.location.href = padURL.open;
						return false;
					}

					// we are a logged in user and creating a new pad
					$.ajax({
						type: "POST",
						url: padURL.create,
						data: $(this).serialize(),
						dataType: "json",
						timeout: 5000,
						success: function(data){
							if(data.success){
								window.location.href = padURL.create;
							}
							else if(data.error){
								// add error checking here
								var errorMessage = data.errorType;
								if(data.errorType == 'existence'){
									errorMessage = "Pad already exists. Click <a href='" + padURL.create + "'>here</a> to go to it";
								}
								$('.inputPadErrors').html('<p>' + errorMessage + '</p>');
							}

						},
						error: function(data){
							// add error checking here
							$('.inputPadErrors').html('<p>Pad creation failed, please try again later</p>');
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
				this.personalPadClick();
				this.publicPadClick();
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

			// create pad modal
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
				this.login.run(this);
				this.signup.run(this);
				this.createPad.run(this);
			},

		},
		run: function(){
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
	    // var container = $(".new-pad-area");

	  //   if (!container.is(e.target) // if the target of the click isn't the container...
	  //       && container.has(e.target).length === 0) // ... nor a descendant of the container
	  //   {
			// container.hide(); /* hide the new pad area */
			// $('.new-pad-area').animate({left:'220px'},0); /* move the div back */
			// $('.darken').hide(); /* hiden darken state */
	  //   }
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
