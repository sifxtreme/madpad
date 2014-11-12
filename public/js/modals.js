$(document).ready(function(){
	
	// global frontend functions
	mpFrontend = {
		modals: {
			//Open and Close Overlays
			showOverlay: function(element){
				$(element).removeClass('overlay-close');
				$(element).addClass('overlay-open');
				$('#body').addClass('overflow-hidden');	
			},
			hideOverlay: function(element){
				$(element).removeClass('overlay-open');
				$(element).addClass('overlay-close');
				$('#body').removeClass('overflow-hidden');	
			},
			escKeyHideOverlay: function(modals){
				var _this = this;
				$(document).keyup(function(e){
					if(e.keyCode == 27){
						_this.hideAllOverlays(modals);
						$('#body').removeClass('overflow-hidden');	
					}
				});
			},
			xButtonHideOverlay: function(modals){
				var _this = this;
				$('.modal-close').on('click', function(){
					_this.hideAllOverlays(modals);
					$('#body').removeClass('overflow-hidden');	
				});
			},
			hideAllOverlays: function(modals){
				modals.hideOverlay('.delete-confirmation');
				modals.hideOverlay('.sharing-settings-desktop');
				modals.hideOverlay('.account');
				modals.hideOverlay('.create-pad-modal');
				modals.hideOverlay('.pad-list-modal');
			},
			run: function(){
				this.escKeyHideOverlay(this);
				this.xButtonHideOverlay(this);
			},
		},
		run: function(){
			this.modals.run();
		}
	}

	mpFrontend.run();
});
