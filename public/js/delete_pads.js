$(document).ready(function(){
	if(typeof padTemplate == 'undefined') return;
	if(!padTemplate) return;

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
					document.location.href = '/' + username + '/home';
				}
				// if logged out just go to home
				else{
					document.location.href = '/';
				}
				madpadCookieFunctions.setCookie("statusMessaging", "previous pad has been deleted");
			})
		},
		run: function(modals){
			var _this = this;

			_this.onSocket();

			// if user's home template AND if other users templates hide trash icon (if not already hidden)
			if((isOwner && id == 'home') || !isOwner){
				$('.trash-icon').remove();
				if(isMobile){
					$('.mobile-delete').remove();	
				}
			}

			if(isMobile){
				$('.mobile-delete').click(function(){
					_this.deleteConfirm();
				});
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

	// check if home template
	var isOurHomeTemplate = function(url){
		if(url.charAt(0) == '/'){
			url = url.slice(1);
		}
		var deleteURLArray = url.split('/');
		if(deleteURLArray[0] != undefined && deleteURLArray[1] != undefined){
			if(deleteURLArray[0] == username && deleteURLArray[1] == 'home'){
				return true;
			}
		}
		return false;
	}

	// delete pads from left side (recent pads)
	var deleteRecent = {
		remove: function(){
			$('.deleteRecent').on('click', function(e){
				var closestPad = $(this).parent().siblings('a');
				var removeElement = function(){
					closestPad.parent().remove();
				}
				var deleteURL = closestPad.attr('href').slice(1);

				// don't allow the user to delete their home template
				if(isOurHomeTemplate(deleteURL)) return;

				// remove from our cookie
				madpadSocket.emit('deleteRecent', deleteURL);

				// remove from dom with animation
				closestPad.parent().css('background-color' , '#4b555d')
				.animate({
					'marginLeft' : "-=50px",
					'opacity' : "0"
				}, 500)
				.delay(500)
				.animate({
					'height': "0",
				}, 100)
				.queue(removeElement);
			});
		},
		removeXFromHome: function(){
			// we don't want to show an X on our home template
			$('#sidebar-personal-pads li').each(function(){
				var padURL = $(this).children('a').attr('href');
				if(isOurHomeTemplate(padURL)){
					$(this).children('.pad-heart-x').remove();
				}
			});
		},
		run: function(){
			this.removeXFromHome();
			this.remove();
		}
	}

	deleteRecent.run();

})