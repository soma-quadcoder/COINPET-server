/* 
 * 2015.4.2
 * Created by jeon
 * user router module
 * rainsy02@gmail.com

 * 2015.6.7
 * midify by kyuli
 * Sign up & Sign in module
 * fancy1031@gmail.com
 *
 */

var express = require('express');
var router = express.Router();
var kids = require('./kids.js');
var parents = require('./parents.js');
var admin = require('./admin.js');

console.log("./router/user/index.js is loaded.");

router.use('/kids', kids);
router.use('/parents', parents);
router.use('/admin', admin);

module.exports = router;