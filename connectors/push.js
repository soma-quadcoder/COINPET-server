var gcm = require('node-gcm');
var conn = require('./db.js');
//var waterfall = require('async-waterfall');
var async = require('async');


exports.pushInfo = function(req, res){
    console.log('GET /getInfoStdQuest/:pk_std_que is called');

    conn.getConnection(function(err, connection){
        if(err)
            console.error('MySAL connection err');

        var quizVers = req.params.pk_std_quiz;
        var questPVer = req.params.pk_parents_quest;
        var questSVer = req.params.pk_std_que;
        var fk_kids = req.user.fk_kids;
        var pk_std_quiz;
        var pk_parents_quest;
        var pk_std_que;

        async.waterfall(
            [
            function(callback){
                var Query = conn.query("SELECT MAX(pk_std_quiz) FROM std_quiz ; SELECT MAX(pk_parents_quest) FROM parents_quest WHERE fk_kids = ?  ; SELECT MAX(pk_std_que) FROM std_que", fk_kids, function (err, rows) {
                    if (err) {
                            console.log('err is' + err);
                            connection.release();
                        }
                    //[{'MAX(pk_std_quiz)' : ?} , {'MAX(pk_parents_quest)' : ? }, {'MAX(pk_std_que)' : ? } ]
                    //split
                    pk_std_quiz = JSON.stringify(rows[0]); // pk_std_quiz change string
                    pk_std_quiz = pk_std_quiz.split(":")[1];
                    pk_std_quiz = pk_std_quiz.split("}")[0];
                    console.log(pk_std_quiz);

                    pk_parents_quest = JSON.stringify(rows[1]);
                    pk_parents_quest = pk_parents_quest.split(":")[1];
                    pk_parents_quest = pk_parents_quest.split("}")[0];

                    pk_std_que = JSON.stringify(rows[2]);
                    pk_std_que = pk_std_que.split(":")[1];
                    pk_std_que = pk_std_que.split("}")[0];
                    callback(null);
                });
            },
            function(callback) {
                if (pk_std_quiz > quizVers) {
                    var Query = conn.query("SELECT * FROM std_quiz WHERE ( pk_std_quiz > ? )  ", quizVers, function (err, rows) {
                        if (err) {
                            console.log('err is ' + err);
                            connection.release();
                        }
                        var arg1 = JSON.stringify(rows);
                        callback(null, arg1);
                    });
                }
                else
                    callback(null, 'The lastet version of the system quiz');
            },
            function(arg1, callback) {
                var Query = conn.query("SELECT * FROM std_quiz WHERE pk_std_quiz = ? ", 7 , function (err, rows) {
                    if (err) {
                        console.log('err is ' + err);
                        connection.release();
                    }

                    var arg2 = arg1 +'\r\narg2\r\n ' + JSON.stringify(rows);
                    callback(null, arg2);
                    });
            }
            ],function(err, results) {
                console.log('end');
                console.log(results);
                res.status(200).send(results);
                connection.release();
            });
/*
        if(quizVers == null || questPVer == null || questSVer == null)
            res.json('error parameters');
        else {
            var Query = conn.query("SELECT MAX(pk_std_quiz) FROM std_quiz ; SELECT MAX(pk_parents_quest) FROM parents_quest WHERE fk_kids = ?  ; SELECT MAX(pk_std_que) FROM std_que", fk_kids, function (err, rows) {
                if (err) {
                    console.log('err is' + err);
                    connection.release();
                }
                //[{'MAX(pk_std_quiz)' : ?} , {'MAX(pk_parents_quest)' : ? }, {'MAX(pk_std_que)' : ? } ]
                //split
                var pk_std_quiz = JSON.stringify(rows[0]); // pk_std_quiz change string
                pk_std_quiz = pk_std_quiz.split(":")[1];
                pk_std_quiz = pk_std_quiz.split("}")[0];

                var pk_parents_quest = JSON.stringify(rows[1]);
                pk_parents_quest = pk_parents_quest.split(":")[1];
                pk_parents_quest = pk_parents_quest.split("}")[0];

                var pk_std_que = JSON.stringify(rows[2]);
                pk_std_que = pk_std_que.split(":")[1];
                pk_std_que = pk_std_que.split("}")[0];

                console.log(pk_std_quiz + pk_parents_quest + pk_std_que);

                if (pk_std_quiz > quizVers) {
                    // Need update
                    Query = conn.query("SELECT * FROM std_quiz WHERE pk_std_quiz = ? ", quizVers, function(err, rows){
                        if(err){
                            console.log('err is ' + err);
                            connection.release();
                        }
                        res.status(200).send(rows);
                        connection.release();
                    });
                    console.log('update quiz');
                }
                //else res.json("The lastet version of the system quiz");

                if (pk_parents_quest > questPVer) {
                    //Need parents quest update
                    console.log('update parents quest');
                }
                //else res.json("The latest version of the parents quest.");

                if (pk_std_que > questSVer) {
                    //Need system quest update
                    console.log('update system quest');
                }
                //else res.json("The latest version of the system quest.");

                //res.status(200).send(rows);
                connection.release();
            });
        }*/
    });
};

