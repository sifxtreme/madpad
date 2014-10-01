var mongoose = require('mongoose');

var User = mongoose.model('User', {
	email: String,
	facebookID: Number,
	facebookName: String,
	facebookPicture: String,
	facebookDate: Date,
	githubID: Number,
	githubName: String,
	githubPicture: String,
	githubDate: Date,
	username: {type: String, lowercase: true, trim: true},
	pads: Array,
	created: Date
});

module.exports = User;