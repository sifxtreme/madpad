$(document).ready(function(){

	var deleteRecent = {
		remove: function(){
			$('.deleteRecent').on('click', function(e){
				var closestPad = $(this).parent().siblings('a');
				var removeElement = function(){
					closestPad.parent().remove();
				}
				var deleteURL = closestPad.attr('href').slice(1);
				madpadSocket.emit('deleteRecent', deleteURL);
				closestPad.parent().css('background-color' , '#4b555d')
				.animate({
					'marginLeft' : "-=50px",
					'opacity' : "0"
				}, 400)
				.delay(400)
				.animate({
					'height': 0,
				}, 100)
				.queue(removeElement);
			});
		},
		run: function(){
			this.remove();
		}
	}

	deleteRecent.run();

});