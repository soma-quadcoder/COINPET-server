var conn = require('./db.js');
//CREATE CREATE post /goal
exports.create = function(req, res){
	console.log("create() is called.");
	conn.getConnection(function(err,connection){
		if(err){
			console.error('MySQl connection err');
		}
		var nowDate = new Date();
		var accountInfo = {
			'date' : nowDate,
			'method' : req.body.method,
			'content' : req.body.content,
			'amount' : req.body.amount,
			'balance' : req.body.balance,
			'fk_kids' : req.user.fk_kids
		};
		console.log(accountInfo);
		var Query =  conn.query('INSERT INTO account_book SET ?', accountInfo  ,function(err, result){
			if(err){
				connection.release();
				console.log("err is " + err);
			}
			res.status(200).json('message : success ');
			connection.release();
		});
	});
}
//READ GET /goal
exports.allAccount = function(req, res){
	console.log("allAccount GET is called");

	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQl connection err');
		}

		var condition = "fk_kids = " + req.user.fk_kids;
		var Query = conn.query("SELECT * FROM account_book WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
			}
			console.log(rows);
			res.status(200).json(rows);
			connection.release();
		});
	});
}
exports.allAccountParents = function(req, res){
	console.log('allAcountParents');
	conn.getConnection(function(err, connection){
		if(err){
			console.log('MySQL connection err');
			console.log('err is ' + err);
		}
		console.log('ssss'+req.params.fk_kids + req.user.fk_parents);
		var condition = "p.fk_parents = " + req.user.fk_parents + " AND " +
						"p.fk_kids = " + req.params.fk_kids + " AND " +
						"a.fk_kids = " + req.params.fk_kids;
		var Query = conn.query("SELECT a.* FROM account_book a, parents_has_kids p WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
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
	}
	//update the current cost of saving_list table
	var nowDate = new Date();
	//update the current cost of goal table
	console.log(req.body.now_cost+req.body.pk_goal+req.user.fk_kids);
	// kids table and goal table의 current_goal and pk_goal, fk_kids and pk_kids를 비교해서 지금 같은 값을 가진 레코드의 goal 테이블에 now_cost를 업데이트 시킨다.
	// 그리고 saving_list에 값을 추가한다.
	var Query = conn.query('update goal g inner join kids k on g.pk_goal = k.current_goal and g.fk_kids = k.pk_kids set now_cost =(now_cost+?); insert into saving_list (now_cost, date, fk_kids) values(?,?,?) ', [req.body.now_cost,req.body.now_cost,nowDate,req.user.fk_kids], function(err, result){
		console.log(result);
		if(err){
			console.log('err is ' + err);
			connection.release();
		}
		res.send(result);
		connection.release();
		});
	});
}

//DELETE REMOVE
exports.remove = function(req, res){
	console.log("DELETE is called");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
	}
	console.log(req.param('pk_goal'));
	var Query = conn.query('delete from goal where pk_goal = ?',[req.user.pk_goal], function(err,rows){
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
