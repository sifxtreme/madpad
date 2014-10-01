var mongoose = require('mongoose');

var Pad = mongoose.model('Pad', {
	name: {type: String, lowercase: true, trim: true},
	owner: String,
	writeAccess: Boolean,
	readAccess: Boolean,
	codeType: String,
	chatOn: Boolean,
});

module.exports = Pad;