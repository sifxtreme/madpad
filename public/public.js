$(function(){
	// $(document).delegate('textarea', 'keydown', function(e) {
	// 	var keyCode = e.keyCode || e.which;
	// 	if (keyCode == 9) {
	// 		e.preventDefault();
	// 		var start = $(this).get(0).selectionStart;
	// 		var end = $(this).get(0).selectionEnd;

	// 		// set textarea value to: text before caret + tab + text after caret
	// 		$(this).val($(this).val().substring(0, start)
	// 								+ "\t"
	// 								+ $(this).val().substring(end));

	// 		// put caret at right position again
	// 		$(this).get(0).selectionStart =
	// 		$(this).get(0).selectionEnd = start + 1;
	// 	}
	// });


	// update value
	$('textarea').keyup(function() {
		var content = $('#content').val();
		// console.log("{{id}}");
	});

  // var iosocket = io.connect();
  // iosocket.on('connect', function () {
  //   iosocket.on('message', function(msg) {
  //       // console.log(msg);
  //   });
  // });
// var socket = io.connect();

var socket = io.connect();
socket.on('connect', function () {
	socket.emit('connection', '{{id}}');

 //  // disconnect
	// socket.on('disconnect', function() {
	// 	console.log("DISCONNECTED FROM SERVER");
	// });

	// message
	socket.on('message', function (data) {
		console.log("RECEIVE MESSAGE");
	  $('textarea').val(data);
	 });

});

$('textarea').keyup(function(event) {
	var message = $('textarea').val();
	console.log("SEND MESSAGE: " + message);
  socket.emit('send', { room: "{{id}}", message: message });
});

})