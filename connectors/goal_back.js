var conn = require('./db.js');
//CREATE CREATE post /goal
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
			'fk_kids' : req.user.fk_kids
		};
		console.log(goalInfo);
		var Query =  conn.query('insert into goal set ?', goalInfo  ,function(err, result){
			if(err){
				connection.release();
				console.log("err is " + err);
			}
			console.log(result.insertId);
			console.log('result ' + result);
			var Query = conn.query('update kids set current_goal = ? where pk_kids = ? ', [result.insertId, req.user.fk_kids],  function(err, result){
				if(err){
					connection.release();
					console.log("err is " + err);
				}
				console.log(result);
			});
			res.json('message : success [insert goal, change current_goal number]');
			connection.release();
		});
	});
}
//READ GET /goal
exports.allGoal = function(req, res){
	console.log("allGoal GET is called");
	console.log(req);
	//if(req.user.fk_parents)
	//	return;

	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQl connection err');
		}
		var fk_kids = req.user.fk_kids;
		var fk_parents = req.user.fk_parents;
		console.log(fk_kids);
		//pk_kids will be change fk_kids
		if(fk_parents != null){
			//부모가 /goal/:fk_kids로 자식의 정보를 요청하는 경우
			if(fk_kids != null){
				console.log('call!!!!');
				console.log(fk_parents + fk_kids);
				var Query = conn.query('SELECT g.* FROM goal g, parents_has_kids p WHERE p.fk_parents = ? AND p.fk_kids = ? AND g.fk_kids = ?', [req.user.fk_parents, fk_kids ,fk_kids], function(err, rows){
					if(err){
						console.log('err is ' + err);
						connection.release();
					}
					console.log(rows);
					res.send(rows);
					connection.release();
				});
			}
		}
		else{
			//자식의 자신의 정보를 요청하는 경우
			console.log('not null');
			var Query = conn.query('SELECT * FROM goal WHERE fk_kids = ?',req.user.fk_kids, function(err, rows){
				if(err){
					console.log('err' + err);
					connection.release();
				}
				console.log(rows[0]);
				res.status(200).send(rows);
				connection.release();
			});
		}
	});
}

// current goal info get /goal/current
exports.currentGoal = function(req, res){
	console.log('Current Goal called');
	console.log(req);
	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQL connection err in cuurentGoal');
		}
		var param_fk_kids = req.query.fk_kids;
		var fk_parents = req.user.fk_parents;
		if(fk_parents){
			if( param_fk_kids != null){
				var Query = conn.query('SELECT g.* FROM goal g, parents_has_kids p, kids k WHERE p.fk_parents = ? AND p.fk_kids = ? AND k.pk_kids = g.fk_kids AND k.current_goal = g.pk_goal And g.fk_kids = ?', [req.user.fk_parents,param_fk_kids,param_fk_kids], function(err, rows){
				if(err){
					console.log('err is' + err);
					connection.release();
				}
				console.log(rows);
				res.json(rows);
				connection.release();
				});
			}
		}
		else{
			var Query = conn.query('SELECT g.* FROM goal g, kids k WHERE k.pk_kids = g.fk_kids AND k.current_goal = g.pk_goal AND g.fk_kids = ?',req.user.fk_kids, function(err, rows){
				if(err){
					console.log('err is ' + err);
					connection.release();
				}
				console.log(rows);
				res.json(rows);
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
