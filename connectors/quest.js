var conn = require('./db.js');
var server_key = require('./gcm.js');
var gcm = require('node-gcm');

//CREATE CREATE post /quest
exports.createParents = function(req, res){
	console.log("POST /quest is called by parents");
	conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
        }
        var questInfo = {
            'content': req.body.content,
            'point': req.body.point,
            'startTime': req.body.startTime
        };

        console.log(req.params.fk_kids);
        var condition = "fk_kids = " + req.params.fk_kids;
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
    console.log("PUT /goal is called by parents");
    conn.getConnection(function(err,connection){
    if(err){
    console.error('MySQl connection err');
    }
    var pk_parents_quest = req.params.pk_parents_quest;
    var Query = conn.query("UPDATE std_que SET point = ?, content =? WHERE pk_parents_quest = ?",[req.body.point, req.body.content,pk_parents_quest], function(err, result){
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
	console.log("DELETE /goal is called by admin");
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
}

//DELETE REMOVE
exports.removeParentsQuest = function(req, res){
    console.log("DELETE /goal is called by admin");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
        }
        var pk_parents_quest = req.params.pk_parents_quest;
        var Query = conn.query("DELETE FROM std_que WHERE pk_parents_quest =? ",pk_parents_quest, function(err,rows){
            if(err){
                connection.release();
                console.log(err);
            }
            console.log();
            res.status(200).send;
            connection.release();
        });
    });
}
