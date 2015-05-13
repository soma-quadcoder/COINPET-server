var express = require('express');
var mysql = require('mysql');
var db = express.Router();

db = mysql.createPool({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '1234',
	database : 'coinpet',
	connectionLimit : 20,
	multipleStatements : true,
	waitForConnections:false
});

module.exports = db;
