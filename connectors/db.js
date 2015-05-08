var express = require('express');
var mysql = require('mysql');
var db = express.Router();


db = mysql.createPool({
	host : 'localhost',
	port : 3306,
	user : 'Yeo Kyu Li',
	password : '1234',
	database : 'test',
	connectionLimit : 20,
//	multipleStatements : true,
	waitForConnections:false
});

module.exports = db;