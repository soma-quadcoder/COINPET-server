/* 
 * 2015.4.2
 * Created by jeon
 * Sign up & Sign in module
 * rainsy02@gmail.com
 *
 *
 */


var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var kids = require('../../connectors/user/kids.js');
var secretKey = "secretKey";

console.log("./router/user/kids.js is loaded");

router.get('/', function() {
	console.log("get /user/kids is called");
	});

// create
router.post('/', kids.post);

// update
router.put('/', jwt({secret: secretKey}), kids.put);

// remove
router.delete('/', jwt({secret: secretKey}), kids.delete);

// patch
router.patch('/', jwt({secret: secretKey}), kids.patch);

module.exports = router;
