var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var User = require('./models/user.js')
var config = require('./oauth.js')

// config
module.exports = passport.use(new FacebookStrategy(
{
 clientID: config.facebook.clientID,
 clientSecret: config.facebook.clientSecret,
 callbackURL: config.facebook.callbackURL,
 profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'gender']
},
function(accessToken, refreshToken, profile, done) {
	var profileID = profile.id;
	var displayName = profile.displayName;
	var pictureURL = 'https://graph.facebook.com/' + profileID + '/picture?width=150&height=150';
	var email = profile.emails[0].value

	User.findOne({ facebookID: profileID }, function(err, user){

		if(err) {
			console.log(err);
		}
		// user found
		if(!err && user != null){
			user.email = email;
			user.facebookName = displayName;
			user.facebookPicture = pictureURL;
			user.facebookDate = Date.now();
			user.save(function(err){
				if(err){
					console.log(err);
				}
				else{
					done(null, user);
				}
			});
		}
		// user not found
		else{
			var newUser = new User({
				facebookID: profileID,
				facebookName: displayName,
				facebookPicture: pictureURL,
				facebookDate: Date.now(),
				email: email
			});
			newUser.save(function(err){
				if(err){
					console.log(err);
				}
				else{
					done(null, newUser);
				}
			})
		}

	});
	
}
));

passport.use(new GithubStrategy({
 clientID: config.github.clientID,
 clientSecret: config.github.clientSecret,
 callbackURL: config.github.callbackURL,
 profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'gender']
},
function(accessToken, refreshToken, profile, done) {
	var profileID = profile.id;
	var displayName = profile.displayName;
	var pictureURL = 'https://avatars.githubusercontent.com/u/' + profileID + '?s=150'
	var email = profile.emails[0].value

	User.findOne({ githubID: profileID }, function(err, user){

		if(err) {
			console.log(err);
		}
		// user found
		if(!err && user != null){
			user.email = email;
			user.githubName = displayName;
			user.githubPicture = pictureURL;
			user.githubDate = Date.now();
			user.save(function(err){
				if(err){
					console.log(err);
				}
				else{
					done(null, user);
				}
			});
		}
		// user not found
		else{
			var newUser = new User({
				githubID: profileID,
				githubName: displayName,
				githubPicture: pictureURL,
				githubDate: Date.now(),
				email: email
			});
			newUser.save(function(err){
				if(err){
					console.log(err);
				}
				else{
					done(null, newUser);
				}
			})
		}

	});
}
));
