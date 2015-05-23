var gcm = require('node-gcm');
var conn = require('./db.js');
var async = require('async');

//GET getInfo/:pk_std_que/:pk_parents_quest/:pk_std_quiz
exports.pushQeustAndQuizInfoToApp = function(req, res){
    console.log('GET /getInfoStdQuest/:pk_std_que is called');

    conn.getConnection(function(err, connection){
        if(err)
            console.error('MySAL connection err');

        var quizVers = req.params.pk_std_quiz;
        var questPVer = req.params.pk_parents_quest;
        var questSVer = req.params.pk_std_que;
        var fk_kids = req.user.fk_kids;
        console.log
        var pk_std_quiz;
        var pk_parents_quest;
        var pk_std_que;
        var results = {
            needUpate : '',
            systemQuiz : '',
            systemQuest : '',
            parentsQuest: ''
        };


        async.waterfall(
            [
                function(callback){
                    conn.query("SELECT MAX(pk_std_quiz) FROM std_quiz ; SELECT MAX(pk_parents_quest) FROM parents_quest WHERE fk_kids = ?  ; SELECT MAX(pk_std_que) FROM std_que", fk_kids, function (err, rows) {
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
                        console.log(pk_parents_quest);
                        pk_std_que = JSON.stringify(rows[2]);
                        pk_std_que = pk_std_que.split(":")[1];
                        pk_std_que = pk_std_que.split("}")[0];
                        console.log(pk_std_que);
                        if(pk_std_quiz > quizVers | pk_std_que > questSVer | pk_parents_quest > questPVer )
                        {
                            results.needUpate = 1;
                            callback(null, results);
                        }
                        else
                        {
                            results.needUpate = 0;
                            callback(null, results);
                        }
                    });
                },
                function(arg ,callback) {
                    //system Quiz check and update
                    if (pk_std_quiz > quizVers) {
                        conn.query("SELECT * FROM std_quiz WHERE ( pk_std_quiz > ? )  ", quizVers, function (err, rows) {
                            if (err) {
                                console.log('err is ' + err);
                                connection.release();
                            }
                            //systemQuiz.(JSON.stringify(rows));
                            results.systemQuiz = rows;
                            callback(null, results);
                        });
                    }
                    else {
                        results.systemQuiz = 'The lastet version of the system quiz';
                        callback(null, results);
                    }
                },
                function(arg1, callback) {
                    //System quest check and update
                    if (pk_std_que > questSVer) {
                        conn.query("SELECT * FROM std_que WHERE ( pk_std_que > ? )  ", questSVer, function (err, rows) {
                            if (err) {
                                console.log('err is ' + err);
                                connection.release();
                            }
                            //var arg2 = arg1 + 'systemQuest:' + JSON.stringify(rows);
                            results.systemQuest = rows;
                            callback(null, results);
                        });
                    }
                    else {
                        results.systemQuest = 'The lastest version of the system quest';
                        callback(null, results);
                }
                },
                function(arg2, callback) {
                    //Parents quest check and update
                    //if (pk_parents_quest > questPVer) {
                    conn.query("SELECT * FROM parents_quest WHERE fk_kids = ? AND state BETWEEN 2 AND 6 ", fk_kids, function (err, rows) {
                        if (err) {
                            console.log('err is ' + err);
                            connection.release();
                        }
                        //var arg3 = arg2 + 'parentsQuest: ' + JSON.stringify(rows);
                        console.log('parents quest ' + rows);
                        results.parentsQuest = rows;
                        callback(null, results);
                    });
                    //}
                    //else {
                    //    results.parentsQuest = 'The lastest version of the parents quest';
                     //   callback(null, results);
                    //}
                },
            ],
            function(err, results) {

                console.log(results);
                res.status(200).json(results);
                connection.release();
            });
    });
};

/*
//GET getInfo/:pk_std_que/:pk_parents_quest/:pk_std_quiz
exports.pushQeustAndQuizInfoToApp = function(req, res){
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
                    //system Quiz check and update
                    if (pk_std_quiz > quizVers) {
                        var Query = conn.query("SELECT * FROM std_quiz WHERE ( pk_std_quiz > ? )  ", quizVers, function (err, rows) {
                            if (err) {
                                console.log('err is ' + err);
                                connection.release();
                            }
                            var arg1 = 'systemQuiz:' + JSON.stringify(rows);
                            callback(null, arg1);
                        });
                    }
                    else {
                        var arg1 = 'The lastet version of the system quiz';
                        callback(null, arg1);
                    }
                },
                function(arg1, callback) {
                    //System quest check and update
                    if (pk_std_que > questSVer) {
                        var Query = conn.query("SELECT * FROM std_que WHERE ( pk_std_que > ? )  ", questSVer, function (err, rows) {
                            if (err) {
                                console.log('err is ' + err);
                                connection.release();
                            }
                            var arg2 = arg1 + 'systemQuest:' + JSON.stringify(rows);
                            callback(null, arg2);
                        });
                    }
                    else {
                        var arg2 = arg1 + 'The lastest version of the system quest';
                        callback(null, arg2);
                    }
                },
                function(arg2, callback) {
                    //Parents quest check and update
                    if (pk_parents_quest > questPVer) {
                        var Query = conn.query("SELECT * FROM parents_quest WHERE ( pk_parents_quest > ? ) AND fk_kids = ? ", [questPVer, fk_kids], function (err, rows) {
                            if (err) {
                                console.log('err is ' + err);
                                connection.release();
                            }
                            var arg3 = arg2 + 'parentsQuest: ' + JSON.stringify(rows);
                            callback(null, arg3);
                        });
                    }
                    else {
                        var arg3 = arg2 + 'The lastest version of the parents quest';
                        callback(null, arg3);
                    }
                },
                function(arg3, callback){
                    var Query = conn.query("SELECT * FROM quest WHERE fk_kids = ? AND (state > 2 ) AND (state < 5) ", fk_kids , function(err, rows){
                       if(err){
                           console.log('err is ' + err);
                           connection.release();
                       }
                       var arg4 = arg3 + 'questState:' + JSON.stringify(rows);
                       callback(null, arg4);
                    });
                }
            ],
            function(err, results) {

                console.log(results);
                res.status(200).json(results);
                connection.release();
            });
    });
};
*/
exports.pushQuestState = function(req, res){
    console.log('GET /getQuestInfo/:fk_kids is called by parents');
    conn.getConnection(function(err, connection){
        if(err) {
            console.error('MySAL connection err');
        }
        //req.body.state == 3 && req.body.tyep == 2 인 경우 퀘스트 검사받기 버튼을 누른경우
       // var fk_parents = req.user.fk_parents;
        //var fk_kids = req.params.fk_kids;
        //"state = 3 AND type = 2 " + " AND "+
        var condition = "state = 3 AND type = 2 " + " AND "+
                        "fk_kids =  " + req.params.fk_kids;

        var Query = conn.query("SELECT * FROM quest WHERE "+condition, function(err, rows){
            if(err){
                console.log('err is ' + err);
                connection.release();
            }
            console.log(rows);
            res.status(200).json(rows);
            connection.release();
        });
    });
};

//regist push id
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
        conn.query("INSERT INTO push SET ?", pushInfo, function(err, result){
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
