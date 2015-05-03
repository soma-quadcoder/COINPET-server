/* 
 * 2015.4.2
 * Created by jeon
 * Sign up & Sign in module
 * rainsy02@gmail.com
 *
 *
 */


var express = require('express');
var ejwt = require('express-jwt');
var router = express.Router();
var jwt = require('jsonwebtoken');
var conn = require('../db-jeon');
//var kids = require('./kids.js');
var secretKey = require('./jwtKey');

console.log("./router/user/kids.js is loaded");

conn.getConnection(function(err){
	if(err){
		console.error('MySQL connection err');
	}
});

// POST
function post (req, res) {
	console.log("POST /user/kids is called");

	var pn = req.body.pn;
	var user = {
		'name': req.body.name,
		'gender': req.body.gender,
		'age': req.body.age
	};

	var invaildValue = "";

	if (user.name == null)
		invaildValue += "name ";
	if (user.gender == null)
		invaildValue += "gender ";
	if (user.age == null)
		invaildValue += "age ";
	if (pn == null)
		invaildValue += "pn ";

	if (invaildValue) {
		var errorMessage = {
			'error': "Invaild_Value",
			'field': invaildValue
		}
		res.json(errorMessage);
		console.log("Error");
		console.log(errorMessage);
		return;
	}

	///
	// PN 유효성 검사
	///

	var query = conn.query('insert into kids set ?', user, function (err, result) {
		var pk;
		if (err) {
			console.log(">Error: " + err);
			throw err;
		} else {
			pk_kids = result.insertId;
			var payload = {
				'fk_kids': pk_kids,
				'name': user.name
			};
			var value = {
				'Authorization': jwt.sign(payload, secretKey)
			};
			setPN(pk_kids, pn, function() {res.json(value)},
				function(errorMessage) {
					var query = conn.query("DELETE FROM kids WHERE ?",{'pk_kids':pk_kids});
					res.json({"error" : errorMessage});
				});
		}
	});
};

// PUT
function put (req, res){
	console.log("PUT /user/kids is called");

	var value = {};
	var condition = "pk_kids = " + req.user.fk_kids;

	if(req.body.name)
		value.name = req.body.name;
	if(req.body.gender=='남' || req.body.gender=='여')
		value.gender = req.body.gender;
	if(req.body.age * 1)
		value.age = req.body.age;

	conn.query("UPDATE kids SET ? WHERE "+condition, value, function (err, result) {
		if(err) {
			console.log("Error : Cannot execute query");
			console.log(err);
			res.status(500).json({"error" : "Fail_query"});
		} else {
			res.status(200).send();
		}
	});

}

// PATCH
function patch (req, res){
	//console.log("PATCH /user/kids is called");
    //
	//var pn = req.body.pn;
	//var fk_kids = req.user.fk_kids;
    //
	/////
	//// PN 유효성 검사
	////
	//clearPN(fk_kids);
	//setPN(req.user.fk_kids, req.body.pn);

	console.log("PATCH /user/kids is called");

	var pn = req.body.pn;
	var condition = "product_num ="+pn;

	conn.query("SELECT * FROM product_num WHERE "+condition, function (err, result) {

	});

}


// DELETE
function remove (req, res){
	console.log("DELETE /user/kids.remove() is called");

	var condition = "pk_kids = " + req.user.fk_kids;

	conn.query("UPDATE kids SET ? WHERE "+condition, {'disable':1}, function (err, result) {
		if (err) {
			console.log("Error : Cannot disable kids");
			res.status(500).json({"error":"Fail_query"});
		}
		else if (result.changedRows === 0) {
			console.log("Error : Cannot disable kids (no target pk)");
			res.status(500).json({"error":"Invaild_number"});
		}
	});
	res.status(200).send();


}

function clearPN(fk_kids, success, fail) {
	var condition = "fk_kids = " + fk_kids;

	conn.query("UPDATE product_num SET ? WHERE "+condition, {'used':0}, function (err, result) {
		if (err) {
			console.log("Error : Cannot clear PN");
			console.log(err);
			fail();
			return;
		}
		else if (result.changedRows === 0) {
			console.log("Error : Cannot clear PN (no target PN)");
			fail();
			return;
		}
		success();
	});
}

function setPN(fk_kids, pn, success, fail) {
	var condition = "fk_kids = " + fk_kids;

	condition =	"`product_num` = "+ pn +" AND "
	+"`used` = 0";

	var value = {
		'fk_kids' : fk_kids
	};

	var query = conn.query("UPDATE product_num SET ? WHERE "+condition, value, function(err, result){
		if (err) {
			console.log("Error : Cannot set PN");
			console.log(err);
			fail("Fail_pn");
			return;
		}else if(result.changedRows == 0){
			console.log("Error : Cannot set PN");
			console.log("Non registerd PN");
			fail("Used_pn");
			return;
		}
		success();
	});
}

function login (req, res) {
	console.log("POST /user/kids/login is called");
	
	var pn = req.body.pn;
	var condition = "product_num="+pn+
					" AND used=1";
	
	conn.query("SELECT fk_kids FROM product_num WHERE "+condition, function(err, result) {
		if (err) {
			console.log("Error : Cannot execute query");
			console.log(err);
			console.log(this.sql);
			res.status(500).json({"error":"Fail_query"});
		}else if (result.length == 0){
			console.log("Error : No fk_kids");
			res.status(500).json({"error":"no user"});
		}else {
			console.log("Success to login");
			console.log(result);
			console.log(this.sql);
			var fk_kids = result[0].fk_kids;
			res.json({'Authorization': jwt.sign({"fk_kids":fk_kids}, secretKey)});
		}
	});
}


router.get('/', function() {
	console.log("GET /user/kids is called");
	});

// create
router.post('/', post);

// update
router.put('/', ejwt({secret: secretKey}), put);

// remove
router.delete('/', ejwt({secret: secretKey}), remove);

// login
router.post('/login', login);

module.exports = router;
