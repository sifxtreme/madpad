$(document).ready(function(){

	// cookie set / get functions
	madpadCookieFunctions = {
		setCookie: function(cname, cvalue) {
	    var d = new Date();
	    d.setTime(d.getTime() + (60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
		},
		getCookie: function(cname){
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
			}
			return "";
		},
		deleteCookie: function(cname){
			document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		},
	}

	// header messaging for javascript
	var isAnimating = false;
	headerStatusMessaging = {
		setAnimateFalse: function(){
			isAnimating = false;
		},
		animate: function(){
			if(!isAnimating){
				isAnimating = true;
				$('.status')
					.stop(true, true)
					.slideDown()
					.delay(2000)
					.slideUp()
					.queue(this.setAnimateFalse);
			}
		},
		run: function(msg){
			if(!msg) return;
			$('.status').find('p').html(msg);
			this.animate();
		}
	}

	var displayInitialMessaging = function(msg){
		setTimeout(function(){
			headerStatusMessaging.run(msg);
		}, 1200)		
	}


	if(madpadCookieFunctions.getCookie('statusMessaging')){
		displayInitialMessaging(madpadCookieFunctions.getCookie('statusMessaging'));
		madpadCookieFunctions.deleteCookie('statusMessaging');
	}

	if(typeof justLoggedIn !== 'undefined' && justLoggedIn){
		displayInitialMessaging("Welcome back " + username + "!");
	}

});