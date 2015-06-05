var conn = require('./db.js');
var uuid = require('node-uuid');

//CREATE CREATE post /quest
exports.createNewPn = function(req, res){
    console.log('hi');
    /*uuid.v1({
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date('2011-11-01').getTime(),
        nsecs: 5678
    });   // -> "710b962e-041c-11e1-9234-0123456789ab"
    */
    uuid.v1();
    console.log(uuid.v1());
    res.status(200).send();
/*    console.log(uuid.v2());

    /*
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
    */
};
