var mongoose = require('mongoose');

var User = mongoose.model('User', {
	email: String,
	facebookID: Number,
	facebookName: String,
	facebookPicture: String,
	githubID: Number,
	githubName: String,
	githubPicture: String,
	pads: Array,
	created: Date
});

module.exports = User;