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

// create
router.post('/parents', parents.up);

// read
router.get('/parents', parents.in);

// update
router.put('/parents', parents.modify);

// remove
router.delete('/parents', parents.remove);


module.exports = router;
