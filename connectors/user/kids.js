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
exports.post = function(req, res) {
	console.log("./connectros/user/kids.post is called");

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

	var query = conn.query('insert into user_kids set ?', user, function (err, result) {
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
					conn.query("DELETE FROM user_kids WHERE ?",{'pk_kids':pk_kids});
					res.json({"error" : errorMessage});
				});
		}
	});
};

// PUT
exports.put = function(req, res){
	console.log("./connectors/user/kids.put() is called");

}

// PATCH
exports.patch = function(req, res){
	console.log("./connectors/user/kids.patch() is called");

	var pn = req.body.pn;
	var fk_kids = req.user.fk_kids;

	///
	// PN 유효성 검사
	//
	clearPN(fk_kids);
	setPN(req.user.fk_kids, req.body.pn);

}


// DELETE
exports.delete = function(req, res){
	console.log("./connectors/user/kids.remove() is called");

}

function clearPN(fk_kids, success, fail) {
	var condition = "fp_kids = " + fk_kids;

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