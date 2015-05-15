var conn = require('./db.js');


//CREATE CREATE post /quest
exports.createQuiz = function(req, res){
    console.log("POST /quiz is called");
    conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
        }
        var quizInfo = {
            'point' : req.body.point,
            'content' : req.body.content,
            'state' : req.body.state,
            'fk_std_quiz' : req.body.fk_std_quiz,
            'fk_kids' : req.user.fk_kids
        };

        var Query = conn.query('INSERT INTO quiz SET ?', quizInfo, function (err, result) {
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
exports.createStdQuiz = function(req, res){
	console.log("POST /quiz/admin is called");
	conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
        }
        var quizInfo = {
            'point' : req.body.point,
            'content' : req.body.content
        };

        var Query = conn.query('INSERT INTO std_quiz SET ?', quizInfo, function (err, result) {
            if (err) {
                connection.release();
                console.log("err is " + err);
            }
            res.status(200).send();
            connection.release();
        });
    });
}
//UPDATE PUT
exports.updateQuiz = function(req, res){
    console.log("PUT /quiz/admin/:pk_std_quiz is called");
    conn.getConnection(function(err,connection){
    if(err){
    console.error('MySQl connection err');
    }
    var pk_std_quiz = req.params.pk_std_quiz;
    var Query = conn.query("UPDATE std_quiz SET point = ?, content =? WHERE pk_std_quiz = ?",[req.body.point, req.body.content,pk_std_quiz], function(err, result){
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
exports.removeStdQuiz = function(req, res){
    console.log("DELETE /quiz/admin/:pk_std_quiz is called");
	conn.getConnection(function(err,connection){
    	if(err){
	    	console.error('MySQl connection err');
	    }
        var pk_std_quiz = req.params.pk_std_quiz;

        var Query = conn.query("DELETE FROM std_quiz WHERE pk_std_quiz =? ", pk_std_quiz , function(err,rows){
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

