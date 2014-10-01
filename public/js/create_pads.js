$(document).ready(function(){

	var newPadForm = {
		defaultURL: "Your Pad's URL",
		isPersonalPad: true,
		initPersonPad: function(){
			var padUsername = this.getPadUsername();
			if(padUsername){
				this.isPersonalPad = true;
			}
			else{
				this.isPersonalPad = false;
			}
		},
		getInputValue: function(elem){
			if(!elem.length) return '';
			return elem.val().toLowerCase() || '';
		},
		getPadName: function(){
			var elem = $('input[name="pad[name]"]').filter(":last");
			return this.getInputValue(elem);
		},
		getPadType: function(){
			var elem = $('input[name="pad[type]"]').filter(":last");
			return this.getInputValue(elem);
		},
		getPadUsername: function(){
			var elem = $('input[name="pad[username]"]').filter(":last");
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
				_this.isPersonalPad = true;
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
				_this.isPersonalPad = false;
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
			if(padUsername && this.isPersonalPad){
				createPadURL = '/' + padUsername;
				createPadURL += '/' + padName;
			}
			else if(padType == 'text'){
				openPadURL = '/' + padName;
			}
			else{
				openPadURL = '/code/' + padName;
			}

			if(this.isPersonalPad){
				$('.inputWhatPadWillOpen').text(newPadURL + createPadURL);	
			}
			else{
				$('.inputWhatPadWillOpen').text(newPadURL + openPadURL);	
			}
			
			return {'create': createPadURL, 'open': openPadURL};

		},
		onInputChange: function(){
			var _this = this;
			$('input[name="pad[name]"]').filter(":last").on('keyup', function(){
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
							// set header messaging
							madpadCookieFunctions.setCookie("statusMessaging", "new pad has been created");

							// redirect to new pad url
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
		// create pad modal
		createPad: {
			run: function(modals){
				$('.new-icon').click(function(){
					modals.showOverlay('.create-pad');
				});
			}
		},
		run: function(){
			this.initPersonPad();
			this.textPadClick();
			this.codePadClick();
			this.onInputChange();
			this.onFormSubmit();
			this.personalPadClick();
			this.publicPadClick();
			this.updateOpenPadURL();
		}
	};

	newPadForm.run();
	newPadForm.createPad.run(mpFrontend.modals)

});
