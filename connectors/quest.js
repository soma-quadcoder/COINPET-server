var conn = require('./db.js');

//CREATE CREATE post /quest
exports.createNowQuest = function(req, res){
    console.log("POST /quest is called by parents");
    conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
        }
        var questInfo = {
            'type' : req.body.type,
            'fk_std_que' : req.body.fk_std_que,
            'fk_parents_quest' : req.body.fk_parents_quest,
            'fk_kids' : req.user.fk_kids
        };

        var Query = conn.query('INSERT INTO quest SET ?', questInfo, function (err, result) {
            if (err) {
                connection.release();
                console.log("err is " + err);
            }
            res.status(200).send();
            connection.release();
        });
    });
};

/*
* 퀘스트 상태를 업데이틑 하는 부분
*  req.body.state == 3 && req.body.tyep == 2 인 경우 퀘스트 검사받기 버튼을 누른경우
 */
exports.updateQuestKids = function(req, res){
    console.log("PUT /quest is called by kids");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
        }
        var fk_kids = req.user.fk_kids;

        var condition = "state = " + req.body.state +
            " , type = " + req.body.type +
            " WHERE fk_kids = " + fk_kids;

        var Query = conn.query("UPDATE quest SET "+condition, function(err, result){
            if(err){
                console.log('err is ' + err);
                connection.release();
            }
            res.status(200).send();
            connection.release();
        });
    });
};

//CREATE CREATE post /quest
exports.createParents = function(req, res){
	console.log("POST /quest/parents is called by parents");
	conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
        }
        var questInfo = {
            'content': req.body.content,
            'point': req.body.point,
            'startTime': req.body.startTime,
            'fk_kids' : req.params.fk_kids
        };

        var Query = conn.query('INSERT INTO parents_quest SET ?', questInfo, function (err, result) {
            if (err) {
                connection.release();
                console.log("err is " + err);
            }
            res.status(200).send();
            connection.release();
        });
    });
};
//CREATE CREATE post /quest
exports.createAdmin = function(req, res){
    console.log("POST /quest/admin is called by admin");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
        }
        var questInfo = {
            'content' : req.body.content,
            'point' : req.body.point
        };

        var Query =  conn.query('INSERT INTO std_que SET ?', questInfo  ,function(err, result){
            if(err){
                connection.release();
                console.log("err is " + err);
            }
        });
        res.status(200).send();
        connection.release();
    });
};

//UPDATE system quest
exports.updateStdQuest = function(req, res){
	console.log("PUT /quest/admin/:pk_std_que is called by admin");
	conn.getConnection(function(err,connection){
	if(err) {
        console.error('MySQl connection err');
    }
    var pk_std_que = req.params.pk_std_que;
    var condition = "point = " + req.body.point +
                    " , content = " + req.body.content +
                    " WHERE pk_std_que = " + pk_std_que;
        var Query = conn.query("UPDATE std_que SET "+condition, function(err, result){
		if(err){
			console.log('err is ' + err);
			connection.release();
		}
		res.status(200).send();
		connection.release();
		});
	});
};

//UPDATE parents quest
exports.updateParentsQuest = function(req, res){
    console.log("PUT /quest/parents/:pk_parents_quest is called by parents");
    conn.getConnection(function(err,connection){
    if(err){
    console.error('MySQl connection err');
    }
    var pk_parents_quest = req.params.pk_parents_quest;
    var condition = "point = " + req.body.point +
                    " , content = " + req.body.content +
                    " , startTime = " + req.body.startTime +
                    " WHERE pk_parents_quest = " + pk_parents_quest;

    var Query = conn.query("UPDATE parents_quest SET "+condition, function(err, result){
        if(err){
           console.log('err is ' + err);
            connection.release();
        }
        res.status(200).send();
        connection.release();
        });
    });
};

//UPDATE quest state retry and done
exports.updateQuestState = function(req, res){
    console.log("PUT /quest/stateUpdate/:fk_kids is called by parents");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
        }
        var condition = "state = " + req.body.state +
                        "WHERE fk_kids = " + req.params.fk_kids + " AND " +
                        "fk_parents_quest = " + req.body.fk_parents_quest;
        var Query = conn.query("UPDATE quest SET "+condition, function(err, result){
            if(err){
                console.log('err is ' + err);
                connection.release();
            }
            res.status(200).send();
            connection.release();
        });
    });
};

//DELETE REMOVE
exports.removeStdQuest = function(req, res){
	console.log("DELETE /quest/admin/:pk_std_que is called by admin");
	conn.getConnection(function(err,connection){
    	if(err){
	    	console.error('MySQl connection err');
	    }
        var pk_std_que = req.params.pk_std_que;

        var Query = conn.query("DELETE FROM std_que WHERE pk_std_que =? ", pk_std_que, function(err,rows){
		    if(err){
			    connection.release();
			    console.log(err);
		    }
		    res.status(200).send();
		    connection.release();
		});
	});
};

//DELETE REMOVE
exports.removeParentsQuest = function(req, res){
    console.log("DELETE /quest/parents/:pk_parents_quest is called by parents");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
        }
        var pk_parents_quest = req.params.pk_parents_quest;
        var Query = conn.query("DELETE FROM parents_quest WHERE pk_parents_quest = ? ",pk_parents_quest, function(err,rows){
            if(err){
                connection.release();
                console.log(err);
            }
            console.log();
            res.status(200).send();
            connection.release();
        });
    });
};
