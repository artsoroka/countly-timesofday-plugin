var plugin = {},
	common = require('../../../api/utils/common.js'),
    plugins = require('../../pluginManager.js'),
	fetch = require('../../../api/parts/data/fetch.js'), 
	moment = require('moment-timezone'); 

(function (plugin) {
	var now = Math.round(new Date().getTime()/1000);

	plugins.register("/session/begin", function(ob){

		var timeStamp  = ob.params.qstring.timestamp;
		var appKey     = ob.params.qstring.app_key; 

		common.db.collection('apps').findOne({key: appKey}, function(err, app){
			if( err ){
				return console.log(err); 
			}

			var timeBucket = (moment.tz(timeStamp * 1000, app.timezone)).hours();  

			common.db.collection('tod').insert({
				ts: timeStamp 
			   ,tb: timeBucket 
			   ,app: {
			   		 id: app._id
			   		,key: appKey
			   		,user_id: ob.params.app_user_id
			   		,timezone: app.timezone
			   }
			}, function(){});

		}); 
 
	}); 

}(plugin));

module.exports = plugin;
