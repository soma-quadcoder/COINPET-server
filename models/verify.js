var webJwt = require('jsonwebtoken');
var express = require('express');
//var app = express();
var jwt = require('express-jwt');
var secretkey = 'secretkey';
/*
app.use(jwt({
	secret : secretkey,
	credentialsRequired : false,
	getToken : function formHeaderOrQuerystring(req){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		return req.headers.authorization.split(' ')[1];
	}
	else if(req.query && req.query.token){
		return req.query.token;
	}
	console.log('verify!!!');
	console.log(req.headers.quthorization + req.query);
	return null;
	}
}));



/*
app.post('/', function(req,res){
		console.log(JSON.stringify(req.body));

/*
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
*/
