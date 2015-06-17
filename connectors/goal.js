var conn = require('./db.js');


//CREATE CREATE post /goal
exports.create = function(req, res){
	console.log("POST /goal is called");
	conn.getConnection(function(err,connection){
		if(err){
			console.error('MySQl connection err');
			console.log(err);
			connection.release();
			res.status(500).send();
			return;
		}
		//var nowDate = new Date();
		var goalDate = new Date(req.body.goal_date).yyyymmdd();
        var date = new Date().yyyymmdd();
        var time = new Date().hhmmss();
        var nowDate = date+'T'+time;
        //nowPoint and level!!!!!!!!!!!!!!!!!!!!!!!!!!!! insert
		var goalInfo = {
			'content' : req.body.content,
			'goal_cost' : req.body.goal_cost,
			'goal_date' : goalDate,
			'date' : nowDate,
			'now_cost' : req.body.now_cost,
			'state' : 1,
			'fk_kids' : req.user.fk_kids
		};

		if(nowDate > goalDate)
			res.status(500).send({msg : 'nowDate > goalDate' });

		else {
			conn.query("INSERT INTO goal SET ? ", goalInfo, function (err, result) {
				if (err) {
					connection.release();
					res.status(500).send();
					return;
					console.log("err is " + err);
				}
				conn.query("UPDATE kids SET current_goal = ? WHERE pk_kids = ? ", [result.insertId, req.user.fk_kids], function (err, result) {
					if (err) {
						connection.release();
						res.status(500).send();
						return;
						console.log("err is " + err);
					}
					console.log(result);
				});
				res.status(200).send();
				connection.release();
			});
		}
	});
};

//UPDATE PUT
exports.update = function(req, res){
	console.log("PUT /goal is called");
	conn.getConnection(function(err,connection){
		if(err){
			console.error('MySQl connection err');
			console.log(err);
			connection.release();
			res.status(500).send();
			return;
		}
		//update the current cost of saving_list table
		var nowDate = new Date();
		var condition = "k.pk_kids = g.fk_kids AND k.current_goal = g.pk_goal AND " +
			"g.fk_kids = " + req.user.fk_kids;
		conn.query("SELECT g.now_cost, g.goal_cost FROM goal g, kids k WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
				res.status(500).send();
				return;
			}
			var data = rows[0];
			var nowCost = data["now_cost"];
			console.log(nowCost);
			var goalCost = data["goal_cost"];
			var insertCost = data["now_cost"];
			var calculateCost = parseInt(nowCost) + parseInt(insertCost);
			var lastCost;
			var state = 1;
			if(req.body.state)
            	state = req.body.state;

			//현재 저금한 총 금액 + 방금 저금한 금액 < 목표금액
			console.log(calculateCost + 'goal' + goalCost);
            //저금 중!!!
			if(calculateCost < goalCost) {
				lastCost = parseInt(calculateCost);
			}else if(calculateCost == goalCost) {
				lastCost = parseInt(calculateCost);
                state = 2; // goal성공
			}else if (calculateCost > goalCost) {
				lastCost = parseInt(goalCost);
                state = 2; // goal성공
			}
			//(now_cost, date, fk_kids) VALUES(?,?,?)   req.body.now_cost , nowDate, req.user.fk_kids
			var savingInfo = {
				'now_cost' : req.body.now_cost,
				'date' : nowDate,
				'fk_kids' : req.user.fk_kids
			};
			console.log(savingInfo);
			conn.query("UPDATE goal g INNER JOIN kids k ON g.pk_goal = k.current_goal AND g.fk_kids = k.pk_kids SET now_cost=?, state = ? ;INSERT INTO saving_list SET ? ",[lastCost,state,savingInfo], function(err, result){
				if(err){
					console.log('err is ' + err);
					connection.release();
					res.status(500).send();
					return;
				}
			});

			if(calculateCost < goalCost) {
				res.status(200).send();
				connection.release();
			}else if(calculateCost == goalCost) {
				res.status(500).send({msg : 'achieve goal_cost'});
				connection.release();
			}else if (calculateCost > goalCost) {
                res.status(500).send({msg : 'achieve goal_cost'});
				connection.release();
			}
		});
	});
};

//UPDATE PUT
exports.updateGaolState = function(req, res){
	console.log("PUT /goal is called");
	conn.getConnection(function(err,connection){
		if(err){
			console.error('MySQl connection err');
			console.log(err);
			connection.release();
			res.status(500).send();
			return;
		}
		conn.query("UPDATE goal g INNER JOIN kids k ON g.pk_goal = k.current_goal AND g.fk_kids = k.pk_kids SET state = ? ", req.body.state, function(err, result){
			if(err){
				console.log('err is ' + err);
				connection.release();
				res.status(500).send();
				return;
			}
			res.status(200).send();
			connection.release();
		});
	});
};

