var gcm = require('node-gcm');
var conn = require('./db.js');



exports.pushQuestQuiz = function(req, res){
    console.log('GET / is called');

    conn.getConnection(function(err, connection){
        if(err)
            console.error('MySAL connection err in /regist');

        var quizVers = req.body.pk_std_quiz;
        var questPVer = req.body.pk_parents_quest;
        var questSVer = req.body.pk_std_que;
        var fk_kids = req.user.fk_kids;


        var Query = conn.query("SELECT MAX(pk_std_quiz) FROM std_quiz ; SELECT MAX(pk_parents_quest) FROM parents_quest WHERE fk_kids = ?  ; SELECT MAX(pk_std_que) FROM std_que", fk_kids, function(err, rows){
            if(err){
                console.log('err is' + err);
                connection.release();
            }
            //[{'MAX(pk_std_quiz)' : ?} , {'MAX(pk_parents_quest)' : ? }, {'MAX(pk_std_que)' : ? } ]
            //var pk_std_quiz = JSON.stringify(rows);
            var pk_std_quiz = JSON.stringify(rows[0]); // pk_std_quiz change string
            console.log(pk_std_quiz);
            console.log(pk_std_quiz[1]);
            var pk_std = pk_std_quiz.split(":")[1];
            console.log(pk_std);
            var pk_std_ = pk_std.split("}")[0];
            console.log(pk_std_);
            //pk_std_quiz = pk_std_quiz.split(":");
            //pk_std_quiz = pk_std_quiz.split("}");
            console.log(pk_std_quiz);
            console.log(rows);
            res.status(200).send(rows);
            connection.release();
        });
    });
};



exports.regist = function(req, res){
	console.log('POST /regist is called');
	conn.getConnection(function(err, connection){
		if(err)
			console.error('MySAL connection err in /regist');

		var registration_id = req.body.regist_id;
		var user_id = req.body.user_id;
		console.log(registration_id + '\r\n'+ user_id);
		var my_fk_kids = 145;
		var pushInfo = {
			'regist_id' : req.body.regist_id,
			'fk_kids' : my_fk_kids
		};
		var Query = conn.query("INSERT INTO push SET ?", pushInfo, function(err, result){
			if(err){
				console.log('err is' + err);
				connection.release();
			}
			console.log(result);
			res.status(200).json();
			connection.release();
		});
	});
};
