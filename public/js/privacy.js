$(document).ready(function(){
	if(typeof madpadSocket === 'undefined') return;

	changePadEditablity = {
		close: function(){
			if(typeof editor !== 'undefined'){
				editor.setReadOnly(true)	
			}
			// textpad
		},

		open: function(){
			if(typeof editor !== 'undefined'){
				editor.setReadOnly(false)	
			}
			// textpad

		}
	}

	if(padPrivacyStatus == 'shared' && !isOwner){
		changePadEditablity.close();
	}
	
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
		},
		changeToSharedIcon: function(){
			$('.pad-settings').removeClass('private-icon').removeClass('shared-icon').removeClass('public-icon').addClass('shared-icon');
		},
		changeToPrivateIcon: function(){
			$('.pad-settings').removeClass('private-icon').removeClass('shared-icon').removeClass('public-icon').addClass('private-icon');
		}
	}

	$("#padPublic").on("click", function(){
		padPrivacy.makePublic();
		
	});
	$("#padShared").on("click", function(){
		padPrivacy.makeShared();
		
	});
	$("#padPrivate").on("click", function(){
		padPrivacy.makePrivate();
	});

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


});