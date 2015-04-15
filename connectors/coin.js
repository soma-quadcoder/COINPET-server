var conn = require('./db.js');
//CREATE CREATE
exports.create = function(req, res){
	console.log("create() is called.");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
		throw err;
	}
	var nowCost = {
		'cost': req.body.cost
	};
	console.log(nowCost);
	console.log(req);
	var Query =  conn.query('insert into coin set ?', nowCost,  function(err, result){
		if(err){
			connection.release();
			console.log("err is " + err);
			throw err;
		}
		console.log('result ' + result);
		res.status(200).send(result);
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
	var Query = conn.query('select * from coin', function(err, rows){
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
	var Query = conn.query('update test set name = ?, address = ? where id = ?',[req.body.name,req.body.address, req.body.id], function(err, result ){
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
	var Query = conn.query('delete from test where id = ?',[req.body.id], function(err,rows){
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
