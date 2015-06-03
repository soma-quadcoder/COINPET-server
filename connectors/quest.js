var conn = require('./db.js');

//CREATE CREATE post /quest
exports.createNowQuest = function(req, res){
    console.log("POST /quest is called by parents");
    conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }
        var questInfo = {
            'state' : req.body.state,
            'fk_std_que' : req.body.fk_std_que,
            'fk_kids' : req.user.fk_kids
        };

        conn.query('INSERT INTO quest SET ?', questInfo, function (err, result) {
            if (err) {
                connection.release();
                console.log("err is " + err);
                res.status(500).send();
                return;
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
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }
        var fk_kids = req.user.fk_kids;

        var condition = "state = " + req.body.state +
                        "fk_std_que = " + req.body.fk_std_que +
                         " WHERE fk_kids = " + fk_kids;

        conn.query("UPDATE quest SET "+condition, function(err, result){
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

//CREATE CREATE post /quest
exports.createParents = function(req, res){
	console.log("POST /quest/parents is called by parents");
	conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }
        //'%Y/%m/%d %h:%i:%s'
        var nowDate = new Date();
        var startDate = new Date(req.body.startTime);
        var getTime = new Date("2015-06-01");
        var questInfo = {
            'content': req.body.content,
            'point': req.body.point,
            'startTime': startDate,
            'state' : req.body.state,
            'modifyTime' : nowDate,
            'getTime' : getTime,
            'type' : req.body.type,
            'comment' : req.body.comment,
            'fk_kids' : req.params.fk_kids
        };

        conn.query('INSERT INTO parents_quest SET ?', questInfo, function (err, result) {
            if (err) {
                connection.release();
                console.log("err is " + err);
                res.status(500).send();
                return;
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
            connection.release();
            res.status(500).send();
            return;
        }
        var questInfo = {
            'content' : req.body.content,
            'point' : req.body.point,
            'type' : req.body.type
        };

        conn.query('INSERT INTO std_que SET ?', questInfo  ,function(err, result){
            if(err){
                connection.release();
                console.log("err is " + err);
                res.status(500).send();
                return;
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
        console.log(err);
        connection.release();
        res.status(500).send();
        return;
    }
    var pk_std_que = req.params.pk_std_que;
    /*var condition = "point = " + req.body.point +
                    " , content = " + req.body.content +
                    " WHERE pk_std_que = " + pk_std_que;*/
        conn.query("UPDATE std_que SET point = ?, content = ?, type = ? WHERE pk_std_que = ? ",[req.body.point,req.body.content,req.body.type,pk_std_que], function(err, result){
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

//UPDATE parents quest
exports.updateParentsQuest = function(req, res){
    console.log("PUT /quest/parents/:pk_parents_quest is called by parents and kids");
    conn.getConnection(function(err,connection){
    if(err){
        console.error('MySQl connection err');
        console.log(err);
        connection.release();
        res.status(500).send();
        return;
    }
    var nowDate = new Date();
    var startTime = new Date(req.body.startTime);
    //var pk_parents_quest = req.params.pk_parents_quest;
    /*var condition = "point =  " + req.body.point +
                    ",content = " + req.body.content +
                    ",startTime = " + startTime +
                    ",modifyTime = " + nowDate +
                    ",state = " + req.body.state +
                    "WHERE pk_parents_quest = " + pk_parents_quest;*/

    conn.query("UPDATE parents_quest SET point = ? , content = ? , startTime = ? , modifyTime = ?, state = ?, type = ?, comment = ? WHERE pk_parents_quest = ?",[req.body.point, req.body.content,startTime,nowDate,req.body.state,req.body.type, req.body.comment,req.body.fk_parents_quest], function(err, result){
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

//UPDATE quest state retry and done
//사용 안할듯요
exports.updateQuestState = function(req, res){
    console.log("PUT /quest/stateUpdate/:fk_kids is called by parents");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }
        /*var condition = "state = " + req.body.state +
                        " WHERE fk_kids = " + req.params.fk_kids + " AND " +
                        "fk_parents_quest = " + req.body.fk_parents_quest;*/
        conn.query("UPDATE parents_quest SET state = ? WHERE fk_kids = ? AND pk_parents_quest = ?",[req.body.state, req.params.fk_kids, req.body.fk_parents_quest ], function(err, result){
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

//DELETE REMOVE
exports.removeStdQuest = function(req, res){
	console.log("DELETE /quest/admin/:pk_std_que is called by admin");
	conn.getConnection(function(err,connection){
    	if(err){
	    	console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
	    }
        var pk_std_que = req.params.pk_std_que;

        conn.query("DELETE FROM std_que WHERE pk_std_que =? ", pk_std_que, function(err,rows){
		    if(err){
			    connection.release();
			    console.log(err);
                res.status(500).send();
                return;
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
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }
        var condition = "state = " + req.body.state + " WHERE " +
                        "pk_parents_quest = " + req.params.pk_parents_quest;
        conn.query("UPDATE parents_quest SET " +condition, function(err, result){
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
