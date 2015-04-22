var conn = require('./db.js');

//READ GET
exports.read = function(req, res){
	console.log("saving list call");
	conn.getConnection(function(err,connection){
	if(err){
		console.error('MySQl connection err');
		throw err;
	}
	var Query = conn.query('select * from saving_list where fk_kids = ? ',req.user.fk_kids, function(err, rows){
		if(err){
			connection.release();
		}
		console.log(rows);
		res.status(200).send();
		connection.release();
	});
	});
}

