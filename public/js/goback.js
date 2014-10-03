$(document).ready(function(){

	if(!document.referrer || document.referrer.split('/')[2] != window.location.host){
		$('.goback_403').html('<a href="#">go back home.</a>');
		$('.goback_404').html('<a href="#">Go back home.</a>');
	}

	$('.goback_403 a, .goback_404').on('click', function(){
		if(document.referrer && document.referrer.split('/')[2] == window.location.host){
			history.go(-1);
		}
		else{
			if(username){
				window.location.href = '/' + username + '/home';
			}
			else{
				window.location.href = '/';
			}
		}

		return false;
	})
});