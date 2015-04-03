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
var sign = require('../connectors/sign.js');

// create
router.post('/', sign.up);

// read
router.get('/', sign.in);

// update
router.put('/', sign.modify);

// remove
router.delete('/', sign.remove);

function signin(req, res) {

};

module.exports = router;
