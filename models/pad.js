var mongoose = require('mongoose');

var Pad = mongoose.model('Pad', {
	name: String,
	owner: String,
	writeAccess: Boolean,
	readAccess: Boolean,
	codeType: String,
	chatOn: Boolean,
});

module.exports = Pad;