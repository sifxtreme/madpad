$(document).ready(function(){

	// size everything properly
  window_size = function() {

    var height = $(window).height();													//this is the window height.
    var navHeight = $('.header').height();										//this is the height of the nav bar.
    var titleHeight = $('.title').height();										//the is the title height in the main area.
    var editorHeight = $('.froala-editor').height();
    var paddingMain = 82;																			//top and bottom padding of the text area.
    var padHeight = height - navHeight - titleHeight - editorHeight - paddingMain;
    var sideHeight =  height - navHeight; 										//this is the height of the two side bars.
    var chatTitleHeight = $('.chat-title').height();
    var submitHeight = $('.submit-wrapper').height();					//the is the submit area height in the main area.
    var chatHeight = sideHeight - chatTitleHeight - submitHeight - 1;
    var signupStepHeight = $(window).height() - navHeight;

    $(".left").css('height' , sideHeight);
    $(".all-pads").css('height', sideHeight);
    $(".right").css('height', sideHeight);
    $(".froala-element").css('height', padHeight);
    $('#editor-code').css('height' , padHeight);
    $('#messages').css('height' , chatHeight);
    $('.signup-step-wrapper').css('height' , signupStepHeight);

	}/* Set heights for divs */

	$(window).bind('resize', window_size);

})

$(window).load(function() {

    window_size();
    
    $('img').bind('dragstart', function(){
        return false; 
    });

});