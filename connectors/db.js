var express = require('express');
var mysql = require('mysql');
var db = express.Router();


db = mysql.createPool({
	host : 'localhost',
	port : 3306,
	user : 'kyuli.yeo',
	password : '1234',
	database : 'kyukyu',
	connectionLimit : 20,
	waitForConnections:false
});

module.exports = db;
