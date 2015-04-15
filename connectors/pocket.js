var conn = require('./db.js');

//pocket money
//CREATE CREATE
exports.create = function(req, res){
	console.log("create() is called.");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
		throw err;
	}
	var nowDate = new Date();
	var Pocket = {
		'pk_pocket' : req.body.pk_pocket,
		'date' : nowDate,
		'list' : req.body.list,
		'method' : req.body.method
	};
	
	var Query =  conn.query('insert into PocketMoney set ?', Pocket,  function(err, result){
		if(err){
			connection.release();
			console.log("err is " + err);
			throw err;
		}
		console.log('result ' + result);
		res.status(200).send('message : success');
		connection.release();
	});
	});
}
//READ GET
exports.read = function(req, res){
	console.log("GET is called");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
		throw err;
	}
	var Query = conn.query('select * from PocketMoney', function(err, rows){
		if(err){
			connection.release();
			throw err;
		}
		console.log(rows);
		res.status(200).send(rows);
		connection.release();
	});
	});
}
//UPDATE PUT
exports.update = function(req, res){
	console.log("PUT is called");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
		throw err;
	}
	var Query = conn.query('update PocketMony set now_cost = ? where pk_goal = ?',[req.body.now_cost, req.body.pk_goal], function(err, result ){
		if(err){
			connection.release();
			console.log(err);
			throw err;
		}
		connection.release();
		console.log('result ' + result);
		res.status(200).send(result);
	});
	});
}

//DELETE REMOVE
exports.remove = function(req, res){
	console.log("DELETE is called");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
		throw err;
	}
	var Query = conn.query('delete from PocketMony where pk_pocket = ?',[req.body.pk_pocket], function(err,rows){
		if(err){
			connection.release();
			console.log(err);
			throw err;
		}
		console.log(rows);
		res.status(200).send(rows);
		connection.release();
		});
	});
}