exports.pushStdQuest = function(req, res){
    console.log('GET /getInfoStdQuest/:pk_std_que is called');

    conn.getConnection(function(err, connection){
        if(err)
            console.error('MySAL connection err in /regist');
/*
        var quizVers = req.body.pk_std_quiz;
        var questPVer = req.body.pk_parents_quest;
        var questSVer = req.body.pk_std_que;
        var fk_kids = req.user.fk_kids;

        */
        var quizVers = req.params.pk_std_quiz;
        var questPVer = req.params.pk_parents_quest;
        var questSVer = req.params.pk_std_que;
        var fk_kids = req.user.fk_kids;
        if(quizVers == null || questPVer == null || questSVer == null)
            res.json('error parameters');
        else {
            var Query = conn.query("SELECT MAX(pk_std_quiz) FROM std_quiz ; SELECT MAX(pk_parents_quest) FROM parents_quest WHERE fk_kids = ?  ; SELECT MAX(pk_std_que) FROM std_que", fk_kids, function (err, rows) {
                if (err) {
                    console.log('err is' + err);
                    connection.release();
                }
                //[{'MAX(pk_std_quiz)' : ?} , {'MAX(pk_parents_quest)' : ? }, {'MAX(pk_std_que)' : ? } ]
                //split
                var pk_std_quiz = JSON.stringify(rows[0]); // pk_std_quiz change string
                pk_std_quiz = pk_std_quiz.split(":")[1];
                pk_std_quiz = pk_std_quiz.split("}")[0];

                var pk_parents_quest = JSON.stringify(rows[1]);
                pk_parents_quest = pk_parents_quest.split(":")[1];
                pk_parents_quest = pk_parents_quest.split("}")[0];

                var pk_std_que = JSON.stringify(rows[2]);
                pk_std_que = pk_std_que.split(":")[1];
                pk_std_que = pk_std_que.split("}")[0];

                console.log(pk_std_quiz + pk_parents_quest + pk_std_que);

                if (pk_std_quiz > quizVers) {
                    // Need update
                    Query = conn.query("SELECT * FROM std_quiz WHERE pk_std_quiz = ? ", quizVers, function(err, rows){
                        if(err){
                            console.log('err is ' + err);
                            connection.release();
                        }
                        res.status(200).send(rows);
                        connection.release();
                    });
                    console.log('update quiz');
                }
                //else res.json("The lastet version of the system quiz");

                if (pk_parents_quest > questPVer) {
                    //Need parents quest update
                    console.log('update parents quest');
                }
                //else res.json("The latest version of the parents quest.");

                if (pk_std_que > questSVer) {
                    //Need system quest update
                    console.log('update system quest');
                }
                //else res.json("The latest version of the system quest.");

                //res.status(200).send(rows);
                connection.release();
            });
        }
    });
};

