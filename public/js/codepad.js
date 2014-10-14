$(window).load(function(){
	if(!$('#editor-code').length) return;

	// check for home page
	if(isHome){
		padName += "______";
		padData.type = 'html';
	}

	// change code mode
	var changeEditorType = function(type){
		editor.session.setMode("ace/mode/" + type);
		$("#mode").val(type);
	}
	// initial code editor
	editor = ace.edit("editor-code");
	changeEditorType(padData.type);
	editor.setTheme("ace/theme/chrome");
	editor.setShowPrintMargin(false);

	// change language on code
	$("#mode").on("change", function(){
		var codeMode = $(this).val();
		editor.session.setMode("ace/mode/" + codeMode);
		if(!isHome){
			madpadSocket.emit('modeChanged', {room: padName, codeMode: codeMode});	
		}
		
	})

	// if someone else changed the codemode
	madpadSocket.on('changeMode', function(newCode){
		changeEditorType(newCode);
		var newOptions = $("#mode option:selected").text().toLowerCase();
		headerStatusMessaging.run('code has been changed to ' + newOptions);
	});
	
	// share document
	sharejs.open(padName.toLowerCase(), 'text', options, function(error, doc) {
		doc.attach_ace(editor);	
		// go to the top line of the codepad editor when text loads
		// otherwise we will end up at the bottom of the content
		setTimeout(function(){editor.gotoLine(1)}, 1);
	});

	// if we are on a shared pad and not the owner
	if(padPrivacyStatus == 'shared' && !isOwner){
		changePadEditablity.close();
	}

});