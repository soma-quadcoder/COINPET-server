var conn = require('./db.js');
var async = require('async');
//GET getInfo/:pk_std_que/:pk_parents_quest/:pk_std_quiz
exports.pushQeustAndQuizInfoToApp = function(req, res){
    console.log('GET /getInfo/:pk_std_que/:pk_std_quiz is called');

    conn.getConnection(function(err, connection){
        if(err) {
            console.error('MySAL connection err');
            connection.release();
            res.status(500).send();
            return;
        }
        var quizVers = req.params.pk_std_quiz;
        var questSVer = req.params.pk_std_que;
        console.log('quiz'+quizVers);
        console.log('quest'+questSVer);
        var fk_kids = req.user.fk_kids;
        var pk_std_quiz;
        var pk_std_que;
        var results = {};
        results["needUpdate"] = false;
        results["systemQuiz"] = [];
        results["systemQuest"] = [];
        results["parentsQuest"] = [];

        async.waterfall(
            [
                function(callback) {
                    //system Quiz check and update
                    conn.query("SELECT * FROM std_quiz WHERE ( pk_std_quiz > ? )  ", quizVers, function (err, rows) {
                        if (err) {
                            console.log('err is ' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }
                        //var data = rows;

                        for(var i in rows) {
                            var data = rows[i];
                            data.level = parseInt(data.level);

                            if(results["systemQuiz"] == null)
                                results["systemQuiz"] = [];

                            results["systemQuiz"].push(data);
                            results["needUpdate"] = true;
                        }
                        callback(null, results);
                    });
                },
                function(arg1, callback) {
                    //System quest check and update
                    conn.query("SELECT * FROM std_que WHERE ( pk_std_que > ? )  ", questSVer, function (err, rows) {
                        if (err) {
                            console.log('err is ' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }
                        for(var i in rows) {
                            var data = rows[i];

                            if(results["systemQuest"] == null)
                                results["systemQuest"] = [];

                            results["systemQuest"].push(data);
                            results["needUpdate"] = true;
                        }
                        callback(null, results);
                    });
                },
                function(arg2, callback) {
                    //Parents quest check and update
                    //if (pk_parents_quest > questPVer) {
                    var nowDate = new Date();
                    console.log(nowDate);
                    //AND TIMESTAMPDIFF(SECOND, modifyTime, getTime)
                    conn.query("SELECT * , state+0 FROM parents_quest WHERE fk_kids = ?",fk_kids,function(err, rows){
                        if(err){
                            console.log('err is ' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }
                        for(var i in rows) {
                            var data = rows[i];
                            data["state"] = data["state+0"];
                            if(results["parentsQuest"] == null)
                                results["parentsQuest"] = [];
                            delete data["state+0"];
                            delete data.modifyTime;
                            delete data.getTime;

                            results["parentsQuest"].push(data);
                            results["needUpdate"] = true;
                        }
                        conn.query("UPDATE parents_quest SET getTime = ? , modifyTime = ? WHERE fk_kids = ?",[nowDate,nowDate, fk_kids], function(err, rows){
                            if(err){
                                console.log('err is ' + err);
                                connection.release();
                                res.status(500).send();
                                return;
                            }
                        });
                        callback(null, results);
                    });
                }
            ],
            function(err, results) {
                res.status(200).json(results);
                connection.release();
            });
    });
};
exports.pushQuestState = function(req, res){
    console.log('GET /getQuestInfo/:pk_std_que is called by parents');
    conn.getConnection(function(err, connection){
        if(err) {
            console.error('MySAL connection err');
            connection.release();
            res.status(500).send();
            return;
        }
        var questSVer = req.params.pk_std_que;
        var pk_std_que;
        var fk_kids;
        var fk_parents = req.user.fk_parents;
        var results = {};

        async.waterfall(
            [
                function(callback){
                    conn.query("SELECT MAX(pk_std_que) FROM std_que", function (err, rows) {
                        if (err) {
                            console.log('err is' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }

                        pk_std_que = JSON.stringify(rows[0]);
                        pk_std_que = pk_std_que.split(":")[1];
                        pk_std_que = pk_std_que.split("}")[0];

                        callback(null, results);

                    });
                },
                function(arg, callback){
                    //select s.* from saving_list s, parents_has_kids p where s.fk_kids = p.fk_kids AND p.fk_parents = ?', req.user.fk_parents,
                    conn.query("SELECT q.* ,q.state+0 FROM parents_quest q, parents_has_kids p WHERE q.fk_kids = p.fk_kids AND p.fk_parents = ? ", fk_parents, function(err, rows){
                        if(err){
                            console.log('err is ' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }
                        for(var i in rows) {
                            var data = rows[i];
                            fk_kids = data.fk_kids;

                            if(results[fk_kids] == null)
                                results[fk_kids] = [];
                            data["state"] = data["q.state+0"];
                            delete data.fk_kids;
                            delete data.modifyTime;
                            delete data.getTime;
                            delete data["q.state+0"];
                            results[fk_kids].push(data);
                        }
                        callback(null, results);
                    });
                },
                function(arg1 ,callback) {
                    //system Quiz check and update
                    conn.query("SELECT q.*, q.state+0 FROM quest q, parents_has_kids p WHERE q.fk_kids = p.fk_kids AND p.fk_parents = ? ", fk_parents, function (err, rows) {
                        if (err) {
                            console.log('err is ' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }
                        for(var i in rows) {
                            var data = rows[i];
                            fk_kids = data.fk_kids;

                            if(results[fk_kids] == null)
                                results[fk_kids] = [];
                            data["state"] = data["q.state+0"];

                            delete data["q.state+0"];
                            delete data.fk_kids;
                            results[fk_kids].push(data);
                        }
                        callback(null, results);
                    });
                },
                function(arg2, callback) {
                    //System quest check and update
                    conn.query("SELECT * FROM std_que WHERE ( pk_std_que > ? )  ", questSVer, function (err, rows) {
                        if (err) {
                            console.log('err is ' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }
                        results["stdQuest"] = rows;
                        callback(null, results);
                    });

                }
            ],
            function(err, results) {
                res.status(200).json(results);
                connection.release();
            });
    });
};
exports.pushCurrentQuest = function(req, res){
    console.log('GET /getCurrentQuest/:fk_kids is called by parents');
    conn.getConnection(function(err, connection){
        if(err) {
            console.error('MySAL connection err');
            connection.release();
            res.status(500).send();
            return;
        }
        //req.body.state == 3 && req.body.tyep == 2 인 경우 퀘스트 검사받기 버튼을 누른경우
        //"state = 3 AND

        var fk_kids = req.params.fk_kids;

        //, INTERVAL '1 1:1:1' DAY_SECOND
        var results = {
            parents_quest : '',
            quest : ''
        };
        conn.query("SELECT * FROM parents_quest WHERE state = 3 AND fk_kids = ?; SELECT * FROM quest WHERE fk_kids = ? ",[fk_kids, fk_kids], function(err, rows){
            if(err){
                console.log('err is ' + err);
                connection.release();
                res.status(500).send();
                return;
            }
            results.parents_quest = rows[0];
            results.quest = rows[1];
            res.status(200).json(results);
            connection.release();
        });
    });
};
//regist push id
exports.regist = function(req, res){
    console.log('POST /regist is called');
    conn.getConnection(function(err, connection){
        if(err) {
            console.error('MySAL connection err in /regist');
            connection.release();
            res.status(500).send();
            return;
        }
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
                res.status(500).send();
                return;
            }
            res.status(200).json();
            connection.release();
        });
    });
};