exports.pushStdQuiz = function(req, res){
    console.log('GET /getInfoStdQuest/:pk_std_que is called');

    conn.getConnection(function(err, connection){
        if(err)
            console.error('MySAL connection err in /regist');
        /*
         var quizVers = req.body.pk_std_quiz;
         var questPVer = req.body.pk_parents_quest;
         var questSVer = req.body.pk_std_que;
         var fk_kids = req.user.fk_kids;

         */
        var quizVers = req.params.pk_std_quiz;

        if(quizVers == null) {
            res.json('error parameters');
            connection.release();
        }
        else {
            var Query = conn.query("SELECT MAX(pk_std_quiz) FROM std_quiz",function (err, rows) {
                if (err) {
                    console.log('err is' + err);
                    connection.release();
                }
                //[{'MAX(pk_std_quiz)' : ?} , {'MAX(pk_parents_quest)' : ? }, {'MAX(pk_std_que)' : ? } ]
                //split
                var pk_std_quiz = JSON.stringify(rows[0]); // pk_std_quiz change string
                pk_std_quiz = pk_std_quiz.split(":")[1];
                pk_std_quiz = pk_std_quiz.split("}")[0];

                console.log(pk_std_quiz);

                if (pk_std_quiz > quizVers) {
                    // Need update
                    Query = conn.query("SELECT * FROM std_quiz WHERE pk_std_quiz = ? ", quizVers, function(err, rows){
                        if(err){
                            console.log('err is ' + err);
                            connection.release();
                        }
                        res.status(200).send(rows);
                        connection.release();
                    });
                    console.log('update quiz');
                }
                //res.status(200).send(rows);
                connection.release();
            });
        }
    });
}

exports.pushParentsQuest = function(req, res){
    console.log('GET /getInfoStdQuest/:pk_std_que is called');

    conn.getConnection(function(err, connection){
        if(err)
            console.error('MySAL connection err in /regist');
        /*
         var quizVers = req.body.pk_std_quiz;
         var questPVer = req.body.pk_parents_quest;
         var questSVer = req.body.pk_std_que;
         var fk_kids = req.user.fk_kids;

         */
        var quizVers = req.params.pk_std_quiz;
        var questPVer = req.params.pk_parents_quest;
        var questSVer = req.params.pk_std_que;
        var fk_kids = req.user.fk_kids;
        if(quizVers == null || questPVer == null || questSVer == null)
            res.json('error parameters');
        else {
            var Query = conn.query("SELECT MAX(pk_std_quiz) FROM std_quiz ; SELECT MAX(pk_parents_quest) FROM parents_quest WHERE fk_kids = ?  ; SELECT MAX(pk_std_que) FROM std_que", fk_kids, function (err, rows) {
                if (err) {
                    console.log('err is' + err);
                    connection.release();
                }
                //[{'MAX(pk_std_quiz)' : ?} , {'MAX(pk_parents_quest)' : ? }, {'MAX(pk_std_que)' : ? } ]
                //split
                var pk_std_quiz = JSON.stringify(rows[0]); // pk_std_quiz change string
                pk_std_quiz = pk_std_quiz.split(":")[1];
                pk_std_quiz = pk_std_quiz.split("}")[0];

                var pk_parents_quest = JSON.stringify(rows[1]);
                pk_parents_quest = pk_parents_quest.split(":")[1];
                pk_parents_quest = pk_parents_quest.split("}")[0];

                var pk_std_que = JSON.stringify(rows[2]);
                pk_std_que = pk_std_que.split(":")[1];
                pk_std_que = pk_std_que.split("}")[0];

                console.log(pk_std_quiz + pk_parents_quest + pk_std_que);

                if (pk_std_quiz > quizVers) {
                    // Need update
                    Query = conn.query("SELECT * FROM std_quiz WHERE pk_std_quiz = ? ", quizVers, function(err, rows){
                        if(err){
                            console.log('err is ' + err);
                            connection.release();
                        }
                        res.status(200).send(rows);
                        connection.release();
                    });
                    console.log('update quiz');
                }
                //else res.json("The lastet version of the system quiz");

                if (pk_parents_quest > questPVer) {
                    //Need parents quest update
                    console.log('update parents quest');
                }
                //else res.json("The latest version of the parents quest.");

                if (pk_std_que > questSVer) {
                    //Need system quest update
                    console.log('update system quest');
                }
                //else res.json("The latest version of the system quest.");

                //res.status(200).send(rows);
                connection.release();
            });
        }
    });
}


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
