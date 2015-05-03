var gcm = require('node-gcm');
var conn = require('./db.js');

exports.regist = function(req, res){
	console.log('POST /regist is called');
	conn.getConnection(function(err,connection){
		if(err)
			console.error('MySQL connection err');
		
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
		var server_internal_key = 'AIzaSyAV1bgmNN7BQMwGmUXHWH14jWnRm8TNZ1w';
		var server_external_key = 'AIzaSyDCdIuUDaYm6TiUn7RwPY4Z0MQQjV3o_EQ';
		var server_access_key = server_internal_key;
		var sender = new gcm.Sender(server_access_key);

		var registrationIds = [];

		var registration_id = req.body.regist_id;
		var user_id = req.body.user_id;
		console.log(registration_id + '\r\n'+ user_id);

		//At least one required
		registrationIds.push(registration_id);
		console.log('ssss');
		/**
		  * Params : message-literal, registrationIds-array, No. of retries, callback-function
		  **/
		sender.send(message, registrationIds, 4, function(err, result){
			console.log('sender');
			console.log(result);
		});
		console.log('hello kyuli');
        console.log('kkkk');
        console.log('what!!!')
	});
};
