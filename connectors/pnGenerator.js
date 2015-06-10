var conn = require('./db.js');
var async = require('async');
count=0;
date = 0;
/*
 var createPN = function(){
 var day = new Date().getDate();
 var month = new Date().getMonth() + 1;
 var year = new Date().getFullYear();
 var sum = 0;
 //day
 day = parseInt(day);
 if(day <= 9)
 day = '0' + day;

 //month
 month = parseInt(month);

 if(month <= 9)
 month = '0' + month;

 //add yyyy/mm/dd
 year = parseInt(year);
 var serialNum = "";
 serialNum += year;
 serialNum += month;
 serialNum += day;

 //날짜 비교후 count 초기화
 if(serialNum != date) {
 date = year + month + day;
 count = 0;
 }

 //마지막 자리에 카운팅 더하기기
 var counting = count;
 if(count <= 9)
 count = '000' + count;
 else if(count <= 99)
 count = '00' + count;
 else if(count <= 999)
 count = '0' + count;

 serialNum += count;
 count = counting + 1; // increase count
 // yyyy/mm/dd (y+y+y+y+m+m+d+d)
 for (var i in serialNum) {
 sum = parseInt(sum) + parseInt(serialNum[i]);
 }

 if(sum <= 9)
 sum = '000' + sum;
 else if(sum <= 99)
 sum = '00' + sum;
 else if(sum <= 999)
 sum = '0' + sum;

 serialNum += sum;

 /*var result;
 var base = 7;
 var mid = '';
 for(var i in serialNum){
 result = Math.pow(base, parseInt(serialNum[i]) );
 result %= 31;
 mid = mid + result;
 console.log(parseInt(serialNum[i]))
 console.log('result mod ' + result);
 }



 var weight = [2,47,19,23,17,43,3,29,31,5,41,11,19,7,13,37];

 var encryptSerial = '';
 var result = '';
 for(var i in serialNum){
 result = Math.pow(weight[i], parseInt(serialNum[i]));
 result %= 31;
 if(result > '10') {
 result = result + 54;
 result = String.fromCharCode(result);
 }
 encryptSerial = encryptSerial + result;
 }
 console.log('ssss');


 };
 */



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
        var results = {};
        var validCount;
        var checkRe = 0; //create PN 0 == fail, 1 == success 3 == req_count same the validCount
        async.waterfall([
                function(callback) {
                    //현재 DB에 유효한 시리얼 번호 check!
                    //SELECT serialNum FROM product_num ORDER BY serialNum DESC LIMIT 1 ;SELECT COUNT(*) FROM product_num WHERE used = 0
                    var date = new Date();
                    console.log(date);
                    conn.query("SELECT COUNT(*) FROM product_num WHERE used = 0 ; SELECT COUNT(*) FROM product_num WHERE date(createTime) = date(now()) ", function (err, rows) {
                        if (err) {
                            console.log('POST /pnGenerator err ' + err);
                            res.status(500).send();
                            connection.release();
                            return;
                        }
                        validCount = rows[0][0]["COUNT(*)"]; // 사용가능한 PN
                        count = rows[1][0]["COUNT(*)"]; // 오늘 생성한 PN count
                        callback(null);
                    });
                },
                function(callback){
                        var condition = req_count;
                        conn.query("SELECT product_num FROM product_num WHERE used = 0 ORDER BY RAND() LIMIT "+req_count, function(err, rows){
                            if (err) {
                                console.log('POST /pnGenerator err ' + err);
                                res.status(500).send();
                                connection.release();
                                return;
                            }

                            for(var i in rows) {
                                var data = rows[i];
                                console.log(data);
                                if (results["product_num"] == null)
                                    results["product_num"] = [];

                                results["product_num"].push(data["product_num"]);
                            }
                            if(req_count <= validCount) {
                                console.log('i wanna sleep!!!!')
                                callback(null);
                            }
                        });

                    if(req_count > validCount){
                        req_count -= validCount;
                        var subCount = req_count;
                        console.log(req_count);
                        while(req_count > 0) {
                            console.log('req_count is ' + req_count);
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

                            console.log('encryptSerial = ' + encryptSerial + 'serialNum = ' + serialNum);

                            var pnInfo = {
                                'product_num': encryptSerial,
                                'serialNum': serialNum
                            };
                            conn.query("INSERT INTO product_num SET ? ", pnInfo, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    connection.release();
                                    return;

                                }
                            });
                            req_count = req_count - 1;
                        }
                    }
                }],
            function(err, result){
                console.log('sssssss' + results);
                res.status(200).json(results);
                connection.release();
            });
    });
};

exports.getPn = function(req, res){
    console.log('GET /getValidPn is called by admin');
    conn.getConnection(function(err,connection){
        if(err){
            console.log('err' + err);
            console.error('MySQL connection err in cuurentGoal');
            connection.release();
            res.status(500).send();
            return;
        }
        var results = {};

        conn.query("SELECT product_num FROM product_num WHERE used = 0 ", function(err, rows){
            if(err){
                console.log('err is ' + err);
                connection.release();
                res.status(500).send();
                return;
            }
            for(var i in rows) {
                var data = rows[i];
                console.log(data);
                if (results["product_num"] == null)
                    results["product_num"] = [];

                results["product_num"].push(data["product_num"]);
            }
            console.log(rows);
            res.status(200).json(results);
            connection.release();
        });
    });
};