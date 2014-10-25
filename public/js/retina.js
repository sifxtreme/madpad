$(document).ready(function(){
	// Checking for Retina Devices
	var isRetina = function() {
		var query = '(-webkit-min-device-pixel-ratio: 1.5),\
		(min--moz-device-pixel-ratio: 1.5),\
		(-o-min-device-pixel-ratio: 3/2),\
		(min-device-pixel-ratio: 1.5),\
		(min-resolution: 144dpi),\
		(min-resolution: 1.5dppx)';

		if (window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia(query).matches)) {
			return true;
		}
		return false;
	}

	if(isRetina()) {
		$(".retina-image").each(function(){
			$(this).attr("src", $(this).attr("src").replace(".png", "@2x.png"));
		})
	}

})