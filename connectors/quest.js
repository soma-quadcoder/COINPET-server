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
            'que_num' : req.body.que_num,
            'point' : req.body.point,
            'state' : req.body.state,
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
}





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
}
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
}

//UPDATE PUT
exports.updateStdQuest = function(req, res){
	console.log("PUT /quest/admin/:pk_std_que is called by admin");
	conn.getConnection(function(err,connection){
	if(err) {
        console.error('MySQl connection err');
    }
    var pk_std_que = req.params.pk_std_que;
	var Query = conn.query("UPDATE std_que SET point = ?, content =? WHERE pk_std_que = ?",[req.body.point, req.body.content,pk_std_que], function(err, result){
		if(err){
			console.log('err is ' + err);
			connection.release();
		}
		res.status(200).send();
		connection.release();
		});
	});
}

//UPDATE PUT
exports.updateParentsQuest = function(req, res){
    console.log("PUT /quest/parents/:pk_parents_quest is called by parents");
    conn.getConnection(function(err,connection){
    if(err){
    console.error('MySQl connection err');
    }
    var pk_parents_quest = req.params.pk_parents_quest;
    var Query = conn.query("UPDATE parents_quest SET point = ?, content =?, startTime = ? WHERE pk_parents_quest = ?",[req.body.point, req.body.content,req.body.startTime,pk_parents_quest], function(err, result){
        if(err){
           console.log('err is ' + err);
            connection.release();
        }
        res.status(200).send();
        connection.release();
        });
    });
}


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
		    console.log();
		    res.status(200).send();
		    connection.release();
		});
	});
}

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
}
