var conn = require('./db.js');
//CREATE CREATE
exports.create = function(req, res){
	console.log("create() is called.");
	conn.getConnection(function(err,connection){
		if(err){
			console.error('MySQl connection err');
			throw err;
		}
		var nowDate = new Date();
		var goalInfo = {
			'method' : req.body.method,
			'content' : req.body.content,
			'goal_cost' : req.body.goal_cost,
			'goal_date' : req.body.goal_date,
			'date' : nowDate,
			'now_cost' : req.body.now_cost,
			'kids_PK_kids' : req.body.kids_pk
		};
		console.log(goalInfo);
		var Query =  conn.query('insert into goal set ?', goalInfo,  function(err, result){
			if(err){
				connection.release();
				console.log("err is " + err);
				throw err;
			}
			console.log('result ' + result);
			res.json('message : success');
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
		var pk_goal = req.param('pk_goal');
		console.log('in the get pk_goal' + pk_goal);
		if(pk_goal != null)
		{//select pk_goal
			console.log('not null!!!');
			var Query = conn.query('select * from goal where pk_goal = ?',pk_goal, function(err, rows){
				if(err){
					connection.release();
					throw err;
				}
			console.log(rows);
			res.status(200).send(rows);
			connection.release();
			});
	
		}
		else
		{
			var Query = conn.query('select * from goal', function(err, rows){
				if(err){
					connection.release();
					throw err;
				}
			console.log(rows);
			res.status(200).send(rows);
			connection.release();
			});
		}
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
	//update the current cost of goal table
	var Query = conn.query('update goal set now_cost = ? where pk_goal = ?',[req.body.now_cost, req.body.pk_goal], function(err, result ){
		if(err){
			connection.release();
			console.log(err);
			throw err;
		}
		connection.release();
		console.log('result ' + result);
		res.status(200).send(result);
	});
		
	//update the current cost of saving_list table
//	var Query = conn.query('insert into saving_list set 
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
	var Query = conn.query('delete from NowGoal where pk_goal = ?',[req.body.pk_goal], function(err,rows){
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
