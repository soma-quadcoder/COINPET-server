var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var conn = require('../db-jeon');
var secretKey = require('./jwtKey');

conn.getConnection(function(err){
	if(err){
	    console.error('MySQL connection err');
		throw err;
	}
});

// POST
exports.post = function(req, res){
	console.log("./connectros/user/kids.post is called");
	var user = {
		'name' : req.body.name,
		'gender' : req.body.gender,
		'age' : req.body.age
	};

	var Query =  conn.query('insert into user_device set ?', user,  function(err, result){
		if(err){
			console.log(">Error: " + err);
		    throw err;
	    }else{

			var value = {
			    'insertId' : result.insertId
			};
			res.json(value);
		}
	});
}

// PUT 
exports.put = function(req, res){
	console.log("./connectors/user/kids.put() is called");

	var pn = req.body.PN;

	///
	// PN 유효성 검사
	//

	var value = {
		'fk_user_device' : req.body.inserId,
		'used' : '1'
	};
	
	var condition = {
		'product_num' : pn,
	};

	var Query = conn.query('UPDATE product_num SET `usedTime` = CURRENT_TIME() WHERE ? AND used = 0', condition, function(err, result){
		if(err) {
			console.log(">Error: " + err);
			throw err;
		}else{
			console.log(result);
			res.json(result);
		}
	});
}

// DELETE
exports.delete = function(req, res){
	console.log("./connectors/user/kids.remove() is called");

}

// PATCH
exports.patch = function(req, res){
	console.log("./connectors/user/kids.patch() is called");
}
