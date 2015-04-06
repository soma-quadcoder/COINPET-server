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
var kids = require('../../connectors/user/kids.js');


console.log("router/user/kids.js is loaded");

// create
router.post('/', kids.post);

// update
router.put('/', kids.put);

// remove
router.delete('/', kids.delete);

// patch
router.patch('/', kids.patch);

module.exports = router;
