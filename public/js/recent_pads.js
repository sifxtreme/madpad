$(document).ready(function(){

	// hide extra pad items initially if not already hidden
	$(".pad-item-hidden").each(function(){
		$(this).hide();
	})

	// toggle extra pads - add animation here
	$(".toggle-recent-pads").click(function(){
		aElement = $(this).children("a");

		if(aElement.text() == "More Pads"){
			aElement.text("Fewer Pads")
		} 
		else {
			aElement.text("More Pads");
		}
		
		$(this).parent().children(".pad-item-hidden").toggle();
		return false;
	})

});