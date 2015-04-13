/* 
 * 2015.4.2
 * Created by jeon
 * Sign up & Sign in module
 * rainsy02@gmail.com
 *
 *
 */


var express = require('express');
var router = express.Router();
var admin = require('../../connectors/user/admin.js');


console.log("./router/user/admin.js is loaded");

// create
router.post('/', admin.post);

// update
router.put('/', admin.put);

// remove
router.delete('/', admin.delete);

// patch
router.patch('/', admin.patch);

module.exports = router;
