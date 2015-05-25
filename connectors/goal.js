var conn = require('./db.js');
//CREATE CREATE post /goal
exports.create = function(req, res){
	console.log("POST /goal is called");
	conn.getConnection(function(err,connection){
		if(err){
			console.error('MySQl connection err');
			console.log(err);
		}
		var nowDate = new Date();
		var date = new Date(req.body.goal_date);
		var goalInfo = {
			'content' : req.body.content,
			'goal_cost' : req.body.goal_cost,
			'goal_date' : date,
			'date' : nowDate,
			'now_cost' : req.body.now_cost,
            'state' : req.body.state,
			'fk_kids' : req.user.fk_kids
		};
		var Query =  conn.query("INSERT INTO goal SET ? ", goalInfo  ,function(err, result){
			if(err){
				connection.release();
				console.log("err is " + err);
			}
			var Query = conn.query("UPDATE kids SET current_goal = ? WHERE pk_kids = ? ", [result.insertId, req.user.fk_kids],  function(err, result){
				if(err){
					connection.release();
					console.log("err is " + err);
				}
				console.log(result);
			});
			res.status(200).send();
			connection.release();
		});
	});
}
//READ GET /goal
exports.allGoal = function(req, res){
	console.log("GET /goal is called by kids");
	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQl connection err');
		}

		var condition = "fk_kids = " + req.user.fk_kids;
		var Query = conn.query("SELECT * FROM goal WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
			}
			res.status(200).json(rows);
			connection.release();
		});
	});
}
exports.allGoalParents = function(req, res){
	console.log("GEt /goal:/fk_kids is called by parents");
	conn.getConnection(function(err, connection){
		if(err){
			console.log('MySQL connection err');
			console.log('err is ' + err);
		}
		var condition = "p.fk_parents = " + req.user.fk_parents + " AND " +
						"p.fk_kids = " + req.params.fk_kids + " AND " +
						"g.fk_kids = " + req.params.fk_kids;
		var Query = conn.query("SELECT g.* FROM goal g, parents_has_kids p WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
			}
			res.status(200).json(rows);
			connection.release();
		});
	});
}
// current goal info get /goal/current - require kids
exports.currentGoal = function(req, res){
	console.log('GET /goal/current is called by kids');
	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQL connection err in cuurentGoal');
		}
		var condition = "k.pk_kids = g.fk_kids AND k.current_goal = g.pk_goal AND " +
						"g.fk_kids = " + req.user.fk_kids;
		var Query = conn.query("SELECT g.* FROM goal g, kids k WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
			}
				res.status(200).json(rows);
				connection.release();
		});
	});
}
// /goal/current/:fk_kids it all always use parents
exports.currentGoalParents = function(req, res){
	console.log('GET /goal/currents/:fk_kids is called by parents');
	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQL connection err in cuurentGoal');
		}
		var condition = "p.fk_parents = " + req.user.fk_parents + " AND " +
						"k.pk_kids = g.fk_kids AND k.current_goal = g.pk_goal AND " +
						"g.fk_kids = " + req.params.fk_kids;
		var Query = conn.query("SELECT g.* FROM goal g, parents_has_kids p, kids k WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
			}
				res.status(200).json(rows);
				connection.release();
		});
	});
}
//UPDATE PUT
exports.update = function(req, res){
	console.log("PUT /goal is called");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
	}
	//update the current cost of saving_list table
	var nowDate = new Date();
	//update the current cost of goal table
	// kids table and goal table의 current_goal and pk_goal, fk_kids and pk_kids를 비교해서 지금 같은 값을 가진 레코드의 goal 테이블에 now_cost를 업데이트 시킨다.
	// 그리고 saving_list에 값을 추가한다.
	//IT will be change nowDate --> device time
	// 'update goal g inner join kids k on g.pk_goal = k.current_goal and g.fk_kids = k.pk_kids set now_cost =(now_cost+?); insert into saving_list (now_cost, date, fk_kids) values(?,?,?) ', [req.body.now_cost,req.body.now_cost,nowDate,req.user.fk_kids],
	// "UPDATE goal g INNER JOIN kids k ON g.pk_goal = k.current_goal AND g.fk_kids = k.pk_kids SET now_cost=(now_cost+?); INSERT INTO saving_list (now_cost, date, fk_kids) values(?,?,?)"

    var condition = "g.pk_goal = k.current_goal" + " AND " +
                    "g.fk_kids = k.pk_kids" + " SET " +
                    "now_cost=(now_cost+?);" + req.body.now_cost +
                    " INSERT INTO saving_list (now_cost, date, state ,fk_kids) values(?,?,?,?)" + req.body.now_cost + nowDate + req.body.state + req.user.fk_kids;
    var Query = conn.query(	"UPDATE goal g INNER JOIN kids k ON "+condition, function(err, result){

        if(err){
			console.log('err is ' + err);
			connection.release();
		}
		console.log(req.body.now_cost);
		res.status(200).send();
		connection.release();
		});
	});
}

//DELETE REMOVE
exports.remove = function(req, res){
	console.log("DELETE /goal is called");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
	}
	console.log(req.param('pk_goal'));
	var Query = conn.query('delete from goal where pk_goal = ?',[req.user.pk_goal], function(err,rows){
		if(err){
			connection.release();
			console.log(err);
		}
		console.log(rows);
		res.status(200);
		connection.release();
		});
	});
}
