var webJwt = require('jsonwebtoken');
var express = require('express');
var jwt = require('express-jwt');
var secretKey = require('../connectors/user/jwtKey');

var json = require('express-json');
var db = require('../connectors/db-jeon');

console.log('./models/verfiy');

exports.read = function(req,res,next){
	console.log('models verify get()');
	res.send('verify get!!');

	//getToken
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){	
		console.log(req.headers.authorization.split(' ')[1]);
		var token = req.headers.authorization.split(' ')[1];
		//return req.headers.authorization.split(' ')[1];
		return next();
	}
	else
		return res.send('error');
	return null;

};
