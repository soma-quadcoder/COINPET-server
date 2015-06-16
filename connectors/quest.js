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
        //var nowDate = new Date();
        var date = new Date().yyyymmdd();
        var time = new Date().hhmmss();
        var nowDate = date+'T'+time;
        var questInfo = {
            'state' : req.body.state,
            'fk_std_que' : req.body.fk_std_que,
            'startTime' : nowDate,
            'fk_kids' : req.user.fk_kids
        };

        conn.query("INSERT INTO quest SET ?", questInfo, function (err, result) {
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
        //var nowDate = new Date();
        var date = new Date().yyyymmdd();
        var time = new Date().hhmmss();
        var nowDate = date+'T'+time;
        var startDate = new Date(req.body.startTime).yyyymmdd();
        var getTime = new Date("2015-06-01");
        // var update = 1;
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
/*
 * 퀘스트 상태를 업데이틑 하는 부분
 *  req.body.state == 3 && req.body.tyep == 2 인 경우 퀘스트 검사받기 버튼을 누른경우
 *  여러개 중복으로 시스템 퀘스트를 사용할 수 있다. 분류 방법을 어찌 할까나...... 마지막?!!
 *  systemQuest update
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
        var state = req.body.state;
        console.log(state);
        var condition = "state = " + state +
            " WHERE fk_kids = " + fk_kids +
            " AND fk_std_que = " + req.body.fk_std_que +
            " AND state = 1";

        conn.query("UPDATE quest SET "+condition, function(err, result){
            if(err){
                console.log('err is ' + err);
                connection.release();
                res.status(500).send();
                return;
            }
            if(state == 4){
                console.log('state ===== ' + state);
                conn.query("SELECT point FROM std_que WHERE pk_std_que = ?", [req.body.fk_std_que], function(err, rows){
                    if(err){
                        console.log('err is ' + err);
                        connection.release();
                        res.status(500).send();
                        return;
                    }
                    var point = rows[0]["point"];
                    console.log(rows);
                    console.log(point);
                    conn.query("UPDATE kids SET now_point=(now_point+?) WHERE pk_kids = ?",[point,fk_kids], function(err,result){
                        if(err){
                            console.log('err is ' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }
                    });
                });
            }
            res.status(200).send();
            connection.release();
        });


    });
};

//UPDATE parents quest
exports.updateParentsQuest = function(req, res){
    console.log("PUT /quest/parentsUpdate is called by parents");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }
        //var nowDate = new Date();
        var date = new Date().yyyymmdd();
        var time = new Date().hhmmss();
        var nowDate = date+'T'+time;
        var startTime = new Date(req.body.startTime);
        var pk_parents_quest = req.body.fk_parents_quest;
        var state = req.body.state;
        conn.query("UPDATE parents_quest SET point = ? , content = ? , startTime = ? , modifyTime = ?, state = ?, type = ?, comment = ? WHERE pk_parents_quest = ?",[req.body.point, req.body.content,startTime,nowDate,state,req.body.type, req.body.comment,pk_parents_quest], function(err, result){
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

//UPDATE quest state retry and done ONLY STATE
exports.updateQuestState = function(req, res){
    console.log("PUT /quest/stateUpdate is called by parents and kids");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }
        //UPDATE goal g INNER JOIN kids k ON g.pk_goal = k.current_goal AND g.fk_kids = k.pk_kids SET state = ?
        if(req.user.fk_kids){
            console.log('req.user.fk_kids' + req.user.fk_kids);
            conn.query("UPDATE parents_quest SET state = ? WHERE pk_parents_quest = ?",[req.body.state, req.body.fk_parents_quest ], function(err, result){
                if(err){
                    console.log('err is ' + err);
                    connection.release();
                    res.status(500).send();
                    return;
                }
                res.status(200).send();
                connection.release();
            });
        }
        else{
            console.log('req.user.fk_parents' + req.user.fk_parents);
            var state = req.body.state;
            conn.query("UPDATE parents_quest SET state = ?, comment = ? WHERE pk_parents_quest = ?",[state ,req.body.comment, req.body.fk_parents_quest ], function(err, result){
                if(err){
                    console.log('err is ' + err);
                    connection.release();
                    res.status(500).send();
                    return;
                }
                if(state == 4){
                    console.log('state ===== ' + state);
                    conn.query("UPDATE kids k INNER JOIN parents_quest p ON p.fk_kids = k.pk_kids AND p.pk_parents_quest=? SET now_point=(now_point+?)",[req.body.fk_parents_quest, 5], function(err,result){
                        if(err){
                            console.log('err is ' + err);
                            connection.release();
                            res.status(500).send();
                            return;
                        }
                    });
                }
                res.status(200).send();
                connection.release();
            });
        }
    });
};

//System quest create by admin
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
            'type' : req.body.type,
            'con_type' : req.body.con_type,
            'con_method' : req.body.con_method,
            'con_count' : req.body.con_count
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
        var pk_std_que = req.params.fk_std_que;

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