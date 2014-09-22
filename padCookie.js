var sessions = require("client-sessions");
var secret = require("./cookie-secret.js")

var options = {
	cookieName: 'my_pads',
	secret: secret,
	duration: 365 * 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 24 * 60 * 60 * 1000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}

module.exports = sessions(options);