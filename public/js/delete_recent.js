$(document).ready(function(){

	var deleteRecent = {
		remove: function(){
			$('.deleteRecent').on('click', function(e){
				var closestPad = $(this).parent().siblings('a');
				var deleteURL = closestPad.attr('href').slice(1);
				madpadSocket.emit('deleteRecent', deleteURL);
				closestPad.parent().css('background-color' , '#4b555d')
				.animate({
					'marginLeft' : "-=50px",
					'opacity' : "0"
				}, 500)
				.delay(500)
				.animate({
					'height': 0
				},1)	

				//closestPad.parent().remove();
			});
		},
		run: function(){
			this.remove();
		}
	}

	deleteRecent.run();

});