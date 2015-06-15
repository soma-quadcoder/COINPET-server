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
                    /*var date = new Date();
                     var date = new Date().yyyymmdd();
                     var time = new Date().hhmmss();
                     console.log(date + time);
                     var full = date+'T'+time;
                     console.log(full);*/
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
                            console.log(result);
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
                    var index_date = new Date(index_time);
                    var time = index_date.hhmmss();
                    index_date = index_date.yyyymmdd();

                    if(results[index_date] == null)
                        results[index_date] = {};

                    if(results[index_date][time] == null)
                        results[index_date][time] = [];

                    // delete duplicated data
                    delete rows[index].createTime;
                    results[index_date][time].push(rows[index]);
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
        conn.query("UPDATE product_num SET admin_write = 1 WHERE pk_pn = ?",[req.body.fk_pn], function(err, result){
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

//registration product_num
exports.updatePn = function(req, res){
    console.log("PUT /pn is called");
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
            res.status(500).send();
            connection.release();
            return;
        }
        console.log(results);

        var date = new Date().yyyymmdd();
        var time = new Date().hhmmss();
        var full = date+'T'+time;
        conn.query("UPDATE product_num SET admin_write = 1 , used = 1, usedTime = ?, fk_kids = ? WHERE product_num = ?",[full, req.user.fk_kids, req.body.product_num], function(err, result){
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

exports.pnWrite = function(req, res, next) {
    if(req.body._method == "DELETE")
    {
        console.log('redirection to DELETE /pn');
        next();
        return;
    }

    console.log('PUT /pn is called');
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
            res.status(500).send();
            connection.release();
            return;
        }

        if(req.body.product_num)
        {
            //individual target
            conn.query("UPDATE product_num SET admin_write = 1 WHERE product_num=?",[req.body.product_num], function(err, result) {
                if(err){
                    console.log('err : '+err);
                    console.log(this.sql);
                    res.status(500).send();
                    connection.release();
                    return;
                }
                res.status(200).send();
                connection.release();
            });
            return;
        }

        var condition = "";
        for(var index_date in req.body.target)
        {
            for(var index in req.body.target[index_date])
            {
                var index_time = req.body.target[index_date][index];
                if(condition!="")
                    condition += 'OR ';
                condition+='createTime="'+index_date+' '+index_time+'"';
            }
        }
        conn.query("UPDATE product_num SET admin_write = 1 WHERE ("+condition+")", function(err, result){
            if(err) {
                console.log('err : '+err);
                console.log(this.sql);
                res.status(500).send();
                connection.release();
                return;
            }

            console.log(this.sql);
            res.status(200).send();
            connection.release();
        });
    });
};

exports.pnDelete = function(req, res) {

    console.log('DELETE /pn is called');
    conn.getConnection(function(err,connection){
        if(err){
            console.error('MySQl connection err');
            console.log(err);
            res.status(500).send();
            connection.release();
            return;
        }

        if(req.body.product_num)
        {
            //individual target
            conn.query("DELETE FROM product_num WHERE product_num=?",[req.body.product_num], function(err, result) {
                if(err){
                    console.log('err : '+err);
                    console.log(this.sql);
                    res.status(500).send();
                    connection.release();
                    return;
                }
                res.status(200).send();
                connection.release();
            });
            return;
        }

        var condition = "";
        for(var index_date in req.body.target)
        {
            for(var index in req.body.target[index_date])
            {
                var index_time = req.body.target[index_date][index];
                if(condition!="")
                    condition += 'OR ';
                condition+='createTime="'+index_date+' '+index_time+'"';
            }
        }
        conn.query("DELETE from product_num WHERE admin_write=0 AND ("+condition+")", function(err, result){
            if(err) {
                console.log('err : '+err);
                console.log(this.sql);
                res.status(500).send();
                connection.release();
                return;
            }

            console.log(this.sql);
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

function makePN(results) {

    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    var date = new Date().yyyymmdd();
    var time = new Date().hhmmss();
    var full = date+'T'+time;

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
        count = '00000' + count;
    else if (count <= 99)
        count = '0000' + count;
    else if (count <= 999)
        count = '000' + count;
    else if (count <= 9999)
        count = '00' + count;
    else if (count == 100000)
        count = 0;

    serialNum += count;
    count = counting + 1; // increase count

    // yyyy/mm/dd (y+y+y+y+m+m+d+d)
    for (var i in serialNum) {
        sum = parseInt(sum) + parseInt(serialNum[i]);
    }

    if (sum <= 9)
        sum = '0' + sum;
    /*
     else if (sum <= 99)
     sum = '00' + sum;
     else if (sum <= 999)
     sum = '0' + sum;*/

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

    results["createTime"] = new Date();


    //웹에 보낼 PN  번호 저장.
    if (results["product_num"] == null)
        results["product_num"] = [];

    results["product_num"].push(encryptSerial);

    //console.log('encryptSerial = ' + encryptSerial + 'serialNum = ' + serialNum);

    var pnInfo = {
        'product_num': encryptSerial,
        'serialNum': serialNum,
        'createTime' : full
    };

    return pnInfo;
}
