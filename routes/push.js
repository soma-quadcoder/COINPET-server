/*
var gcm = require('node-gcm');

//create a message with default values
var message = new gcm.Message();

//or with object values
var message = new gcm.Message({
	collapseKey : 'demo',
	delayWhileId : true,
	timeToLive : 3,
	data : {
		key1 : 'hello',
		key2 : '안녕',
	}
});
var server_internal_key = 'AIzaSyAV1bgmNN7BQMwGmUXHWH14jWnRm8TNZ1w';
var server_external_key = 'AIzaSyDCdIuUDaYm6TiUn7RwPY4Z0MQQjV3o_EQ';
var server_access_key = server_internal_key;
var sender = new gcm.Sender(server_access_key);

var registrationIds = [];

var registration_id = 'AIzaSyDJY24gPBJLq7kestyJXGWqNcfNzq6HyKU';

//At least one required
registrationsIds.push(registration_id);

sender.send(message, registrationIds, 4, function(err, result){
	console.log(result);
});

*/
