var mongoose = require('mongoose');
var Pad = require('./models/pad.js');

var privacy = {
  db: {type: 'redis'},
  browserChannel: {cors: ''},
  auth: function(agent, action) {
  	var userID = agent.authentication || '';
    var docName = action.docName;
    var padInfo = Pad.findOne({'name': docName}, function(err, pad){
      if(!pad){
        action.accept();
      }
      else{
        var writeAccess = pad.writeAccess;
        var readAccess = pad.readAccess;

        if(action.name == 'connect'){ // always allow connections
          action.accept();
        }
        else{
          if(writeAccess){
            action.accept();
          }
          else{
            if(readAccess){
              if(action.name == "get snapshot" || action.name == "open" || action.name == "get ops"){
                action.accept();
              }
              else{
              	// dont allow writing actions
              	// but check for owner
              	if(pad.owner == userID) action.accept();
                else action.reject();
              }
            }
            else{
            	// don't allow any actions
            	// but check for owner
            	if(pad.owner == userID) action.accept();
              else action.reject();
            }
          }
        }
      }
    });
  }
}

module.exports = privacy;