//READ GET /goal
exports.allGoal = function(req, res){
	console.log("GET /goal is called by kids");
	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQl connection err');
			connection.release();
			res.status(500).send();
			return;
		}
        var results = new Array();
		var condition = "fk_kids = " + req.user.fk_kids;
		conn.query("SELECT * FROM goal WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
				res.status(500).send();
				return;
			}
            for(var i in rows){
                var data = rows[i];
                var date = data["goal_date"].yyyymmdd();
                var time = data["goal_date"].hhmmss();
                data["goal_date"] = date +"T"+time;
                date = data["date"].yyyymmdd();
                time = data["date"].hhmmss();
                data["date"] = date +"T"+time;

                results.push(data);
            }

            res.status(200).json(results);
			connection.release();
		});
	});
};
exports.allGoalParents = function(req, res){
	console.log("GEt /goal:/fk_kids is called by parents");
	conn.getConnection(function(err, connection){
		if(err){
			console.log('MySQL connection err');
			console.log('err is ' + err);
			connection.release();
			res.status(500).send();
			return;
		}
        var results = new Array();
		var condition = "p.fk_parents = " + req.user.fk_parents + " AND " +
			"p.fk_kids = " + req.params.fk_kids + " AND " +
			"g.fk_kids = " + req.params.fk_kids;
		conn.query("SELECT g.* FROM goal g, parents_has_kids p WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
				res.status(500).send();
				return;
			}
            for(var i in rows){
                var data = rows[i];

                var date = data["goal_date"].yyyymmdd();
                var time = data["goal_date"].hhmmss();
                data["goal_date"] = date +"T"+time;
                date = data["date"].yyyymmdd();
                time = data["date"].hhmmss();
                data["date"] = date +"T"+time;

                results.push(data);
            }
			res.status(200).json(results);
			connection.release();
		});
	});
};
// current goal info get /goal/current - require kids
exports.currentGoal = function(req, res){
	console.log('GET /goal/current is called by kids');
	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQL connection err in cuurentGoal');
			connection.release();
			res.status(500).send();
			return;
		}
        var results = {};
		var condition = "k.pk_kids = g.fk_kids AND k.current_goal = g.pk_goal AND " +
			"g.fk_kids = " + req.user.fk_kids;
		conn.query("SELECT g.* FROM goal g, kids k WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
				res.status(500).send();
				return;
			}

            var data = rows[0];

            var date = data["goal_date"].yyyymmdd();
            var time = data["goal_date"].hhmmss();
            data["goal_date"] = date +"T"+time;
            date = data["date"].yyyymmdd();
            time = data["date"].hhmmss();
            data["date"] = date +"T"+time;

            results = data;

            res.status(200).json(results);
			connection.release();
		});
	});
};
// /goal/current/:fk_kids it all always use parents
exports.currentGoalParents = function(req, res){
	console.log('GET /goal/currents/:fk_kids is called by parents');
	conn.getConnection(function(err,connection){
		if(err){
			console.log('err' + err);
			console.error('MySQL connection err in cuurentGoal');
			connection.release();
			res.status(500).send();
			return;
		}
		var condition = "p.fk_parents = " + req.user.fk_parents + " AND " +
			"k.pk_kids = g.fk_kids AND k.current_goal = g.pk_goal "+ " AND " +
			"g.fk_kids = " + req.params.fk_kids;
        var results = {};
		conn.query("SELECT g.* FROM goal g, parents_has_kids p, kids k WHERE "+condition, function(err, rows){
			if(err){
				console.log('err is ' + err);
				connection.release();
				res.status(500).send();
				return;
			}
            var data = rows[0];

            var date = data["goal_date"].yyyymmdd();
            var time = data["goal_date"].hhmmss();
            data["goal_date"] = date +"T"+time;
            date = data["date"].yyyymmdd();
            time = data["date"].hhmmss();
            data["date"] = date +"T"+time;

            results = data;

			res.status(200).json(results);
			connection.release();
		});
	});
};

//DELETE REMOVE
exports.remove = function(req, res){
	console.log("DELETE /goal is called");
	conn.getConnection(function(err,connection){
		if(err){
			console.error('MySQl connection err');
			console.log(err);
			connection.release();
			res.status(500).send();
			return;
		}
		console.log(req.param('pk_goal'));
		conn.query('delete from goal where pk_goal = ?',[req.user.pk_goal], function(err,rows){
			if(err){
				connection.release();
				console.log(err);
				res.status(500).send();
				return;
			}
			res.status(200);
			connection.release();
		});
	});
};


Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy +'-'+ (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0]); // padding
};
Date.prototype.hhmmss = function()
{
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();

    return (hh[1] ? hh : '0'+hh[0]) + ':' +
        (mm[1] ? mm : '0'+mm[0]) + ':' +
        (ss[1] ? ss : '0'+ss[0]);
};