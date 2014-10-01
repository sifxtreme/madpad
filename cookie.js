var sessions = require("client-sessions");
var secret = require("./cookie-secret.js")

var options = {
	cookieName: 'madpad_user',
	secret: secret,
	duration: 7 * 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 5 * 60 * 60 * 1000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}

var decode = function(text){
	return sessions.util.decode({cookieName: options.cookieName, secret: options.secret}, text)
}	

var formatSocketCookie = function(text){
	if(!text) return false;
	var cookiesArray = [];
	text = text.replace(';', '');
	cookiesArray = text.split(' ');

	var cookiesDict = {};
	for(var i=0; i<cookiesArray.length; i++){
		var c = cookiesArray[i];
		var cArray = [];
		if(c.indexOf('=') !== -1){
			cArray = c.split('=');
			cookiesDict[cArray[0]] = cArray[1];
		}
	}
	return(cookiesDict);
}

var getUserData = function(text){
	if(!text) return false;
	var encoded = formatSocketCookie(text);
	if(encoded.madpad_user){
		return decode(encoded.madpad_user);	
	}
}

module.exports = sessions(options);
module.exports.decode = decode;
module.exports.getUserData = getUserData;