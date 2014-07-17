$( document ).ready(function() {
    function window_size() {
	    var height = $(window).height();										//this is the window height.
	    var navHeight = $('.header').height();									//this is the height of the nav bar.
	    var titleHeight = $('.title').height(); 								//the is the title height in the main area.
	    var paddingMain = 80;													//top and bottom padding of the text area.
	    var padHeight = height - navHeight - titleHeight - paddingMain; 		//this is the height of the pad.
	    var sideHeight =  height - navHeight; 									//this is the height of the two side bars.

	    sideHeight = parseInt(sideHeight) + 'px';
	    padHeight = parseInt(padHeight) + 'px';
	    $(".left").css('height',sideHeight);
	    $(".right").css('height', sideHeight);
	    $(".pad-area").css('height',padHeight);
	    $(".new-pad-area").css('height',sideHeight);
	}/* Set heights for divs */
	window_size();
    
    $(window).bind('resize', window_size);
    /* Set Side Bar to Window Size */

	$('.left').scroll(function() {
	    if ($(this).scrollTop() > 0 ) {
	        $(".new-pad").addClass("new-pad-active");
	    }
	    else {
        	$(".new-pad").removeClass("new-pad-active");
    	}
	}); /* Give the drop shadow to the "New Pad" area*/

	function newPad(){

		$('.new-pad-area').hide();
		$('.darken').hide();

		$('.new-pad').click(function(){
			$('.darken').show(); /* show the darken state */
			$('.new-pad-area').show(); /* show the new pad area */
			$('.new-pad-area').animate({left:'235px'}, 100); /* move the pad for slide effect */
			$('#create-input').focus(); /* focus on the new pad input */
			inputFocus();
			padType();
		});

		$(document).mouseup(function (e)
		{
		    var container = $(".new-pad-area");

		    if (!container.is(e.target) // if the target of the click isn't the container...
		        && container.has(e.target).length === 0) // ... nor a descendant of the container
		    {
		        container.hide(); /* hide the new pad area */
		        $('.new-pad-area').animate({left:'220px'},0); /* move the div back */
		        $('.darken').hide(); /* hiden darken state */
		    }
		});
	}
	newPad();

	function inputFocus(){

		$("input").focus(function() {
	 		$('.underline').css('border', '2px solid #33bea8');
	 		$('.underline').css('border-top', 'none');
		});

		$("input").focusout(function() {
			$('.underline').css('border', 'none');
	 		$('.underline').css('border-bottom', '2px solid #ddd');
		});
	}

	function padType(){

		$('#text-pad').click(function(){
			$(this).parent().removeClass('inactive-type');
			$(this).parent().addClass('active-type');
			$('#code-pad').addClass('')
			$('#code-info').hide();
			$('#text-info').show();
		}); /* if you click text pad */

		$('#code-pad').click(function(){
			$(this).parent().removeClass('inactive-type');
			$(this).parent().addClass('active-type');
			$('#text-info').hide();
			$('#code-info').show();
		});
	}
	

});




