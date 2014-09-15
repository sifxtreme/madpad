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

// var newPad = new Pad({
//   name: "sifxtreme_code_hello",
//   owner: "53e05b93f6328bfd0b07f506",
//   writeAccess: true,
//   readAccess: true,
//   codeType: 'html'
// });

// newPad.save(function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log(newPad)
//   }
// })