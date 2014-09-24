$(document).ready(function(){

	var hearts = {
		favoriteName: location.pathname.slice(1),
		isFavorited: false,
		makeFavorite: function(){
			$('#heartFavoriteIcon').addClass('favorite-icon').removeClass('heart-icon');
		},
		makeUnfavorite: function(){
			$('#heartFavoriteIcon').addClass('heart-icon').removeClass('favorite-icon');
		},
		favoriteToServer: function(){
			madpadSocket.emit('favorite', {padName: this.favoriteName, favorite: true});
		},
		unfavoriteToServer: function(){
			madpadSocket.emit('favorite', {padName: this.favoriteName, favorite: false});
		},
		onIconClick: function(){
			// we want to unfavorite
			var _this = this;
			$('#heartFavoriteIcon').on('click', function(){
				// we want to defavorite
				if($(this).hasClass('favorite-icon')){
					_this.makeUnfavorite();
					_this.unfavoriteToServer();
				}
				// we want to favorite
				else{
					_this.makeFavorite();
					_this.favoriteToServer();
				}
			});
		},
		run: function(){
			this.onIconClick();
		}
	}

	hearts.run();

});