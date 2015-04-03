var mysql = require('mysql');

var conn = mysql.createConnection({
	host : 'localhost',  // node.js와 mysql이 실행되는 host가 같으니까 localgost
	port : 3306,
	user : 'coinpet',
	password : 'dbaudghks',
	database : 'coinpet'
});

conn.connect(function(err){
	if(err){
	    console.error('MySQL connection err');
		throw err;
	}
});

exports.up = function(req, res){
	console.log("sign.up() is called.");
	var user = {
		'email' : req.body.email,
		'password' : req.body.passwd
	};

	var Query =  conn.query('insert into user_parents set ?', user,  function(err, result){
//		console.log(conn.query());
		if(err){
			console.log("err in sign.up()");
			console.log(user);
		    throw err;
	    }
		res.json(result);
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
