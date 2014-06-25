$(function(){
	$(document).delegate('textarea', 'keydown', function(e) {
			// set textarea value to: text before caret + tab + text after caret
			$(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));

			// put caret at right position again
			$(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 1;
		}
	});
});