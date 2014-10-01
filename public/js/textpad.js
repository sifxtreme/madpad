$(document).ready(function(){
	if(!$('#pusherContentEditable').length) return;

	var pad = document.getElementById('pusherContentEditable');

	sharejs.open(padName.toLowerCase(), 'text', options, function(error, doc) {
		window.doc = doc;
		doc.attach_editable(pad);

		// if we are on a shared pad and not the owner
		if(padPrivacyStatus == 'shared' && !isOwner){
			changePadEditablity.close();
		}
	});

});