$( document ).ready(function() {
    function window_size() {
	    var height = $(window).height();										//this is the window height.
	    var navHeight = $('.header').height();									//this is the height of the nav bar.
	    var titleHeight = $('.title').height();									//the is the title height in the main area.
	    var submitHeight = $('.submit-wrapper').height();						//the is the submit area height in the main area.
	    var chatTitleHeight = $('.chat-title').height();
	    var paddingMain = 80;													//top and bottom padding of the text area.
	    var padHeight = height - navHeight - titleHeight - paddingMain; 		//this is the height of the pad.
	    var sideHeight =  height - navHeight; 									//this is the height of the two side bars.
	    var chatHeight = sideHeight - chatTitleHeight - submitHeight - 1;

	    sideHeight = parseInt(sideHeight) + 'px';
	    padHeight = parseInt(padHeight) + 'px';
	    $(".left").css('height', sideHeight);
	    $(".right").css('height', sideHeight);
	    $(".pad-area").css('height', padHeight);
	    $(".new-pad-area").css('height', sideHeight);
	    $('#messages').css('height' , chatHeight);
	}/* Set heights for divs */
	window_size();
    
    $(window).bind('resize', window_size);
    /* Set Side Bar to Window Size */

	$('img').bind('dragstart', function(){
		return false; 
	});

    function newPadShadow(){
		$('.left').scroll(function() {
		    if ($(this).scrollTop() > 0 ) {
		        $(".new-pad").addClass("new-pad-active");
		    }
		    else {
	        	$(".new-pad").removeClass("new-pad-active");
	    	}
		}); /* Give the drop shadow to the "New Pad" area*/
	}
	newPadShadow();

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
			$(this).parent().addClass('active-type');
			$('#code-pad').parent().removeClass('active-type');
			$('#code-info').hide();
			$('#text-info').show();
		}); /* if you click text pad */

		$('#code-pad').click(function(){
			$(this).parent().addClass('active-type');
			$('#text-pad').parent().removeClass('active-type');
			$('#text-info').hide();
			$('#code-info').show();
		}); /* if you click code pad */
	}

	function sendMessages(){
		$('.message-input').keypress(function(e){
			if(e.which ==13 && !e.shiftKey){
				$(this).submit();
				return false;
			}
		}); /* allows enter to send messages and shift enter to make new line */
	}
	sendMessages();

	function iconSelect(){
		$('.icons').mousedown(function(){
			$(this).removeClass('transition');
			$(this).addClass('icon-mousedown');
		});

		$(document).mouseup(function(e){
			$('.icons').addClass('transition');
			$('.icons').removeClass('icon-mousedown');
		});

	}
	iconSelect();


	


});




