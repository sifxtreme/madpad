var sessions = require("client-sessions");
var secret = require("./cookie-secret.js")

var options = {
	cookieName: 'my_pads',
	secret: secret,
	duration: 365 * 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 24 * 60 * 60 * 1000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}

var sortAndAdd = function(padsArray, padURL, padType){
  var compare = function(a,b){
    // we want favorites sorted at the top
    // then we want to sort by date
    if(a.favorite && !b.favorite){
      return -1;
    }
    else if(!a.favorite && b.favorite){
      return 1;
    }
    else{
      if (a.date > b.date)
        return -1;
      if (a.date < b.date)
        return 1;
    }
    return 0;
  }

  var containsObject = function(obj, list){
    for(var i = 0; i < list.length; i++) {
      var current = list[i];
      var obj1 = {}, obj2 = {};
      obj1[list[i].type] = list[i].url;
      obj2[obj.type] = obj.url;
      if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
      }
    }
    return false;
  }

  var uniqueObjects = function(a){
    var returnObj = [];
    for(var i = 0; i<a.length; i++){
      if(!containsObject(a[i], returnObj)){
        returnObj.push(a[i]);
      }
    }
    return returnObj;
  }

  var currentPads = padsArray || [];
  currentPads.push({type: padType, url: padURL, date: new Date().toISOString(), favorite: false});
  currentPads.sort(compare);
  currentPads = uniqueObjects(currentPads);

  return currentPads;
}

var format = function(cookie){
  if(typeof cookie !== 'object') return false;
  var favoritePads = [], privatePads = [], sharedPads = [], publicPads = [];
  for(var i=0; i<cookie.length; i++){
    var p = cookie[i];
    if(typeof p.type !== 'undefined'){
      if(p.type == 'favorite'){
       favoritePads.push({url: p.url, favorite: p.favorite}); 
      }
      else if(p.type == 'private'){
        privatePads.push({url: p.url, favorite: p.favorite});
      }
      else if(p.type == 'shared'){
        sharedPads.push({url: p.url, favorite: p.favorite});
      }
      else if(p.type == 'public'){
        publicPads.push({url: p.url, favorite: p.favorite});
      }
    }
  }

  return {favoritePads: favoritePads, privatePads: privatePads, sharedPads: sharedPads, publicPads: publicPads}
}

module.exports = sessions(options);
module.exports.sortAndAdd = sortAndAdd;
module.exports.format = format;