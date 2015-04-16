/* 
 * 2015.4.16
 * Create by kyuli
 * user router module
 * kyuli.yeo@gmail.com
 *
 *
 */
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var secretKey = require('../jwtKey');
//including js file
var goal = require('../connectors/goal.js');
var pocket = require('../connectors/pocket.js');
var saving = require('../connectors/saving.js');

var user = require('./user');


//router.use('/', jwt({secret:secretKey}).unless('/user'));


// goal!
router.post('/goal', jwt({secret:secretKey}), goal.create);
//router.get('/goal', goal.read);
router.get('/goal/:fk_kids', jwt({secret:secretKey}), goal.allGoal);//부모가 보낼때는 fk_kids를 부치고 보낸다.
router.get('/goal/current/:fk_kids', jwt({secret:secretKey}), goal.currentGoal);
//router.get('/goal/:fk_kids', goal.requireParents); // 부모가 자식의 
router.patch('/goal', jwt({secret:secretKey}), goal.update);
router.delete('/goal/:pk_goal', jwt({secret:secretKey}), goal.remove);
//saving_list
router.get('/saving', jwt({secret:secretKey}), saving.read);
//pocket!
router.post('/pocket', jwt({secret:secretKey}), pocket.create);
router.get('/pocket', jwt({secret:secretKey}), pocket.read);
router.patch('/pocket', jwt({secret:secretKey}), pocket.update);
router.delete('/pocket', jwt({secret:secretKey}), pocket.remove);

//jeon's router
router.use('/user', user);

module.exports = router;
