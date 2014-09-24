$(document).ready(function(){
	if(typeof madpadSocket === 'undefined') return;

	// delete pad modal
	var deletePad = {
		deleteConfirm: function(){
			// don't allow them to delete home template
			if(isOwner && id == 'home') return;
			if(confirm('Are you absolutely sure? This cannot be reversed!')){
				madpadSocket.emit('deletePad', {room: padName, padName: padName, padURL: location.pathname.slice(1)});	
			}
		},
		onSocket: function(){
			madpadSocket.on('padDeleted', function(data){
				// blank out text
				if($('#editor-code').length) editor.getSession().setValue('');
				if($('#pusherContentEditable').length) $("#editor").editable("setHTML", '');

				// go to users home template
				if(username){
					document.location.href = '/' + username + '/home?d=1';
				}
				// if logged out just go to home
				else{
					document.location.href = '/?d=1';
				}
			})
		},
		run: function(modals){
			var _this = this;

			_this.onSocket();

			// hide if not already hidden if user's home template
			if(isOwner && id == 'home'){
				$('.trash-icon').remove();
			}

			$('.trash-icon').click(function(){
				modals.showOverlay('.delete-confirmation');
			});

			$('#confirm-delete').click(function(){
				_this.deleteConfirm();
				modals.hideOverlay('.delete-confirmation');
			});

			$('#cancel-delete').click(function(){
				modals.hideOverlay('.delete-confirmation');
			});
		}
	}

	deletePad.run(mpFrontend.modals);

})