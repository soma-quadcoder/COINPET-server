var gcm = require('node-gcm');
var conn = require('./db.js');

exports.regist = function(req, res){
	console.log('POST /regist is called');
		//or with object values
		var message = new gcm.Message({
		collapseKey : 'demo',
		delayWhileId : true,
		timeToLive : 3,
		data : {
			key1 : 'hello',
			key2 : '안녕'
		}
		});
	
		message.addData('key1', 'message1');
		message.addData('key2', 'message2');

		var server_internal_key = 'AIzaSyBPR9U2-tC51X28C7if9z6DN324PDbRVk4';
		var server_external_key = 'AIzaSyA91bpJ4n7CLXZtktyDsUtupHjiephQPyc';
		var server_android_key = 'AIzaSyDJY24gPBJLq7kestyJXGWqNcfNzq6HyKU';
		var server_access_key = server_android_key;
		var sender = new gcm.Sender(server_access_key);

		var registrationIds = [];

		var registration_id = req.body.regist_id;
		var user_id = req.body.user_id;
		console.log(registration_id + '\r\n'+ user_id);

		//At least one required
		registrationIds.push(registration_id);
		/**
		  * Params : message-literal, registrationIds-array, No. of retries, callback-function
		  **/
		sender.send(message, registrationIds, 4, function(err, result){
			if(err) console.error('error is' +err);
			else console.log(result);
	});
};
