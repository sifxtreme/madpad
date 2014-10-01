$(document).ready(function(){

	function mobileTabs(){

		$('.m-chat-content').hide();
		$('.m-share-content').hide();

		$('.m-pad').click(function(){
			console.log('clicked pad');
			console.log(this);
			$(this).addClass('active');
			$('.m-chat').removeClass('active');
			$('.m-share').removeClass('active');
			$('.m-pad-content').show();
			$('.m-chat-content').hide();
			$('.m-share-content').hide();
		});

		$('.m-chat').click(function(){
			$(this).addClass('active');
			$('.m-pad').removeClass('active');
			$('.m-share').removeClass('active');
			$('.m-chat-content').show();
			$('.m-pad-content').hide();
			$('.m-share-content').hide();
		});


		$('.m-share').click(function(){
			$(this).addClass('active');
			$('.m-pad').removeClass('active');
			$('.m-chat').removeClass('active');
			$('.m-share-content').show();
			$('.m-pad-content').hide();
			$('.m-chat-content').hide();
		});
	}
	mobileTabs();

});