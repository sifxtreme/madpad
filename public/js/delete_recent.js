var deleteRecent = {
	remove: function(){
		$('.deleteRecent').on('click', function(e){
			var closestPad = $(this).parent().siblings('a');
			var deleteURL = closestPad.attr('href').slice(1);
			madpadSocket.emit('deleteRecent', deleteURL);
			closestPad.parent().remove();
		});
	},
	run: function(){
		this.remove();
	}
}

deleteRecent.run();