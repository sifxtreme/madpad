$(document).ready(function(){
	if(!$('#pusherContentEditable').length) return;

	var pad = document.getElementById('pusherContentEditable');

	var theSharing = sharejs.open(padName, 'text', options, function(error, doc) {
		window.doc = doc;
		doc.attach_editable(pad);
	});

});