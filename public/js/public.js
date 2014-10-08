$(document).ready(function(){

	$('.username-wrapper').css('opacity' , '1').addClass('move');

	// add x on hover to recent pads
	var padItemOptions = function(){
		$('.pad-heart-x').hide();
		$('.pad-item').mouseenter(function(){
			$(this).find('.pad-heart-x').show();
		});
		$('.pad-item').mouseleave(function(){
			$(this).find('.pad-heart-x').hide();
		});
	}
	padItemOptions();

	// froala editor
	function editorActive(){

		$('#editor').mouseenter(function() {
			$('.froala-box').addClass('editor-active');
		});

		$('#editor').mouseleave(function() {
			$('.froala-box').removeClass('editor-active');
		});
	}
	editorActive();

	// add classes on icon hover
	function iconHover(){

		$('.title-options').children('.icon').mouseenter(function(){
			$(this).css('background-color', '#f4f6f9');
		});

		$('.title-options').children('.icon').mouseleave(function(){
			$(this).css('background-color', 'transparent');
		});

		$('.title-options').children('.icon').click(function(){
			$(this).css('background-color', 'transparent')
		});
	}
	iconHover();

	// global frontend functions
	mpFrontend = {
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
