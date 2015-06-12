var conn = require('./db.js');
var async = require('async');
count=0;
date = 0;

exports.createNewPn = function(req, res){
    console.log('POST /pnGenerator is called by admin');
    conn.getConnection(function (err, connection) {
        if (err) {
            console.error('MySQl connection err');
            console.log(err);
            connection.release();
            res.status(500).send();
            return;
        }

        var req_count = req.body.count;
        var compareCount = req.body.count;
        var results = {};

        async.waterfall([
                function(callback) {
                    //현재 DB에 유효한 시리얼 번호 check!
                    var date = new Date();
                    conn.query("SELECT COUNT(*) FROM product_num WHERE date(createTime) = date(now()) ", function (err, rows) {
                        if (err) {
                            console.log('POST /pnGenerator err ' + err);
                            res.status(500).send();
                            connection.release();
                            return;
                        }
                        count = rows[0]["COUNT(*)"]; // 오늘 생성한 PN count
                        callback(null);
                    });
                },
                function(callback){
                    while(req_count > 0) {
                        var pnInfo = makePN(results);
                        conn.query("INSERT INTO product_num SET ? ", pnInfo, function (err, result) {
                            if (err) {
                                console.log(err);
                                connection.release();
                            }
                            compareCount -= 1;
                            if(compareCount == req_count) {
                                callback(null);
                            }

                        });
                        req_count = req_count - 1;
                    }
                }],
            function(err, result){
                res.status(200).json(results);
                //connection.release();
            });
    });
};

exports.getPn = function(req, res){
    console.log('GET /getPn is called by admin');
    console.log(req.user.fk_admin);
    conn.getConnection(function(err,connection){
        if(err){
            console.log('err' + err);
            console.error('MySQL connection err in cuurentGoal');
            connection.release();
            res.status(500).send();
            return;
        }
        var results = {};

        conn.query("SELECT product_num FROM product_num WHERE admin_write = 0 ", function(err, rows){
            if(err){
                console.log('err is ' + err);
                connection.release();
                res.status(500).send();
                return;
            }
            for(var i in rows) {
                var data = rows[i];
                if (results["product_num"] == null)
                    results["product_num"] = [];

                results["product_num"].push(data["product_num"]);
            }
            res.status(200).json(results);
            connection.release();
        });
    });
};

exports.getAllPn = function(req, res){
    console.log('GET /getAllPn is called by admin');
    conn.getConnection(function(err,connection){
        if(err){
            console.log('err' + err);
            console.error('MySQL connection err in cuurentGoal');
            connection.release();
            res.status(500).send();
            return;
        }
        var results = {};
        conn.query("SELECT * FROM product_num ORDER BY createTime", function(err, rows){
            if(err){
                console.log('err is ' + err);
                connection.release();
                res.status(500).send();
                return;
            }

            if(true) // test for admin web
            {
                for(var index in rows)
                {
                    var index_time = rows[index].createTime;

                    if(results[index_time] == null)
                        results[index_time] = [];

                    // delete duplicated data
                    delete rows[index].createTime;

                    results[index_time].push(rows[index]);
                }
                res.status(200).json(results);
                connection.release();
                return;
            }

            for(var i in rows) {
                var data = rows[i];
                if (results["product_num"] == null)
                    results["product_num"] = [];

                results["product_num"].push(data["product_num"]);
            }
            res.status(200).json(results);
            connection.release();
        });
    });
};

//registration product_num
//사용 여부
exports.updatePnAdmin = function(req, res){
    console.log("PUT /pnUpdate is called");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
            res.status(500).send();
            connection.release();
            return;
        }
        var date = new Date();
        conn.query("UPDATE product_num SET write = 1 WHERE pk_pn = ?",[req.body.fk_pn], function(err, result){
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

function makePN(results) {
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var sum = 0;
    //day
    day = parseInt(day);
    if (day <= 9)
        day = '0' + day;

    //month
    month = parseInt(month);

    if (month <= 9)
        month = '0' + month;

    //add yyyy/mm/dd
    year = parseInt(year);
    //SerialNum can delete
    var serialNum = "";
    serialNum += year;
    serialNum += month;
    serialNum += day;


    //마지막 자리에 카운팅 더하기기
    var counting = count;
    if (count <= 9)
        count = '000' + count;
    else if (count <= 99)
        count = '00' + count;
    else if (count <= 999)
        count = '0' + count;
    else if (count == 999)
        count = 0;

    serialNum += count;
    count = counting + 1; // increase count

    // yyyy/mm/dd (y+y+y+y+m+m+d+d)
    for (var i in serialNum) {
        sum = parseInt(sum) + parseInt(serialNum[i]);
    }

    if (sum <= 9)
        sum = '000' + sum;
    else if (sum <= 99)
        sum = '00' + sum;
    else if (sum <= 999)
        sum = '0' + sum;

    serialNum += sum;

    var weight = [2, 47, 19, 23, 17, 43, 3, 29, 31, 5, 41, 11, 19, 7, 13, 37];//base
    var encryptSerial = '';
    var Result = '';
    for (var i in serialNum) {
        Result = Math.pow(weight[i], parseInt(serialNum[i]));
        Result %= 31;
        if (Result > '10') {
            Result = Result + 54;
            Result = String.fromCharCode(Result);
        }
        encryptSerial = encryptSerial + Result;
    }

    //웹에 보낼 PN  번호 저장.
    if (results["product_num"] == null)
        results["product_num"] = [];

    results["product_num"].push(encryptSerial);

    //console.log('encryptSerial = ' + encryptSerial + 'serialNum = ' + serialNum);

    var pnInfo = {
        'product_num': encryptSerial,
        'serialNum': serialNum
    };

    return pnInfo;
}
