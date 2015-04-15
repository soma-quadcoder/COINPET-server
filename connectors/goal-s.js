var mysql = require('mysql');

var conn = mysql.createConnection({
	host : 'localhost',  // node.js와 mysql이 실행되는 host가 같으니까 localgost
	port : 3306,
	user : 'kyuli.yeo',
	password : '1234',
	database : 'kyukyu'
});

exports.create = function(req, res){
	console.log("create() is called.");
	conn.connect(function(err){
			if(err){
				console.error('MySQL connection err');
				throw err;
			}
			
	var user = {'id' : req.body.id,
				'name' : req.body.name,
				'address': req.body.address
	};

	console.log(user);
	var Query =  conn.query('insert into test set ?', user,  function(err, result){
		if(err){
			console.log("err is " + err);
		    throw err;
	    }
		// 두번째 인자에 user추가, ?부분에 user 정보가 들어가게 됨
		console.log('result ' + result);
		res.status(200).send(result);
	});
	//conn.end();
	});
}

exports.read = function(req, res){
	console.log("GET is called");
	conn.connect(function(err){
	if(err){
		console.log('MySQL connection error');
		throw err;
	}
	var Query = conn.query('select * from test', function(err, rows){
		console.log(rows);
		res.json(rows);
	});
	console.log(Query);
	conn.end();
	});
}


exports.update = function(req, res){
	console.log("PUT is called");
	conn.connect(function(err){
	if(err){
		console.log('MySQL connection error');
		throw err;
	}
	var changeId = {
		'id' : req.body.id
	};
	var updateInfo = {
		'name' : req.body.name,
		'address' : req.body.address
	};
	console.log(changeId + updateInfo);
	var Query = conn.query('update test set ? where id = ?',[updateInfo,changeId], function(err, result ){
		if(err){
			console.log(err);
			throw err;
		}
		console.log('result ' + result);
		res.status(200).send(result);
	});

	});

}

exports.remove = function(req, res){
	console.log("DELETE is called");
	conn.connect(function(err){
	if(err){
		console.log('MySQL connection error');
		throw err;
	}
//	var Query = conn.query('delete from test where ', function(err, ){

//	});

	});
}
