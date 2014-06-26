$(function(){

	// tab in textarea
	$(document).delegate('textarea', 'keydown', function(e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode == 9) {
			e.preventDefault();
			var start = $(this).get(0).selectionStart;
			var end = $(this).get(0).selectionEnd;
			// set textarea value to: text before caret + tab + text after caret
			$(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));
			// put caret at right position again
			$(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 1;
		}
	});

	// convert from textarea to non textarea
	$("#clickme").click(function(){
		var isTextArea = false;
		var swapOut = $(".main").first();
		if(swapOut.is("textarea")){
			isTextArea = true;
		}
		if(isTextArea){
			var value = swapOut.val();
			value = value.replace(/\</g, "&lt");
			value = Autolinker.link(value);
			swapOut.after("<div class='main' id='box'>" + value + "</div>");
			swapOut.remove();
		}
		else{
			var value = swapOut.html();
			console.log(value);
			value = jQuery(value).text();
			swapOut.after("<textarea class='main' id='box'>" + value + "</textarea>");
			swapOut.remove();
		}
	});
	
});