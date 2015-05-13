var conn = require('./db.js');
var server_key = require('./gcm.js');
var gcm = require('node-gcm');
//CREATE CREATE post /quest
exports.create = function(req, res){
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
			var Query = conn.query("SELECT regist_id  FROM push WHERE "+condition ,  function(err, rows){
				if(err){
					connection.release();
					console.log("err is " + err);
				}
				//GCM
                var message = new gcm.Message({
                    collapseKey : 'demo',
                    delayWhileId : true,
                    timeToLive : 3,
                    data : {
                        key1 : 'hello',
                        key2 : '안녕'
                    }
                });

                var sender = new gcm.Sender(server_key);
                console.log(server_key);
                var registrationIds = [];
                var str = rows[0];
                var registration_id =str.split(':')[1];  
                console.log(registration_id );
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
	var Query = conn.query('update goal g inner join kids k on g.pk_goal = k.current_goal and g.fk_kids = k.pk_kids set now_cost =(now_cost+?); insert into saving_list (now_cost, date, fk_kids) values(?,?,?) ', [req.body.now_cost,req.body.now_cost,nowDate,req.user.fk_kids], function(err, result){
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
