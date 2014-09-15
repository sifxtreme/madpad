var mongoose = require('mongoose');
var Pad = require('./models/pad.js');

privacy = {
  db: {type: 'redis'},
  browserChannel: {cors: '*'},
  auth: function(agent, action) {
  	console.log('d' + agent.authentication)
    var docName = action.docName;
    var padInfo = Pad.findOne(
      {'name': docName},
      function(err, obj){
        if(!obj){
        	console.log('pad object is not in the mongodb')
          action.accept();
        }
        else{
          var writeAccess = obj.writeAccess;
          var readAccess = obj.readAccess;
          console.log()
          writeAccess = true;
          readAccess = true;

          if(action.name == 'connect'){
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
                  action.reject();
                }
              }
              else{
                action.reject();
              }
            }
          }
        }
      });
    }
}

module.exports = privacy;