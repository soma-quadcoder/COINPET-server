var conn = require('./db.js');
count = 0;
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
    var count = req.body.count;

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
        var serialNum = "";
        serialNum += year;
        serialNum += month;
        serialNum += day;

        //날짜 비교후 count 초기화
        if (serialNum != date) {
            date = year + month + day;
            count = 0;
        }

        //마지막 자리에 카운팅 더하기기
        var counting = count;
        if (count <= 9)
            count = '000' + count;
        else if (count <= 99)
            count = '00' + count;
        else if (count <= 999)
            count = '0' + count;

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
        var result = '';
        for (var i in serialNum) {
            result = Math.pow(weight[i], parseInt(serialNum[i]));
            result %= 31;
            if (result > '10') {
                result = result + 54;
                result = String.fromCharCode(result);
            }
            encryptSerial = encryptSerial + result;
        }
        conn.getConnection(function (err, connection) {
            if (err) {
                console.error('MySQl connection err');
                console.log(err);
                connection.release();
                res.status(500).send();
                return;
            }
            var pnInfo = {
                'product_num': encryptSerial,
                'serialNum': serialNum
            };
            conn.query("INSERT INTO product_num SET ? ", pnInfo, function (err, result) {
                if (err) {
                    connection.release();
                    console.log(err);
                    res.status(500).send();
                    return;
                }
                console.log(result);
                res.status(200).send(pnInfo);
                connection.release();
            });
        });
};
