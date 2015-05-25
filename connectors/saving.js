var conn = require('./db.js');

//GET saving list by kids
exports.read = function(req, res){
	console.log("GET /saving is called");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
	}

	if(req.user.fk_parents)
	{
		var Query = conn.query('select s.* from saving_list s, parents_has_kids p where s.fk_kids = p.fk_kids AND p.fk_parents = ?', req.user.fk_parents, function(err, rows)
		{
			if(err) {
				connection.release();
				console.log(err);
				res.status(500).send();
				return;
			}

			var resData = {};
			for(var i in rows)
			{
				var data = rows[i];
				var fk_kids = data.fk_kids;
				
				delete data.fk_kids;

				if(!resData[fk_kids])
				{
					resData[fk_kids] = [];
				}
				resData[fk_kids].push(data);
			}

			console.log(resData);
			res.json(resData);
			connection.release();
		});
		return;
	}

	var Query = conn.query('select * from saving_list where fk_kids = ? ',req.user.fk_kids, function(err, rows){
		if(err){
			connection.release();
			res.status(500).send();
			return;
		}
		console.log(rows);
		res.json(rows);
		connection.release();
	});
	});
}

//GET saving list by parents
exports.readParents = function(req, res){
	console.log("GET /saving is called");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
	}
	var condition = "p.fk_parents = " + req.user.fk_parents + " AND " +
					"p.fk_kids = " + req.params.fk_kids + " AND " +
					"s.fk_kids = " + req.params.fk_kids;
	var Query = conn.query("SELECT s.* FROM saving_list s, parents_has_kids p  WHERE "+condition, function(err, rows){
		console.log(Query.sql);
		if(err){
			connection.release();
			console.log(err);
		}
		console.log(rows);
		res.json(rows);
		connection.release();
	});
	});
}
