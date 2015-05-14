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


exports.createParents = function(req, res){
    console.log("POST /quest is called");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
        }
        var questInfo = {
            'content' : req.body.content,
            'point' : req.body.point,
            'fk_parents' : req.user.fk_parents
        };

        console.log(req.params.fk_kids);
        var condition = "fk_kids = "+ req.params.fk_kids;
        var Query =  conn.query('INSERT INTO parents_quest SET ?', questInfo  ,function(err, result){
            if(err){
                connection.release();
                console.log("err is " + err);
            }
            var Query = conn.query("SELECT * FROM push WHERE "+condition ,  function(err, rows){
                if(err){
                    connection.release();
                    console.log("err is " + err);
                }
                //GCM
                var message = new gcm.Message({
                    //collapseKey : 'demo',
                    delayWhileIdle : false,
                    timeToLive : 1800,
                    data : {
                        key1 : 'hello',
                        key2 : '안녕'
                    }
                });

                var sender = new gcm.Sender(server_key);
                console.log(server_key);
                var registrationIds = [];

                var registration_id = rows;
                console.log('rows is ' + rows);
                //At least one required
                registrationIds.push(registration_id);
                /**
                 * Params : message-literal, registrationIds-array, No. of retries, callback-function
                 **/
                sender.send(message, registrationIds, 4, function(err, result){
                    if(err) console.error('error is' +err);
                    else console.log(result);
                });
            });
            res.status(200).send();
            connection.release();
        });
    });
}
