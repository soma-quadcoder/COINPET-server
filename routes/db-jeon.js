var express = require('express');
var mysql = require('mysql');
var db = express.Router();

db = mysql.createPool({
	host : 'localhost',
	port : 3306,
<<<<<<< HEAD
	user : 'kyuli.yeo',
=======
	user : 'root',
>>>>>>> d1a5753e6032a2232026b73ae70a65d89ff29964
	password : '1234',
	database : 'coinpet',
	connectionLimit : 20,
	multipleStatements : true,
	waitForConnections:false
});

module.exports = db;
