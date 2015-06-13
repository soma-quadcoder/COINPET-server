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
    if(req.user.fk_admin == 0) {
	console.log('Access denined');
	res.status(403).json({'error':'Access denined'});
	return;
    }

    conn.query("SELECT COUNT(*) FROM kids", function(err, result) {
	    if(err){
    		console.log("Error : Cannot execute query");
	        console.log(err);
	        console.log(this.sql);
	        res.status(500).json({"error":"Fail_query"});
	    }
	    else {
		console.log(result);
		res.status(200).send();
	    }
    });
});

module.exports = router;
