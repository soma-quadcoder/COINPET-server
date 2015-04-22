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

var user = require('./user/index');
// goal!
router.post('/goal', jwt({secret:secretKey}), goal.create);
router.get('/goal', jwt({secret : secretKey }), function(req, res){
	//자식의 자신 정보를 요청하는 경우
	if(req.user.fk_kids){
		console.log(req.user.fk_kids);
		goal.allGoal(req,res);
		return;
	}
	//부모가 잘못 요청한 경우
	if(req.user.fk_parents)
		res.status(500).json({"error" : "url"} ) ;
});
router.get('/goal/current', jwt({secret:secretKey}), function(req, res){
	//자식이 현재 진행중인 목표를 요청하는 경우
	if(req.user.fk_kids){
		goal.currentGoal(req, res);
		return;
	}
	if(req.user.fk_parents)
		res.status(500).json('error : url');
});
router.get('/goal/:fk_kids', jwt({secret : secretKey}), function(req, res){
	if(req.user.fk_kids){
		goal.allGoal(req, res);
		return;
	}
	//부모가 자식의 목표들을 요청하는 경우
	if(req.user.fk_parents){
		goal.allGoalParents(req, res);
		return;
	}
});
//router.get('/goal/current/:fk_kids', jwt({secret:secretKey}), goal.currentGoal);
router.get('/goal/current/:fk_kids', jwt({secret:secretKey}), function(req, res){
	if(req.user.fk_kids){
		goal.currentGoal(req, res);
		return;
	}
	//부모가 자식의 현재 수행하는 목표를 요청하느 ㄴ경우
	if(req.user.fk_parents){
		goal.currentGoalParents(req,res);
		return;
	}
});

router.put('/goal', jwt({secret:secretKey}), goal.update);
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
