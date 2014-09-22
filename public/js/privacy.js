$(document).ready(function(){
	if(typeof madpadSocket === 'undefined') return;

	// need to make global so that is available to codepad.js and textpad.js
	changePadEditablity = {
		close: function(){
			if(typeof editor !== 'undefined'){
				if(typeof editor.setReadOnly === 'function'){
					editor.setReadOnly(true);
				}
				else{
					$("#editor").editable("makeUneditable");
				}
			}
		},

		open: function(){
			if(typeof editor !== 'undefined'){
				if(typeof editor.setReadOnly === 'function'){
					editor.setReadOnly(false);
				}
				else{
					$("#editor").editable("makeEditable");		
				}
			}
		}
	};

	// change privacy settings of pad
	var padPrivacy = {
		makePublic: function(){
			padPrivacyStatus = 'public'
			madpadSocket.emit('togglePrivacy', {room: padName, type: 'public', write: true, read: true});
			this.changeToPublicIcon();
		},
		makeShared: function(){
			padPrivacyStatus = 'shared';
			madpadSocket.emit('togglePrivacy', {room: padName, type: 'shared', write: false, read: true});
			this.changeToSharedIcon();
		},
		makePrivate: function(){
			padPrivacyStatus = 'private';
			madpadSocket.emit('togglePrivacy', {room: padName, type: 'private', write: false, read: false});
			this.changeToPrivateIcon();
		},
		changeToPublicIcon: function(){
			$('.pad-settings').removeClass('private-icon').removeClass('shared-icon').removeClass('public-icon').addClass('public-icon');
			$('#settings-text').html('Editable by Anyone');
		},
		changeToSharedIcon: function(){
			$('.pad-settings').removeClass('private-icon').removeClass('shared-icon').removeClass('public-icon').addClass('shared-icon');
			$('#settings-text').html('Viewable by Anyone');
		},
		changeToPrivateIcon: function(){
			$('.pad-settings').removeClass('private-icon').removeClass('shared-icon').removeClass('public-icon').addClass('private-icon');
			$('#settings-text').html('Completely Private');
		}
	}

	// toggle privacy when someone else changes privacy settings
	madpadSocket.on('togglePrivacy', function(whichWay){
		// add user name checking
		if(usersRoom == username) return;
		console.log(whichWay);
		switch(whichWay){
			// open up writing on pads
			case 'public':
				padPrivacy.changeToPublicIcon();
				changePadEditablity.open();
				break;
			// turn off editing ability
			case 'shared':
				padPrivacy.changeToSharedIcon();
				changePadEditablity.close();
				break;
			// kick out users
			case 'private':
				padPrivacy.changeToPrivateIcon();
				location.reload(true);
				break;
			default:
				break;
		}
	});

	// change privacy settings modal
	var newPadPrivacy = '';
	var changePadPrivacy = {
		selectSetting: function(){
			var radioOn = function(element){
				$(element).children('.radio').removeClass('radio-off').addClass('radio-on');
			}
			var radioOff = function(element){
				$(element).children('.radio').removeClass('radio-on').addClass('radio-off');	
			}

			$('#private-setting').click(function(){
				newPadPrivacy = 'private';
				radioOn(this);
				radioOff('#shared-setting');
				radioOff('#public-setting');
			});

			$('#shared-setting').click(function(){
				newPadPrivacy = 'shared';
				radioOn(this);
				radioOff('#private-setting');
				radioOff('#public-setting');
			});

			$('#public-setting').click(function(){
				newPadPrivacy = 'public';
				radioOn(this);
				radioOff('#private-setting');
				radioOff('#shared-setting');
			});
		},
		run: function(modals){
			this.selectSetting();

			// set correct radio button initially on page load
			if(padPrivacyStatus == 'private'){
				$('#private-setting').trigger('click');
			}
			else if(padPrivacyStatus == 'shared'){
				$('#shared-setting').trigger('click');
			}
			else{
				$('#public-setting').trigger('click');	
			}

			// bring up settings modal
			$('.share-settings-icon').click(function(){
				if(!isOwner) return false;
				modals.showOverlay('.sharing-settings');
			});

			// save settings modal
			$('#save-settings').click(function(){
				if(newPadPrivacy == 'private'){
					padPrivacy.makePrivate();
				}
				else if(newPadPrivacy == 'shared'){
					padPrivacy.makeShared();
				}
				else{
					padPrivacy.makePublic();
				}

				modals.hideOverlay('.sharing-settings');
			});

			// cancel modal without saving
			$('#cancel-settings, .modal-close').click(function(){
				newPadPrivacy = padPrivacyStatus;
				modals.hideOverlay('.sharing-settings');
			});
		}
	}

	changePadPrivacy.run(mpFrontend.modals);

});