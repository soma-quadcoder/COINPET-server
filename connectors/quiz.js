var conn = require('./db.js');


//CREATE CREATE post /quest
exports.createNowQuiz = function(req, res){
    console.log("POST /quiz is called by app");
    conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
            res.status(500).send();
            return;
        }
        var quizInfo = {
            'state' : req.body.state,
            'fk_std_quiz' : req.body.fk_std_quiz,
            'fk_kids' : req.user.fk_kids
        };

        conn.query('INSERT INTO quiz SET ?', quizInfo, function (err, result) {
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
exports.createStdQuiz = function(req, res){
	console.log("POST /quiz/admin is called");
	conn.getConnection(function(err,connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }
        var quizInfo = {
            'point' : req.body.point,
            'content' : req.body.content,
            'hint' : req.body.hint,
            'time' : req.body.time,
            'level' : req.body.level,
            'solution' : req.body.solution,
            'answer' : req.body.answer
        };

        conn.query('INSERT INTO std_quiz SET ?', quizInfo, function (err, result) {
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
//UPDATE PUT //quiz에 등록되어있는경우 삭제안됨.
exports.updateQuiz = function(req, res){
    console.log("PUT /quiz/admin/:pk_std_quiz is called");
    conn.getConnection(function(err,connection){
    if(err){
        console.error('MySQl connection err');
        console.log(err);
        connection.release();
        res.status(500).send();
        return;
    }
    var pk_std_quiz = req.params.pk_std_quiz;
    conn.query("UPDATE std_quiz SET point = ? , content = ?, hint = ?, time = ?, level = ?, solution = ?, answer = ? WHERE pk_std_quiz = ? ",[req.body.point,req.body.content,req.body.hint, req.body.time, req.body.level,req.body.solution, req.body.answer,pk_std_quiz], function(err, result){
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
exports.removeStdQuiz = function(req, res){
    console.log("DELETE /quiz/admin/:pk_std_quiz is called");
	conn.getConnection(function(err,connection){
    	if(err){
	    	console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
	    }
        var pk_std_quiz = req.params.pk_std_quiz;

        conn.query("DELETE FROM std_quiz WHERE pk_std_quiz = ? ", pk_std_quiz , function(err,rows){
		    if(err){
                console.log('MySQL err' + err);
                connection.release();
                res.status(500).send();
                return;
		    }
		    console.log();
		    res.status(200).send();
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