var conn = require('./db.js');

Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return yyyy +'-'+ (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0]); // padding
};

Date.prototype.hhmmss = function()
{
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();


    return (hh[1] ? hh : '0'+hh[0]) + ':' +
	(mm[1] ? mm : '0'+mm[0]) + ':' +
	(ss[1] ? ss : '0'+ss[0]);
}

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
				
				var date = new Date(data.date).yyyymmdd();
				var time = new Date(data.date).hhmmss();
				if(!resData[date])
				{
					resData[date] = {};
				}			
	
				if(!resData[date][fk_kids])
				{
					resData[date][fk_kids] = [];
				}
				
				delete data.date;
				data.time = time;
				resData[date][fk_kids].push(data);
			}

			console.log(resData);
			res.json(resData);
			connection.release();
		});
		return;
	}

	conn.query('select * from saving_list where fk_kids = ? ',req.user.fk_kids, function(err, rows){
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
	conn.query("SELECT s.* FROM saving_list s, parents_has_kids p  WHERE "+condition, function(err, rows){
		console.log(Query.sql);
		if(err){
			connection.release();
			console.log(err);
			res.status(500).send();
			return;
		}
		console.log(rows);
		res.json(rows);
		connection.release();
	});
	});
}
