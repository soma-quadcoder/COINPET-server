var express = require('express');
var mysql = require('mysql');
var db = express.Router();

db = mysql.createPool({
	host : '172.16.101.196',
	port : 3306,
	user : 'coinpet',
	password : 'dbaudghks',
	database : 'coinpet',
	connectionLimit : 20,
	multipleStatements : true,
	waitForConnections:false
});

module.exports = db;
