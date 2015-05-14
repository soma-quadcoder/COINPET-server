var conn = require('./db.js');
var server_key = require('./gcm.js');
var gcm = require('node-gcm');
<<<<<<< HEAD

=======
var split = require('split');
var stringify = require('node-stringify');
>>>>>>> f2c8d13689126fefccef515b873667f8d02ef2ae
//CREATE CREATE post /quest
exports.createParents = function(req, res){
	console.log("POST /quest is called by parents");
	conn.getConnection(function(err,connection){
		if(err){
			console.error('MySQl connection err');
			console.log(err);
		}
		var questInfo = {
			'content' : req.body.content,
			'point' : req.body.point,
            'startTime' : req.body.startTime,
			'fk_parents' : req.user.fk_parents
		};

		console.log(req.params.fk_kids);
		var condition = "fk_kids = "+ req.params.fk_kids;
		var Query =  conn.query('INSERT INTO parents_quest SET ?', questInfo  ,function(err, result){
			if(err){
				connection.release();
				console.log("err is " + err);
			}
<<<<<<< HEAD
=======
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
                        key1 : req.body.content,
            			key1 : req.body.point
                    }
                });

                var sender = new gcm.Sender(server_key);
                console.log(server_key);
                var registrationIds = [];
				//regist_id 추출하는 부분.
               	var str = rows[0]; var strString = JSON.stringify(str);
                var strSplit = strString.split(':"')[1];
                var strSplit2 = strSplit.split('"')[0];
                var registration_id = strSplit2;
               	//console.log(registration_id[0] );
                //At least one required
                registrationIds.push(registration_id);
                /**
                 * Params : message-literal, registrationIds-array, No. of retries, callback-function
                 **/
                sender.send(message, registrationIds, 4, function(err, result){
                    if(err) console.error('error is' +err);
                    else console.log(result);
                });
>>>>>>> f2c8d13689126fefccef515b873667f8d02ef2ae
			});
			res.status(200).send();
			connection.release();
		});
}
//CREATE CREATE post /quest
exports.createAdmin = function(req, res){
    console.log("POST /quest is called by admin");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
        }
        var questInfo = {
            'content' : req.body.content,
            'point' : req.body.point
        };

        console.log(req.params.fk_kids);
        var condition = "fk_kids = "+ req.params.fk_kids;
        var Query =  conn.query('INSERT INTO std_que SET ?', questInfo  ,function(err, result){
            if(err){
                connection.release();
                console.log("err is " + err);
            }
        });
        res.status(200).send();
        connection.release();
    });
}

//UPDATE PUT
exports.updateStdQuest = function(req, res){
	console.log("PUT /goal is called by admin");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
	}
	var nowDate = new Date();

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

//UPDATE PUT
exports.updateParentsQuest = function(req, res){
    console.log("PUT /goal is called by parents");
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
exports.removeStdQuest = function(req, res){
	console.log("DELETE /goal is called by admin");
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

//DELETE REMOVE
exports.removeParentsQuest = function(req, res){
    console.log("DELETE /goal is called by parents");
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
