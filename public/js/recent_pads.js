$(document).ready(function(){

	// hide extra pad items initially if not already hidden
	$(".pad-item-hidden").each(function(){
		$(this).hide();
	})

	// toggle extra pads - add animation here
	$(".toggle-recent-pads").click(function(){
		var aElement = $(this).children("a");
		console.log(aElement);
		console.log($(this).html());
		$(this).parent().children(".pad-item-hidden").toggle();
		return false;
	})

});