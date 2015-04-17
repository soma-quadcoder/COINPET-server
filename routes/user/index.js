/* 
 * 2015.4.2
 * Created by jeon
 * user router module
 * rainsy02@gmail.com
 *
 *
 */

var express = require('express');
var router = express.Router();
var kids = require('./kids.js');
var parents = require('./parents.js');
//var admin = require('./admin.setup.js');

console.log("./router/index.setup.js is loaded.");

router.use('/kids', kids);
router.use('/parents', parents);
//router.use('/admin', admin);

module.exports = router;