$(function(){
	var room = window.location.pathname;
	var iosocket = io.connect();
	iosocket.on('connect', function () {
		iosocket.emit('connection', room);

		iosocket.on('message', function(afterMessage) {
			var textbox = $("#box").get(0);
			var beforeMessage = $("#box").val();

			var beforeLocation = getSelectionInfo(textbox);
			var beforeLength = beforeMessage.length;
			var afterLength = afterMessage.length;

			var offset = 0;
			var difference = Math.abs(beforeLength - afterLength);
			// change is made before the cursor
			if(beforeLocation.start + 1 == getOffset(beforeMessage.substring(0, beforeLocation.start + 1), afterMessage.substring(0, beforeLocation.start + 1))){
				offset = 0;
			}
			// change is made before the cursor
			else{
				if(beforeLength <= afterLength){
					offset = difference;
				}
				if(beforeLength > afterLength){
					offset = -1*difference;
				}
			}

			afterStartSelection = beforeLocation.start + offset;
			afterEndSelection = beforeLocation.end + offset;

			// paste or cut in the middle of text selection (rare case)
			if(afterStartSelection != afterEndSelection){
				if(beforeMessage.substring(beforeLocation.start, beforeLocation.end) != afterMessage.substring(afterStartSelection, afterEndSelection)){
					afterEndSelection = afterStartSelection;
				}
			}

			// set selection correctly
			$('#box').val(afterMessage);
			textbox.selectionStart = afterStartSelection;
			textbox.selectionEnd = afterEndSelection;
			textbox.focus();

		});
	});

	$('#box').on('input propertychange', function() {
		var message = $("#box").val();
		iosocket.emit('send', { room: room, message: message });
	});

	function getSelectionInfo (element) {
		var props = {};
		
		props.start  = element.selectionStart;
		props.end    = element.selectionEnd;
		props.length = props.end - props.start;
		props.text   = element.innerHTML.substr(props.start, props.length);
		
		return props;
	};

	function getOffset (before, after){
		compareNum = 0;

		l = Math.min(before.length, after.length);
		for( i=0; i<l; i++) {
			if( before.charAt(i) == after.charAt(i)) compareNum++;
		}

		return compareNum;
	}
});