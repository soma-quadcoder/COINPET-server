var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var secretKey = require('./jwtKey');
var conn = require('../db-jeon');

console.log('./connectors/sign/parents.js is loaded');

conn.getConnection(function(err){
	if(err){
	    console.error('MySQL connection err');
		throw err;
	}
});

exports.up = function(req, res){
	console.log("./connectors/sign/parents.up() is called.");
	var user = {
		'email' : req.body.email,
		'password' : req.body.passwd
	};

	var Query =  conn.query('insert into user_parents set ?', user,  function(err, result){
		if(err){
			var errArray = err.toString().split(':');
			console.log("err in sign/parents.up()");

			switch(errArray[1])
			{
				case " ER_DUP_ENTRY":
				console.log("Duplicated Entry");
				res.json({ 'error': 'Duplicated email' });
				break;

				case " ":
				break;
			
				default:
		    	throw err;
			}
	    }else{
			var payload = {
				'email' : req.body.email,
				'id' : result.insertId
			};

		    var token = { 'jwt': jwt.sign(payload, secretKey)};
			res.json(token);
		}
	});
}

exports.in = function(req, res){
	console.log("sign.in() is called.");

	var user = {
		'email': req.body.email,
		'password': req.body.passwd
	};
	
	var Query = conn.query('select * from user-device ?', user, function(err, rows){
		console.log(rows);
		res.json(rows);
	});
	console.log(Query);
}

exports.modify = function(req, res){
	console.log("sign.modify() is called");
}

exports.remove = function(req, res){
	console.log("sign.remove() is called");

}
