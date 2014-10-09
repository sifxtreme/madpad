$(document).ready(function(){
	var mpIsMobile = (document.getElementById("mpIsMobile")) ? document.getElementById("mpIsMobile").value : "";
	var mpIsHome = (document.getElementById("mpIsHome")) ? document.getElementById("mpIsHome").value : "";

	var mpUsersRoom = (document.getElementById("mpUsersRoom")) ? document.getElementById("mpUsersRoom").value : "";
	var mpUserUsername = (document.getElementById("mpUserUsername")) ? document.getElementById("mpUserUsername").value : "";
	var mpUserID = (document.getElementById("mpUserID")) ? document.getElementById("mpUserID").value : "";
	var mpUserName = (document.getElementById("mpUserName")) ? document.getElementById("mpUserName").value : "";
	var mpUserPicture = (document.getElementById("mpUserPicture")) ? document.getElementById("mpUserPicture").value : "";
	var mpJustLoggedIn = (document.getElementById("mpJustLoggedIn")) ? document.getElementById("mpJustLoggedIn").value : "";
	var mpAnonID = (document.getElementById("mpAnonID")) ? document.getElementById("mpAnonID").value : "";
	var mpAnonColor = (document.getElementById("mpAnonColor")) ? document.getElementById("mpAnonColor").value : "";
	var mpAnonAnimal = (document.getElementById("mpAnonAnimal")) ? document.getElementById("mpAnonAnimal").value : "";
	var mpAnonName = (document.getElementById("mpAnonName")) ? document.getElementById("mpAnonName").value : "";

	var mpID = (document.getElementById("mpID")) ? document.getElementById("mpID").value : "";
	var mpIsTextPad = (document.getElementById("mpIsTextPad")) ? document.getElementById("mpIsTextPad").value : "";
	var mpPadType = (document.getElementById("mpPadType")) ? document.getElementById("mpPadType").value : "";
	var mpPadRead = (document.getElementById("mpPadRead")) ? document.getElementById("mpPadRead").value : "";
	var mpPadWrite = (document.getElementById("mpPadWrite")) ? document.getElementById("mpPadWrite").value : "";

	if(document.getElementById("variables")){
		document.getElementById("variables").remove();
	}
	
	////////////////
	isMobile = mpIsMobile;
	isHome = mpIsHome;
	////////////////

	// global user data
	usersRoom = mpUsersRoom.toLowerCase();
	username = mpUserUsername.toLowerCase();
	userID = mpUserID;
	isOwner = (usersRoom == username) ? true : false;
	justLoggedIn = mpJustLoggedIn;

	madpadUserData = {
		userID: userID,
		username: username,
		name: mpUserName,
		picture: mpUserPicture,
		unknown: {
			id: mpAnonID,
			color: mpAnonColor,
			animal: mpAnonAnimal,
			name: mpAnonName + '-' + mpAnonAnimal
		}
	}

	// global pad data
	id = mpID.toLowerCase();
	padType = (mpIsTextPad == 'true') ? 'text' : 'code';
	padName = (usersRoom) ? usersRoom + '_' + id : padType + '_' + id;
	padTemplate = true;
	padData = {
		type: mpPadType || 'text',
	}
	padPrivacyStatus = 'private';
	if(mpPadRead) padPrivacyStatus = 'shared';
	if(mpPadWrite) padPrivacyStatus = 'public';


	// sharejs authentication
	options = {authentication: userID};

	// global socket object
	madpadSocket = io();
	madpadSocket.emit('room', {room: padName, user: madpadUserData});

});
