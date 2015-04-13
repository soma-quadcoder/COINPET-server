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
var parents = require('../../connectors/user/parents.js');


console.log("./router/user/parents.js is loaded");

// create
router.post('/', parents.post);

// read
router.get('/', parents.get);

// update
router.put('/', parents.put);

// remove
router.delete('/', parents.delete);


module.exports = router;
