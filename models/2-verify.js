var jwt = require('jsonwebtoken');
var app = require('express');
var expressJwt = require('express-jwt');

//	var token = req.token;
module.exports =  function(req, res){
	var token = jwt.sign(req.token, "secreykey", {expiresInMuinuites : 30});
	
	jwt.verify(token, 'scretkey', function(err, decoded){
	if(err){
		consol.elog("Error ! " + err);
	}
	console.log(decoded.id);
	});
}
