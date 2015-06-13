var express = require('express');
var ejwt = require('express-jwt');
var router = express.Router();
var jwt = require('jsonwebtoken');
var conn = require('../db-jeon');
var secretKey = require('../user/jwtKey');
var adminPasswd = require('./adminPasswd');

console.log("./router/admin/user.js is loaded");

conn.getConnection(function(err){
    if(err){
	console.error('admin/user MySQL connection err');
	console.log(err);
    }
});

// nothing
router.get('/', ejwt({secret: secretKey}), function(req, res) {
    console.log('GET /admin/user is called');
    if(req.user.fk_admin == 0) {
	console.log('Access denined');
	res.status(403).json({'error':'Access denined'});
	return;
    }

    conn.query("SELECT COUNT(*) FROM kids;SELECT COUNT(*) FROM parents;"
		+"SELECT COUNT(*) FROM kids WHERE createTime BETWEEN CURDATE()-14 AND CURDATE()-7;"
		+"SELECT COUNT(*) FROM parents WHERE createTime BETWEEN CURDATE()-14 AND CURDATE()-7;"
		+"SELECT COUNT(*) FROM kids WHERE createTime>CURDATE()-7;"
		+"SELECT COUNT(*) FROM parents WHERE createTime>CURDATE()-7;"
		+"SELECT COUNT(*) FROM kids WHERE createTime BETWEEN SUBDATE(CURDATE(), INTERVAL 2 MONTH) AND SUBDATE(CURDATE(), INTERVAL 1 MONTH);"
		+"SELECT COUNT(*) FROM parents WHERE createTime BETWEEN SUBDATE(CURDATE(), INTERVAL 2 MONTH) AND SUBDATE(CURDATE(), INTERVAL 1 MONTH);"
		+"SELECT COUNT(*) FROM kids WHERE createTime > SUBDATE(CURDATE(), INTERVAL 1 MONTH);"
		+"SELECT COUNT(*) FROM parents WHERE createTime > SUBDATE(CURDATE(), INTERVAL 1 MONTH);"
		, function(err, rows) {
	    if(err){
    		console.log("Error : Cannot execute query");
	        console.log(err);
	        console.log(this.sql);
	        res.status(500).json({"error":"Fail_query"});
	    }
	        var result = {};
		result.total = {};
		result.week = {};
		result.week.prev = {};
		result.week.cur = {};
		result.month = {};
		result.month.prev = {};
		result.month.cur = {};
		
		var i = 0;
		result.total.kids = rows[i++][0]['COUNT(*)'];
		result.total.parents = rows[i++][0]['COUNT(*)'];
		
		result.week.prev.kids = rows[i++][0]['COUNT(*)'];
		result.week.prev.parrent = rows[i++][0]['COUNT(*)'];
		result.week.cur.kids = rows[i++][0]['COUNT(*)'];
		result.week.cur.parents = rows[i++][0]['COUNT(*)'];

		result.month.prev.kids = rows[i++][0]['COUNT(*)'];
		result.month.prev.parrent = rows[i++][0]['COUNT(*)'];
		result.month.cur.kids = rows[i++][0]['COUNT(*)'];
		result.month.cur.parents = rows[i++][0]['COUNT(*)'];

		res.status(200).json(result);
	    
    });
});

module.exports = router;
